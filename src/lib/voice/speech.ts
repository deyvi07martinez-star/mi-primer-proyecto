/** Utilidades sobre la voz sintetica del navegador (Web Speech API). */

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/**
 * Las voces llegan de forma asincrona en algunos navegadores, asi que hay que
 * escuchar `voiceschanged` ademas de pedirlas una primera vez.
 */
export function subscribeToVoices(
  onVoices: (voices: SpeechSynthesisVoice[]) => void,
): () => void {
  if (!speechSupported()) return () => {};
  const emit = () => onVoices(window.speechSynthesis.getVoices());
  emit();
  window.speechSynthesis.addEventListener("voiceschanged", emit);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", emit);
}

/** Ordena poniendo delante las voces en espanol. */
export function sortVoices(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  return [...voices].sort((a, b) => {
    const aEs = a.lang.toLowerCase().startsWith("es") ? 0 : 1;
    const bEs = b.lang.toLowerCase().startsWith("es") ? 0 : 1;
    if (aEs !== bEs) return aEs - bEs;
    return a.name.localeCompare(b.name);
  });
}

export type SpeakOptions = {
  voiceUri?: string;
  pitch?: number;
  rate?: number;
  volume?: number;
};

/** Dice un texto en voz alta y resuelve cuando termina. */
export function speak(text: string, options: SpeakOptions = {}): Promise<void> {
  if (!speechSupported() || !text.trim()) return Promise.resolve();

  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const voice =
      voices.find((v) => v.voiceURI === options.voiceUri) ??
      voices.find((v) => v.lang.toLowerCase().startsWith("es"));
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = "es-ES";
    }
    utterance.pitch = Math.min(2, Math.max(0, options.pitch ?? 1));
    utterance.rate = Math.min(4, Math.max(0.1, options.rate ?? 1));
    utterance.volume = options.volume ?? 1;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking(): void {
  if (speechSupported()) window.speechSynthesis.cancel();
}
