"use client";

import { useState } from "react";
import { EchoPanel } from "@/components/voz/EchoPanel";
import { SpeakPanel } from "@/components/voz/SpeakPanel";
import { WordBankPanel } from "@/components/voz/WordBankPanel";

const TABS = [
  { id: "repetir", label: "Di algo y lo repito" },
  { id: "escribir", label: "Escribe y lo digo" },
  { id: "palabras", label: "Habla con mis palabras" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function VozPage() {
  const [tab, setTab] = useState<TabId>("repetir");

  return (
    <div className="min-h-screen bg-carbon pb-24 pt-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <header>
          <p className="text-[11px] uppercase tracking-[0.3em] text-copper-light">Estudio de voz</p>
          <h1 className="mt-4 font-serif-display text-4xl text-bone md:text-5xl">
            Modulador de voz
          </h1>
          <p className="mt-5 max-w-2xl leading-relaxed text-bone/60">
            Tres cosas: grabas y te devuelvo la frase con otra voz, escribes y lo digo en voz alta,
            o grabas tus palabras una a una y luego escribo frases que suenan con tu propia voz.
            Todo ocurre dentro de tu navegador: ni el audio ni el texto salen de tu equipo.
          </p>
        </header>

        <nav className="mt-10 flex flex-wrap gap-2" aria-label="Modos">
          {TABS.map((item) => {
            const active = item.id === tab;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                aria-current={active ? "page" : undefined}
                className={`border px-4 py-2.5 text-[12px] uppercase tracking-widest transition-colors ${
                  active
                    ? "border-copper bg-copper text-bone"
                    : "border-bone/20 text-bone/60 hover:border-copper/60 hover:text-bone"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-8">
          {tab === "repetir" && <EchoPanel />}
          {tab === "escribir" && <SpeakPanel />}
          {tab === "palabras" && <WordBankPanel />}
        </div>

        <p className="mt-10 text-sm leading-relaxed text-bone/40">
          Nota honesta sobre los limites: el navegador no sabe clonar tu voz para leer un texto
          cualquiera. Por eso la pestana de escribir usa una voz sintetica, y la de tus palabras
          encadena grabaciones tuyas reales. El microfono necesita HTTPS (o localhost) y tu permiso.
        </p>
      </div>
    </div>
  );
}
