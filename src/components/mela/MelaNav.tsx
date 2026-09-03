"use client";

import { useMela } from "@/lib/mela/MelaLocaleProvider";
import type { MelaLocale } from "@/lib/mela/content";

export function MelaNav() {
  const { locale, setLocale, c } = useMela();
  const langs: MelaLocale[] = ["es", "en"];

  return (
    <header className="nav">
      <div className="wrap nav-in">
        <a className="brand" href="#top">
          Content&nbsp;by&nbsp;Mela
        </a>
        <nav className="nav-links">
          <a href="#trabajo">{c.nav.work}</a>
          <a href="#paquetes">{c.nav.pkg}</a>
          <a href="#proceso">{c.nav.proc}</a>
          <a href="#sobre">{c.nav.about}</a>
          <a href="#faq">{c.nav.faq}</a>
        </nav>
        <div className="lang" role="group" aria-label="Idioma / Language">
          {langs.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLocale(l)}
              aria-pressed={locale === l}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <a className="btn sm" href="#cotizar">
          {c.nav.cta}
        </a>
      </div>
    </header>
  );
}
