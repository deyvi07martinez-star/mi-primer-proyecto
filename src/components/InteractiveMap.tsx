"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleProvider";

type SpotKey = "pool" | "spa" | "restaurant" | "gardens" | "beach" | "villas";

const spots: { key: SpotKey; top: string; left: string }[] = [
  { key: "pool", top: "38%", left: "50%" },
  { key: "spa", top: "62%", left: "22%" },
  { key: "restaurant", top: "28%", left: "74%" },
  { key: "gardens", top: "78%", left: "62%" },
  { key: "beach", top: "18%", left: "50%" },
  { key: "villas", top: "58%", left: "82%" },
];

export function InteractiveMap() {
  const { t } = useLocale();
  const [active, setActive] = useState<SpotKey | null>(null);

  return (
    <div className="relative w-full aspect-[16/10] overflow-hidden bg-carbon">
      <Image
        src="https://images.unsplash.com/photo-1533760881669-80d0c8cc23c0?auto=format&fit=crop&w=2000&q=80"
        alt="Vista aérea del resort Noir & Sel"
        fill
        className="object-cover opacity-80"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-carbon/20" />

      {spots.map((spot) => (
        <button
          key={spot.key}
          onClick={() => setActive(active === spot.key ? null : spot.key)}
          style={{ top: spot.top, left: spot.left }}
          className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
          aria-label={t.map.spots[spot.key].name}
        >
          <span className="absolute inset-0 rounded-full bg-copper/40 animate-ping" />
          <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-copper text-bone shadow-lg group-hover:scale-110 transition-transform">
            <Plus size={16} />
          </span>
        </button>
      ))}

      {active && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-80 bg-bone/95 backdrop-blur p-5 shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <h4 className="font-serif-display text-lg text-carbon">{t.map.spots[active].name}</h4>
            <button onClick={() => setActive(null)} className="text-carbon/50 hover:text-carbon cursor-pointer">
              <X size={18} />
            </button>
          </div>
          <p className="text-sm text-carbon/70 mt-2 leading-relaxed">{t.map.spots[active].desc}</p>
        </div>
      )}
    </div>
  );
}
