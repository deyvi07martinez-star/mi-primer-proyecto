import type { VoicePreset } from "./presets";

const WORKLET_URL = "/worklets/pitch-shifter.js";

let sharedContext: AudioContext | null = null;
const workletReady = new WeakMap<BaseAudioContext, Promise<void>>();

function loadWorklet(ctx: BaseAudioContext): Promise<void> {
  let ready = workletReady.get(ctx);
  if (!ready) {
    ready = ctx.audioWorklet.addModule(WORKLET_URL);
    workletReady.set(ctx, ready);
  }
  return ready;
}

/** Contexto de audio compartido: se crea con el primer gesto del usuario. */
export async function getAudioContext(): Promise<AudioContext> {
  if (!sharedContext || sharedContext.state === "closed") {
    sharedContext = new AudioContext();
    workletReady.delete(sharedContext);
  }
  await loadWorklet(sharedContext);
  if (sharedContext.state === "suspended") await sharedContext.resume();
  return sharedContext;
}

async function createOfflineContext(length: number, sampleRate: number) {
  const ctx = new OfflineAudioContext(1, Math.max(1, Math.ceil(length)), sampleRate);
  await loadWorklet(ctx);
  return ctx;
}

export type EffectChain = {
  /** Nodo al que conectar la fuente de sonido. */
  input: AudioNode;
  /** Nodo que entrega el resultado ya procesado. */
  output: AudioNode;
  /** Ajusta el tono en caliente (por ejemplo desde un deslizador). */
  setPitch: (value: number) => void;
  /** Apaga osciladores internos y desconecta la cadena. */
  dispose: () => void;
};

function makeDriveCurve(amount: number) {
  const n = 1024;
  const curve = new Float32Array(n);
  const k = amount * 60;
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = ((1 + k) * x) / (1 + k * Math.abs(x));
  }
  return curve;
}

/**
 * Construye la cadena de efectos de un preset. `pitchOverride` permite que el
 * deslizador de tono mande sobre el valor del preset.
 */
export function createEffectChain(
  ctx: BaseAudioContext,
  preset: VoicePreset,
  pitchOverride?: number,
): EffectChain {
  const input = ctx.createGain();
  const output = ctx.createGain();
  output.gain.value = preset.gain ?? 1;

  const shifter = new AudioWorkletNode(ctx, "pitch-shifter", {
    numberOfInputs: 1,
    numberOfOutputs: 1,
    outputChannelCount: [1],
  });
  const pitchParam = shifter.parameters.get("pitch");
  const setPitch = (value: number) => {
    if (pitchParam) pitchParam.value = Math.min(4, Math.max(0.25, value));
  };
  setPitch(pitchOverride ?? preset.pitch);

  const started: OscillatorNode[] = [];
  const nodes: AudioNode[] = [input, shifter, output];

  input.connect(shifter);
  let tail: AudioNode = shifter;

  if (preset.filter) {
    const filter = ctx.createBiquadFilter();
    filter.type = preset.filter.type;
    filter.frequency.value = preset.filter.frequency;
    if (preset.filter.q !== undefined) filter.Q.value = preset.filter.q;
    tail.connect(filter);
    nodes.push(filter);
    tail = filter;
  }

  if (preset.drive) {
    const shaper = ctx.createWaveShaper();
    shaper.curve = makeDriveCurve(preset.drive);
    shaper.oversample = "2x";
    tail.connect(shaper);
    nodes.push(shaper);
    tail = shaper;
  }

  if (preset.ring) {
    // Modulacion en anillo: la senal pasa por una ganancia cuyo valor lo
    // dicta un oscilador, lo que multiplica ambas ondas.
    const ring = ctx.createGain();
    ring.gain.value = 0;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = preset.ring;
    lfo.connect(ring.gain);
    lfo.start();
    started.push(lfo);
    tail.connect(ring);
    nodes.push(ring);
    tail = ring;
  }

  if (preset.vibrato) {
    const delay = ctx.createDelay(0.2);
    delay.delayTime.value = 0.006;
    const lfo = ctx.createOscillator();
    const depth = ctx.createGain();
    lfo.frequency.value = preset.vibrato.rate;
    depth.gain.value = preset.vibrato.depth;
    lfo.connect(depth);
    depth.connect(delay.delayTime);
    lfo.start();
    started.push(lfo);
    tail.connect(delay);
    nodes.push(delay, depth);
    tail = delay;
  }

  if (preset.echo) {
    const delay = ctx.createDelay(2);
    const feedback = ctx.createGain();
    const wet = ctx.createGain();
    delay.delayTime.value = preset.echo.time;
    feedback.gain.value = preset.echo.feedback;
    wet.gain.value = preset.echo.mix;
    tail.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(output);
    nodes.push(delay, feedback, wet);
  }

  tail.connect(output);

  return {
    input,
    output,
    setPitch,
    dispose: () => {
      for (const osc of started) {
        try {
          osc.stop();
        } catch {
          // ya estaba parado
        }
      }
      for (const node of nodes) node.disconnect();
    },
  };
}

/** Cola de reverberacion/eco que hay que dejar sonar al exportar. */
function tailSeconds(preset: VoicePreset): number {
  if (!preset.echo) return 0.2;
  return preset.echo.time * (1 + preset.echo.feedback * 12) + 0.3;
}

export type PlaybackOptions = {
  preset: VoicePreset;
  pitch?: number;
  speed?: number;
};

/** Reproduce un buffer por la cadena de efectos; `done` resuelve al acabar. */
export function playBufferToEnd(
  buffer: AudioBuffer,
  options: PlaybackOptions,
): { done: Promise<void>; cancel: () => void } {
  let cancel = () => {};
  const done = new Promise<void>((resolve) => {
    void (async () => {
      const ctx = await getAudioContext();
      const chain = createEffectChain(ctx, options.preset, options.pitch);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = options.speed ?? 1;
      source.connect(chain.input);
      chain.output.connect(ctx.destination);
      const finish = () => {
        source.disconnect();
        chain.dispose();
        resolve();
      };
      source.onended = finish;
      cancel = () => {
        try {
          source.stop();
        } catch {
          finish();
        }
      };
      source.start();
    })();
  });
  return { done, cancel };
}

export async function decodeBlob(blob: Blob): Promise<AudioBuffer> {
  const ctx = await getAudioContext();
  const bytes = await blob.arrayBuffer();
  return ctx.decodeAudioData(bytes);
}

/**
 * Renderiza la grabacion con los efectos aplicados y devuelve un WAV, para
 * que se pueda descargar y compartir.
 */
export async function renderToWav(
  buffer: AudioBuffer,
  { preset, pitch, speed = 1 }: PlaybackOptions,
): Promise<Blob> {
  const sampleRate = buffer.sampleRate;
  const length = buffer.length / speed + tailSeconds(preset) * sampleRate;
  const ctx = await createOfflineContext(length, sampleRate);
  const chain = createEffectChain(ctx, preset, pitch);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.playbackRate.value = speed;
  source.connect(chain.input);
  chain.output.connect(ctx.destination);
  source.start();
  const rendered = await ctx.startRendering();
  return audioBufferToWav(rendered);
}

/** Codifica un AudioBuffer como WAV PCM de 16 bits. */
export function audioBufferToWav(buffer: AudioBuffer): Blob {
  const channels = Math.min(2, buffer.numberOfChannels);
  const frames = buffer.length;
  const bytes = new ArrayBuffer(44 + frames * channels * 2);
  const view = new DataView(bytes);

  const writeText = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i));
  };

  writeText(0, "RIFF");
  view.setUint32(4, 36 + frames * channels * 2, true);
  writeText(8, "WAVE");
  writeText(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, buffer.sampleRate, true);
  view.setUint32(28, buffer.sampleRate * channels * 2, true);
  view.setUint16(32, channels * 2, true);
  view.setUint16(34, 16, true);
  writeText(36, "data");
  view.setUint32(40, frames * channels * 2, true);

  const data = Array.from({ length: channels }, (_, c) => buffer.getChannelData(c));
  let offset = 44;
  for (let i = 0; i < frames; i++) {
    for (let c = 0; c < channels; c++) {
      const clamped = Math.max(-1, Math.min(1, data[c][i]));
      view.setInt16(offset, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([bytes], { type: "audio/wav" });
}
