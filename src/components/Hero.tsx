"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function Hero() {
  const { t } = useLocale();

  return (
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center animate-kenburns"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2400&q=80)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-carbon/70 via-carbon/30 to-carbon/80" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <p className="text-copper-light text-xs md:text-sm tracking-[0.4em] uppercase animate-fade-up">
          {t.hero.eyebrow}
        </p>
        <h1
          className="font-serif-display text-bone text-4xl sm:text-6xl md:text-7xl mt-6 max-w-4xl text-balance leading-[1.05] animate-fade-up"
          style={{ animationDelay: "150ms", animationFillMode: "backwards" }}
        >
          {t.hero.title}
        </h1>
        <p
          className="text-bone/80 mt-6 max-w-xl text-sm md:text-base leading-relaxed animate-fade-up"
          style={{ animationDelay: "300ms", animationFillMode: "backwards" }}
        >
          {t.hero.subtitle}
        </p>

        <div
          className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-up"
          style={{ animationDelay: "450ms", animationFillMode: "backwards" }}
        >
          <Link
            href="/reservar"
            className="bg-copper text-bone text-xs tracking-[0.25em] uppercase px-8 py-4 hover:bg-copper-light transition-colors"
          >
            {t.hero.cta}
          </Link>
          <a
            href="#intro"
            className="border border-bone/40 text-bone text-xs tracking-[0.25em] uppercase px-8 py-4 hover:bg-bone/10 transition-colors"
          >
            {t.hero.ctaSecondary}
          </a>
        </div>
      </div>

      <a
        href="#intro"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-bone/70 flex flex-col items-center gap-2 text-[10px] uppercase tracking-widest animate-fade-up"
        style={{ animationDelay: "700ms", animationFillMode: "backwards" }}
      >
        {t.hero.scroll}
        <ChevronDown className="animate-bounce" size={18} />
      </a>
    </section>
  );
}
