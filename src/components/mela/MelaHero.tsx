"use client";

import { useMela } from "@/lib/mela/MelaLocaleProvider";
import { waLink } from "@/lib/mela/config";
import { heroShot } from "@/lib/mela/gallery";
import { Shot } from "./Shot";

export function MelaHero() {
  const { locale, c } = useMela();

  return (
    <section className="hero" id="top">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">{c.hero.eyebrow}</p>
          <h1 className="disp">
            {c.hero.titleA}
            <em>{c.hero.titleEm}</em>
            {c.hero.titleB}
          </h1>
          <p className="lede">{c.hero.lede}</p>
          <div className="hero-cta">
            <a className="btn" href={waLink(c.message.hi)} target="_blank" rel="noopener noreferrer">
              {c.hero.cta1}
            </a>
            <a className="btn ghost" href="#paquetes">
              {c.hero.cta2}
            </a>
          </div>
          <div className="spec">
            {c.hero.specs.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>
        <figure className="frame" style={{ margin: 0 }}>
          <Shot shot={heroShot} locale={locale} sizes="(max-width: 820px) 340px, 338px" priority />
          <figcaption className="frame-tag">
            <span className="rec">{c.hero.live}</span>
            <span>{c.hero.timecode}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
