"use client";

import { useEffect, useMemo, useState } from "react";
import { Square, Volume2 } from "lucide-react";
import { getPreset, type PresetId } from "@/lib/voice/presets";
import { sortVoices, speak, speechSupported, stopSpeaking, subscribeToVoices } from "@/lib/voice/speech";
import { ActionButton, EffectPicker, Panel, Slider } from "./ui";

/** Escribes un texto y el navegador lo dice en voz alta. */
export function SpeakPanel() {
  const [text, setText] = useState("Hola, esto lo escribi yo y ahora suena en voz alta.");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceUri, setVoiceUri] = useState("");
  const [presetId, setPresetId] = useState<PresetId>("natural");
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [speaking, setSpeaking] = useState(false);

  const supported = typeof window !== "undefined" && speechSupported();

  useEffect(() => subscribeToVoices((list) => setVoices(sortVoices(list))), []);
  useEffect(() => stopSpeaking, []);

  const spanishFirst = useMemo(
    () => voices.find((v) => v.lang.toLowerCase().startsWith("es")) ?? voices[0],
    [voices],
  );
  const selectedVoice = voiceUri || spanishFirst?.voiceURI || "";

  const choosePreset = (id: PresetId) => {
    setPresetId(id);
    const { speech } = getPreset(id);
    setPitch(speech.pitch);
    setRate(speech.rate);
  };

  const say = async () => {
    stopSpeaking();
    setSpeaking(true);
    await speak(text, { voiceUri: selectedVoice, pitch, rate });
    setSpeaking(false);
  };

  if (!supported) {
    return (
      <Panel title="Escribe y lo digo">
        <p className="text-sm text-bone/60">
          Este navegador no tiene voz sintetica. Prueba en Chrome, Edge o Safari actualizados.
        </p>
      </Panel>
    );
  }

  return (
    <Panel
      title="Escribe y lo digo"
      hint="Escribe cualquier cosa y suena en voz alta con la voz del navegador. Los efectos aqui se traducen a tono y velocidad de esa voz; para escuchar tu propia voz transformada usa las otras dos pestanas."
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        className="w-full resize-y border border-bone/20 bg-carbon px-4 py-3 text-bone placeholder:text-bone/30 focus:border-copper focus:outline-none"
        placeholder="Escribe aqui lo que quieres que diga..."
      />

      <div className="mt-5">
        <EffectPicker value={presetId} onChange={choosePreset} />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <label className="block sm:col-span-1">
          <span className="text-[11px] uppercase tracking-widest text-bone/50">Voz</span>
          <select
            value={selectedVoice}
            onChange={(e) => setVoiceUri(e.target.value)}
            className="mt-2 w-full border border-bone/20 bg-carbon px-3 py-2 text-sm text-bone focus:border-copper focus:outline-none"
          >
            {voices.length === 0 && <option value="">Cargando voces...</option>}
            {voices.map((voice) => (
              <option key={voice.voiceURI} value={voice.voiceURI}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </label>
        <Slider
          label="Tono"
          value={pitch}
          min={0}
          max={2}
          step={0.05}
          onChange={setPitch}
          format={(v) => v.toFixed(2)}
        />
        <Slider
          label="Velocidad"
          value={rate}
          min={0.5}
          max={2}
          step={0.05}
          onChange={setRate}
          format={(v) => `${v.toFixed(2)}x`}
        />
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        <ActionButton variant="solid" onClick={() => void say()} disabled={!text.trim()}>
          <Volume2 size={15} /> Decirlo
        </ActionButton>
        <ActionButton
          onClick={() => {
            stopSpeaking();
            setSpeaking(false);
          }}
          disabled={!speaking}
        >
          <Square size={15} /> Parar
        </ActionButton>
      </div>
    </Panel>
  );
}
