"use client";

import { useMela } from "@/lib/mela/MelaLocaleProvider";

export function MelaFaq() {
  const { c } = useMela();
  return (
    <section id="faq">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">{c.faq.eyebrow}</p>
          <h2 className="disp">{c.faq.title}</h2>
        </div>
        <div className="faq">
          {c.faq.items.map((item, i) => (
            <details key={item.q} open={i === 0}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
