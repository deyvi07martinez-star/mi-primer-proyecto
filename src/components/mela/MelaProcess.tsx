"use client";

import { useMela } from "@/lib/mela/MelaLocaleProvider";

export function MelaProcess() {
  const { c } = useMela();
  return (
    <section id="proceso">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">{c.process.eyebrow}</p>
          <h2 className="disp">{c.process.title}</h2>
        </div>
        <div className="steps">
          {c.process.steps.map((step, i) => (
            <div key={step.title}>
              <span className="num">{`0${i + 1}`}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
