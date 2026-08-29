"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { dictionary, type Locale, type Dictionary } from "./dictionary";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    const stored = window.localStorage.getItem("noirsel-locale");
    if (stored === "es" || stored === "en") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe: syncing from localStorage after mount
      setLocaleState(stored);
    }
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem("noirsel-locale", next);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: dictionary[locale] as unknown as Dictionary }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
