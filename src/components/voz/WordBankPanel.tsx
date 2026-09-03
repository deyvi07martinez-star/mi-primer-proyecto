"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Square, Trash2, Volume2 } from "lucide-react";
import { decodeBlob, playBufferToEnd } from "@/lib/voice/engine";
import { getPreset, type PresetId } from "@/lib/voice/presets";
import { clearClips, deleteClip, listClips, saveClip, type VoiceClip } from "@/lib/voice/clipStore";
import { speak, speechSupported, stopSpeaking } from "@/lib/voice/speech";
import { normalizeWord, splitWords } from "@/lib/voice/text";
import { useRecorder } from "@/lib/voice/useRecorder";
import { ActionButton, EffectPicker, LevelMeter, Panel, RecordButton, Slider } from "./ui";

const PAUSE_MS = 110;

/**
 * Banco de palabras: la persona graba palabras sueltas y luego escribe una
 * frase, que se reproduce encadenando sus propias grabaciones.
 */
export function WordBankPanel() {
  const recorder = useRecorder();
  const [clips, setClips] = useState<VoiceClip[]>([]);
  const [word, setWord] = useState("");
  const [phrase, setPhrase] = useState("");
  const [presetId, setPresetId] = useState<PresetId>("natural");
  const [pitch, setPitch] = useState(1);
  const [fillWithSynth, setFillWithSynth] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const buffersRef = useRef(new Map<string, AudioBuffer>());
  const stopRef = useRef<{ stopped: boolean; cancel: (() => void) | null }>({
    stopped: false,
    cancel: null,
  });

  const preset = getPreset(presetId);

  const refresh = useCallback(async () => {
    try {
      setClips(await listClips());
    } catch {
      setStatus("Este navegador no deja guardar clips (modo privado?).");
    }
  }, []);

  useEffect(() => {
    let alive = true;
    listClips()
      .then((stored) => alive && setClips(stored))
      .catch(() => alive && setStatus("Este navegador no deja guardar clips (modo privado?)."));
    return () => {
      alive = false;
    };
  }, []);

  const choosePreset = (id: PresetId) => {
    setPresetId(id);
    setPitch(getPreset(id).pitch);
  };

  const bufferFor = useCallback(async (clip: VoiceClip) => {
    const cached = buffersRef.current.get(clip.id);
    if (cached) return cached;
    const buffer = await decodeBlob(clip.blob);
    buffersRef.current.set(clip.id, buffer);
    return buffer;
  }, []);

  const toggleRecording = async () => {
    if (recorder.state === "recording") {
      const blob = await recorder.stop();
      const label = word.trim();
      if (!blob || !label) return;
      await saveClip({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        word: label,
        key: normalizeWord(label),
        blob,
        createdAt: Date.now(),
      });
      setWord("");
      setStatus(`Guardado: "${label}"`);
      await refresh();
      return;
    }
    if (!word.trim()) {
      setStatus("Escribe primero la palabra que vas a grabar.");
      return;
    }
    setStatus(null);
    await recorder.start();
  };

  const playClip = async (clip: VoiceClip) => {
    const buffer = await bufferFor(clip);
    const { done, cancel } = playBufferToEnd(buffer, { preset, pitch });
    stopRef.current.cancel = cancel;
    await done;
  };

  const removeClip = async (clip: VoiceClip) => {
    await deleteClip(clip.id);
    buffersRef.current.delete(clip.id);
    await refresh();
  };

  const stopAll = () => {
    stopRef.current.stopped = true;
    stopRef.current.cancel?.();
    stopSpeaking();
    setSpeaking(false);
  };

  /** Encadena los clips grabados; las palabras sin clip las dice la voz del navegador. */
  const sayPhrase = async () => {
    const tokens = splitWords(phrase);
    if (tokens.length === 0) return;

    stopRef.current = { stopped: false, cancel: null };
    setSpeaking(true);
    setStatus(null);

    const byKey = new Map(clips.map((clip) => [clip.key, clip]));
    const missing: string[] = [];

    for (const token of tokens) {
      if (stopRef.current.stopped) break;
      const clip = byKey.get(token.key);
      if (clip) {
        await playClip(clip);
      } else {
        missing.push(token.raw);
        if (fillWithSynth && speechSupported()) {
          await speak(token.raw, {
            pitch: preset.speech.pitch,
            rate: preset.speech.rate,
          });
        }
      }
      await new Promise((resolve) => setTimeout(resolve, PAUSE_MS));
    }

    setSpeaking(false);
    setStatus(
      missing.length === 0
        ? "Dicho entero con tu voz."
        : `Sin grabar todavia: ${[...new Set(missing)].join(", ")}`,
    );
  };

  const recording = recorder.state === "recording";
  const missingWords = [...new Set(splitWords(phrase).map((t) => t.key))].filter(
    (key) => !clips.some((clip) => clip.key === key),
  );

  return (
    <Panel
      title="Habla con mis palabras"
      hint="Graba palabras sueltas con tu voz y guardalas. Cuando escribas una frase, la digo encadenando tus propias grabaciones; lo que no tengas grabado lo pone la voz del navegador."
    >
      <div className="flex flex-wrap items-end gap-3">
        <label className="min-w-[220px] flex-1">
          <span className="text-[11px] uppercase tracking-widest text-bone/50">
            Palabra a grabar
          </span>
          <input
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="hola"
            className="mt-2 w-full border border-bone/20 bg-carbon px-3 py-2.5 text-bone placeholder:text-bone/30 focus:border-copper focus:outline-none"
          />
        </label>
        <RecordButton
          recording={recording}
          disabled={recorder.state === "requesting"}
          seconds={recorder.seconds}
          onClick={() => void toggleRecording()}
          labelIdle="Grabar palabra"
          labelRecording="Guardar"
        />
      </div>

      {recording && (
        <div className="mt-4">
          <LevelMeter level={recorder.level} />
        </div>
      )}

      <div className="mt-6">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] uppercase tracking-widest text-bone/50">
            Mis palabras ({clips.length})
          </span>
          {clips.length > 0 && (
            <button
              type="button"
              onClick={() => {
                void clearClips().then(refresh);
                buffersRef.current.clear();
              }}
              className="text-[11px] uppercase tracking-widest text-bone/40 hover:text-copper-light"
            >
              Borrar todas
            </button>
          )}
        </div>
        {clips.length === 0 ? (
          <p className="mt-3 text-sm text-bone/45">
            Aun no hay palabras grabadas. Empieza por &quot;hola&quot;.
          </p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {clips.map((clip) => (
              <li
                key={clip.id}
                className="flex items-center gap-2 border border-bone/15 bg-carbon px-3 py-1.5 text-sm text-bone/80"
              >
                <button
                  type="button"
                  onClick={() => void playClip(clip)}
                  className="text-copper-light hover:text-copper"
                  aria-label={`Escuchar ${clip.word}`}
                >
                  <Play size={13} />
                </button>
                {clip.word}
                <button
                  type="button"
                  onClick={() => void removeClip(clip)}
                  className="text-bone/35 hover:text-copper-light"
                  aria-label={`Borrar ${clip.word}`}
                >
                  <Trash2 size={13} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8 border-t border-bone/10 pt-6">
        <textarea
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
          rows={3}
          placeholder="Escribe una frase con tus palabras..."
          className="w-full resize-y border border-bone/20 bg-carbon px-4 py-3 text-bone placeholder:text-bone/30 focus:border-copper focus:outline-none"
        />

        {missingWords.length > 0 && (
          <p className="mt-3 text-sm text-bone/50">
            Te faltan por grabar:{" "}
            {missingWords.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setWord(key)}
                className="mr-2 border-b border-dashed border-copper/60 text-copper-light"
              >
                {key}
              </button>
            ))}
          </p>
        )}

        <div className="mt-5">
          <EffectPicker value={presetId} onChange={choosePreset} />
        </div>

        <div className="mt-5 max-w-xs">
          <Slider
            label="Tono"
            value={pitch}
            min={0.4}
            max={2.5}
            step={0.01}
            onChange={setPitch}
            format={(v) => `${v.toFixed(2)}x`}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <ActionButton
            variant="solid"
            onClick={() => void sayPhrase()}
            disabled={speaking || !phrase.trim()}
          >
            <Volume2 size={15} /> Decirlo con mi voz
          </ActionButton>
          <ActionButton onClick={stopAll} disabled={!speaking}>
            <Square size={15} /> Parar
          </ActionButton>
          <label className="flex items-center gap-2 text-sm text-bone/60">
            <input
              type="checkbox"
              checked={fillWithSynth}
              onChange={(e) => setFillWithSynth(e.target.checked)}
              className="accent-copper"
            />
            Rellenar lo que falte con la voz del navegador
          </label>
        </div>
      </div>

      {(status || recorder.error) && (
        <p className="mt-4 text-sm text-copper-light">{recorder.error ?? status}</p>
      )}
    </Panel>
  );
}
