"use client";

import { useMela } from "@/lib/mela/MelaLocaleProvider";
import { cases } from "@/lib/mela/gallery";
import { Shot } from "./Shot";

export function MelaWork() {
  const { locale, c } = useMela();
  return (
    <section id="trabajo">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">{c.work.eyebrow}</p>
          <h2 className="disp">{c.work.title}</h2>
          <p className="lede">{c.work.lede}</p>
        </div>

        {cases.map((wedding, i) => {
          const copy = c.work.cases[wedding.id];
          return (
            <div className="case" key={wedding.id} style={i === 0 ? { paddingTop: 0 } : undefined}>
              <div className="case-head">
                <h3>{copy.title}</h3>
                <span className="where">{copy.where}</span>
              </div>
              <div className="case-specs">
                {copy.specs.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
              <div className="strip">
                {wedding.shots.map((s) => (
                  <figure key={s.file}>
                    <Shot shot={s} locale={locale} sizes="(max-width: 700px) 150px, 210px" />
                  </figure>
                ))}
              </div>
            </div>
          );
        })}

        <p className="hint" style={{ marginTop: 18 }}>
          {c.work.hint}
        </p>
      </div>
    </section>
  );
}
