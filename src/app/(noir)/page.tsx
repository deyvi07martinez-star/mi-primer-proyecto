"use client";

import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { InteractiveMap } from "@/components/InteractiveMap";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function Home() {
  const { t } = useLocale();

  return (
    <>
      <Hero />

      <section id="intro" className="bg-bone py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid md:grid-cols-2 gap-14 items-center">
          <Reveal>
            <p className="text-copper text-xs tracking-[0.3em] uppercase mb-4">{t.home.introEyebrow}</p>
            <h2 className="font-serif-display text-3xl md:text-5xl leading-tight text-balance">
              {t.home.introTitle}
            </h2>
            <p className="mt-6 text-carbon/70 leading-relaxed">{t.home.introBody}</p>
          </Reveal>
          <Reveal delay={150}>
            <div className="relative aspect-[4/5] w-full">
              <Image
                src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80"
                alt="Noir & Sel"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Reveal>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-10 mt-20 grid sm:grid-cols-3 gap-8">
          {t.home.pillars.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 120}>
              <div className="border-t border-copper pt-6">
                <h3 className="font-serif-display text-xl mb-3">{pillar.title}</h3>
                <p className="text-sm text-carbon/60 leading-relaxed">{pillar.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-carbon-soft py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif-display text-3xl md:text-5xl text-bone">{t.map.title}</h2>
            <p className="mt-4 text-bone/50">{t.map.subtitle}</p>
          </Reveal>
          <Reveal delay={150}>
            <InteractiveMap />
          </Reveal>
        </div>
      </section>

      <section className="bg-bone py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 text-center">
          <Reveal className="max-w-2xl mx-auto">
            <p className="text-copper text-xs tracking-[0.3em] uppercase mb-4">
              {t.home.configuratorEyebrow}
            </p>
            <h2 className="font-serif-display text-3xl md:text-5xl leading-tight text-balance">
              {t.home.configuratorTitle}
            </h2>
            <p className="mt-6 text-carbon/70 leading-relaxed">{t.home.configuratorBody}</p>
            <Link
              href="/reservar"
              className="inline-block mt-8 bg-carbon text-bone text-xs tracking-[0.25em] uppercase px-8 py-4 hover:bg-copper transition-colors"
            >
              {t.hero.cta}
            </Link>
            <p className="mt-6 text-sm text-carbon/50">{t.home.conciergeTeaser}</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
