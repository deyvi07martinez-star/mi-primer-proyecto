"use client";

import { useMela } from "@/lib/mela/MelaLocaleProvider";
import { allShots } from "@/lib/mela/gallery";
import { Shot } from "./Shot";

/** Tira continua de tomas: la segunda vuelta es el clon que cierra el bucle. */
export function MelaReel() {
  const { locale } = useMela();
  return (
    <section className="reel" aria-label={locale === "en" ? "Content samples" : "Muestra de contenido"}>
      <div className="reel-track">
        {allShots.map((s) => (
          <figure key={s.file}>
            <Shot shot={s} locale={locale} sizes="132px" />
          </figure>
        ))}
        {allShots.map((s) => (
          <figure key={`clone-${s.file}`}>
            <Shot shot={s} locale={locale} sizes="132px" decorative />
          </figure>
        ))}
      </div>
    </section>
  );
}
