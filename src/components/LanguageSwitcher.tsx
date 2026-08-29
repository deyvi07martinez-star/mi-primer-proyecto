"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";

export function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const { locale, setLocale } = useLocale();

  const base = dark ? "text-bone/70" : "text-carbon/70";
  const active = dark ? "text-bone" : "text-carbon";

  return (
    <div className="flex items-center gap-1 text-xs tracking-widest uppercase">
      <button
        onClick={() => setLocale("es")}
        className={`px-1.5 py-1 transition-colors cursor-pointer ${locale === "es" ? `${active} font-semibold` : `${base} hover:opacity-80`}`}
      >
        ES
      </button>
      <span className={base}>/</span>
      <button
        onClick={() => setLocale("en")}
        className={`px-1.5 py-1 transition-colors cursor-pointer ${locale === "en" ? `${active} font-semibold` : `${base} hover:opacity-80`}`}
      >
        EN
      </button>
    </div>
  );
}
