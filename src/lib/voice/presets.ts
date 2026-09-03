export type PresetId =
  | "natural"
  | "ardilla"
  | "monstruo"
  | "robot"
  | "eco"
  | "radio"
  | "alien"
  | "gigante";

export type VoicePreset = {
  id: PresetId;
  name: string;
  description: string;
  /** Factor de tono aplicado por el AudioWorklet (1 = sin cambio). */
  pitch: number;
  /** Frecuencia de la modulacion en anillo, en Hz (efecto robot). */
  ring?: number;
  /** Vibrato: velocidad en Hz y profundidad en segundos de retardo. */
  vibrato?: { rate: number; depth: number };
  /** Eco: retardo en segundos, realimentacion 0-1 y nivel de la copia. */
  echo?: { time: number; feedback: number; mix: number };
  filter?: { type: BiquadFilterType; frequency: number; q?: number };
  /** Saturacion 0-1 (0 = limpio). */
  drive?: number;
  /** Compensacion de volumen del preset. */
  gain?: number;
  /** Equivalente del mismo personaje para la voz sintetica (texto -> voz). */
  speech: { pitch: number; rate: number };
};

export const PRESETS: VoicePreset[] = [
  {
    id: "natural",
    name: "Mi voz",
    description: "Tal cual la grabaste, sin efectos.",
    pitch: 1,
    speech: { pitch: 1, rate: 1 },
  },
  {
    id: "ardilla",
    name: "Ardilla",
    description: "Muy aguda y divertida.",
    pitch: 1.7,
    gain: 0.9,
    speech: { pitch: 2, rate: 1.25 },
  },
  {
    id: "monstruo",
    name: "Monstruo",
    description: "Grave y cavernosa.",
    pitch: 0.6,
    filter: { type: "lowpass", frequency: 3200 },
    gain: 1.2,
    speech: { pitch: 0.2, rate: 0.8 },
  },
  {
    id: "robot",
    name: "Robot",
    description: "Metalica, con modulacion en anillo.",
    pitch: 1,
    ring: 42,
    filter: { type: "bandpass", frequency: 1400, q: 0.8 },
    gain: 1.6,
    speech: { pitch: 0.6, rate: 0.9 },
  },
  {
    id: "eco",
    name: "Cueva",
    description: "Con eco largo, como en una gruta.",
    pitch: 0.92,
    echo: { time: 0.28, feedback: 0.5, mix: 0.6 },
    speech: { pitch: 0.85, rate: 0.9 },
  },
  {
    id: "radio",
    name: "Radio vieja",
    description: "Filtrada y saturada, como un transistor.",
    pitch: 1,
    filter: { type: "bandpass", frequency: 1600, q: 1.4 },
    drive: 0.55,
    gain: 1.5,
    speech: { pitch: 1, rate: 1 },
  },
  {
    id: "alien",
    name: "Alien",
    description: "Aguda y temblorosa.",
    pitch: 1.35,
    vibrato: { rate: 6.5, depth: 0.0022 },
    echo: { time: 0.13, feedback: 0.25, mix: 0.35 },
    speech: { pitch: 1.7, rate: 1.1 },
  },
  {
    id: "gigante",
    name: "Gigante",
    description: "Grave, lenta y enorme.",
    pitch: 0.72,
    echo: { time: 0.42, feedback: 0.32, mix: 0.4 },
    filter: { type: "lowpass", frequency: 2400 },
    gain: 1.25,
    speech: { pitch: 0.3, rate: 0.75 },
  },
];

export const DEFAULT_PRESET = PRESETS[0];

export function getPreset(id: PresetId): VoicePreset {
  return PRESETS.find((p) => p.id === id) ?? DEFAULT_PRESET;
}
