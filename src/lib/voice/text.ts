/** Quita acentos, signos y mayusculas para comparar palabras sin sorpresas. */
export function normalizeWord(word: string): string {
  return word
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\u00f1]/gi, "");
}

export type TextToken = {
  raw: string;
  key: string;
};

/** Parte un texto en palabras, conservando el original para mostrarlo. */
export function splitWords(text: string): TextToken[] {
  return text
    .split(/\s+/)
    .map((raw) => ({ raw, key: normalizeWord(raw) }))
    .filter((token) => token.key.length > 0);
}
