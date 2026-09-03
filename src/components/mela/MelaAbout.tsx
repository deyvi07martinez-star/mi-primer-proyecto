"use client";

import Image from "next/image";
import { useMela } from "@/lib/mela/MelaLocaleProvider";

export function MelaAbout() {
  const { c } = useMela();
  return (
    <section id="sobre">
      <div className="wrap about">
        <div className="about-img">
          <Image
            src="/mela/mela.jpg"
            alt={c.about.photoAlt}
            width={700}
            height={867}
            sizes="(max-width: 780px) 100vw, 40vw"
          />
        </div>
        <div className="about-copy">
          <p className="eyebrow">{c.about.eyebrow}</p>
          <h2 className="disp" style={{ fontSize: "clamp(32px,4.6vw,54px)" }}>
            {c.about.title}
          </h2>
          {c.about.body.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          <p className="sig">Mela</p>
        </div>
      </div>
    </section>
  );
}
