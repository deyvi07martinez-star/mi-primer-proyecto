"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { melaContent, type MelaContent, type MelaLocale } from "./content";

type Ctx = { locale: MelaLocale; setLocale: (l: MelaLocale) => void; c: MelaContent };

const MelaLocaleContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "mela-lang";

export function MelaLocaleProvider({ children }: { children: ReactNode }) {
  // El servidor siempre renderiza español; si el visitante guardó inglés o su
  // navegador no está en español, cambiamos después de montar para no romper
  // la hidratación.
  const [locale, setLocaleState] = useState<MelaLocale>("es");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const next: MelaLocale =
      stored === "en" || stored === "es"
        ? stored
        : navigator.language.startsWith("es")
          ? "es"
          : "en";
    if (next !== "es") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe: syncing from localStorage after mount
      setLocaleState(next);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: MelaLocale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Modo privado o almacenamiento bloqueado: el idioma vive solo en memoria.
    }
  }, []);

  return (
    <MelaLocaleContext.Provider value={{ locale, setLocale, c: melaContent[locale] }}>
      {children}
    </MelaLocaleContext.Provider>
  );
}

export function useMela() {
  const ctx = useContext(MelaLocaleContext);
  if (!ctx) throw new Error("useMela debe usarse dentro de MelaLocaleProvider");
  return ctx;
}
