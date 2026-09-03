"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Headphones, Play, Trash2 } from "lucide-react";
import {
  createEffectChain,
  decodeBlob,
  getAudioContext,
  playBufferToEnd,
  renderToWav,
  type EffectChain,
} from "@/lib/voice/engine";
import { getPreset, type PresetId } from "@/lib/voice/presets";
import { useRecorder } from "@/lib/voice/useRecorder";
import { ActionButton, EffectPicker, LevelMeter, Panel, RecordButton, Slider } from "./ui";

/** Graba una frase y la devuelve transformada: "di algo y yo lo repito". */
export function EchoPanel() {
  const recorder = useRecorder();
  const [presetId, setPresetId] = useState<PresetId>("ardilla");
  const [pitch, setPitch] = useState(getPreset("ardilla").pitch);
  const [speed, setSpeed] = useState(1);
  const [autoRepeat, setAutoRepeat] = useState(true);
  const [clip, setClip] = useState<AudioBuffer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [live, setLive] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const cancelRef = useRef<(() => void) | null>(null);
  const liveRef = useRef<{ stream: MediaStream; chain: EffectChain } | null>(null);

  const preset = getPreset(presetId);

  const choosePreset = (id: PresetId) => {
    setPresetId(id);
    setPitch(getPreset(id).pitch);
  };

  const play = useCallback(
    (buffer: AudioBuffer, withPreset = preset, withPitch = pitch, withSpeed = speed) => {
      cancelRef.current?.();
      const { done, cancel } = playBufferToEnd(buffer, {
        preset: withPreset,
        pitch: withPitch,
        speed: withSpeed,
      });
      cancelRef.current = cancel;
      setPlaying(true);
      void done.then(() => {
        cancelRef.current = null;
        setPlaying(false);
      });
    },
    [preset, pitch, speed],
  );

  const toggleRecording = async () => {
    if (recorder.state === "recording") {
      const blob = await recorder.stop();
      if (!blob) return;
      try {
        const buffer = await decodeBlob(blob);
        setClip(buffer);
        setStatus(null);
        if (autoRepeat) play(buffer);
      } catch {
        setStatus("No se pudo leer la grabacion en este navegador.");
      }
      return;
    }
    setStatus(null);
    await recorder.start();
  };

  const download = async () => {
    if (!clip) return;
    setStatus("Preparando el archivo...");
    try {
      const wav = await renderToWav(clip, { preset, pitch, speed });
      const url = URL.createObjectURL(wav);
      const link = document.createElement("a");
      link.href = url;
      link.download = `mi-voz-${preset.id}.wav`;
      link.click();
      URL.revokeObjectURL(url);
      setStatus("Archivo descargado.");
    } catch {
      setStatus("No se pudo exportar el audio.");
    }
  };

  const stopLive = useCallback(() => {
    const current = liveRef.current;
    if (!current) return;
    current.chain.dispose();
    current.stream.getTracks().forEach((track) => track.stop());
    liveRef.current = null;
  }, []);

  // Monitor en directo: microfono -> efectos -> altavoces.
  useEffect(() => {
    if (!live) {
      stopLive();
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
        });
        const ctx = await getAudioContext();
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        const chain = createEffectChain(ctx, preset, pitch);
        ctx.createMediaStreamSource(stream).connect(chain.input);
        chain.output.connect(ctx.destination);
        liveRef.current = { stream, chain };
      } catch {
        if (!cancelled) {
          setLive(false);
          setStatus("No se pudo abrir el microfono para el directo.");
        }
      }
    })();
    return () => {
      cancelled = true;
      stopLive();
    };
    // El tono se ajusta en caliente mas abajo; solo el preset rehace la cadena.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, presetId, stopLive]);

  useEffect(() => {
    liveRef.current?.chain.setPitch(pitch);
  }, [pitch]);

  useEffect(() => () => cancelRef.current?.(), []);

  const recording = recorder.state === "recording";

  return (
    <Panel
      title="Di algo y lo repito"
      hint="Graba una frase con el microfono y la devuelvo con el efecto que elijas. El tono cambia sin acelerar la voz, asi que la frase dura lo mismo."
    >
      <EffectPicker value={presetId} onChange={choosePreset} />

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Slider
          label="Tono"
          value={pitch}
          min={0.4}
          max={2.5}
          step={0.01}
          onChange={setPitch}
          format={(v) => `${v.toFixed(2)}x`}
        />
        <Slider
          label="Velocidad"
          value={speed}
          min={0.5}
          max={1.6}
          step={0.01}
          onChange={setSpeed}
          format={(v) => `${v.toFixed(2)}x`}
        />
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <RecordButton
          recording={recording}
          disabled={recorder.state === "requesting"}
          seconds={recorder.seconds}
          onClick={() => void toggleRecording()}
        />
        <ActionButton onClick={() => clip && play(clip)} disabled={!clip || playing}>
          <Play size={15} /> Repetir
        </ActionButton>
        <ActionButton onClick={() => void download()} disabled={!clip}>
          <Download size={15} /> Descargar
        </ActionButton>
        {clip && (
          <ActionButton
            variant="ghost"
            onClick={() => {
              cancelRef.current?.();
              setClip(null);
              setStatus(null);
            }}
          >
            <Trash2 size={15} /> Borrar
          </ActionButton>
        )}
      </div>

      {recording && (
        <div className="mt-5">
          <LevelMeter level={recorder.level} />
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 border-t border-bone/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-3 text-sm text-bone/70">
          <input
            type="checkbox"
            checked={autoRepeat}
            onChange={(e) => setAutoRepeat(e.target.checked)}
            className="accent-copper"
          />
          Repetir automaticamente al terminar de grabar
        </label>
        <label className="flex items-center gap-3 text-sm text-bone/70">
          <input
            type="checkbox"
            checked={live}
            onChange={(e) => setLive(e.target.checked)}
            className="accent-copper"
          />
          <Headphones size={15} /> Escucharme en vivo (usa auriculares)
        </label>
      </div>

      {(status || recorder.error) && (
        <p className="mt-4 text-sm text-copper-light">{recorder.error ?? status}</p>
      )}
    </Panel>
  );
}
