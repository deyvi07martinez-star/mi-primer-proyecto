"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { Reveal } from "@/components/Reveal";
import type { Extra } from "@/lib/types";

const categoryImages: Record<string, string> = {
  spa: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
  dining: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
  experience: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80",
};

export default function SpaPage() {
  const { t } = useLocale();
  const [extras, setExtras] = useState<Extra[]>([]);

  useEffect(() => {
    fetch("/api/extras")
      .then((r) => r.json())
      .then(setExtras);
  }, []);

  return (
    <div className="bg-bone min-h-screen">
      <section className="relative h-[70vh] min-h-[420px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=2000&q=80"
          alt="Spa Noir"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-carbon/60 via-carbon/20 to-bone" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <h1 className="font-serif-display text-bone text-4xl md:text-6xl">{t.spa.pageTitle}</h1>
          <p className="text-bone/80 mt-4 max-w-lg">{t.spa.pageSubtitle}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-24">
        <Reveal className="text-center mb-14">
          <h2 className="font-serif-display text-3xl">{t.spa.categoriesTitle}</h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {extras.map((extra, i) => (
            <Reveal key={extra.id} delay={(i % 3) * 100}>
              <div className="bg-white border border-carbon/10 flex flex-col h-full">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={categoryImages[extra.category]}
                    alt={extra.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-serif-display text-lg">{extra.name}</h3>
                  <p className="text-sm text-carbon/60 mt-2 flex-1">{extra.description}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-copper font-serif-display text-xl">${extra.price}</span>
                    <a
                      href="/reservar"
                      className="text-[11px] uppercase tracking-widest border border-carbon/20 px-4 py-2.5 hover:border-copper hover:text-copper transition-colors"
                    >
                      {t.spa.addToStay}
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
