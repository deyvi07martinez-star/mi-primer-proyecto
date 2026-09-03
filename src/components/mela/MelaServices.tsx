"use client";

import { useMela } from "@/lib/mela/MelaLocaleProvider";

export function MelaServices() {
  const { c } = useMela();
  return (
    <section id="servicios">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">{c.services.eyebrow}</p>
          <h2 className="disp">{c.services.title}</h2>
        </div>
        <div className="svc">
          {c.services.items.map((item) => (
            <div key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <p className="from">{item.from}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
