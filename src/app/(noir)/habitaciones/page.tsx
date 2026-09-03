"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { RoomCard } from "@/components/RoomCard";
import { Reveal } from "@/components/Reveal";
import type { RoomType } from "@/lib/types";

type Filter = "all" | "habitacion" | "suite" | "villa";

export default function RoomsPage() {
  const { t } = useLocale();
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rooms")
      .then((r) => r.json())
      .then((data) => {
        setRooms(data);
        setLoading(false);
      });
  }, []);

  const filtered = filter === "all" ? rooms : rooms.filter((r) => r.category === filter);

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: t.rooms.filterAll },
    { key: "habitacion", label: t.rooms.filterRoom },
    { key: "suite", label: t.rooms.filterSuite },
    { key: "villa", label: t.rooms.filterVilla },
  ];

  return (
    <div className="pt-32 pb-24 bg-bone min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <h1 className="font-serif-display text-4xl md:text-5xl">{t.rooms.pageTitle}</h1>
          <p className="mt-4 text-carbon/60">{t.rooms.pageSubtitle}</p>
        </Reveal>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-xs uppercase tracking-widest px-5 py-2.5 border transition-colors cursor-pointer ${
                filter === f.key
                  ? "bg-carbon text-bone border-carbon"
                  : "border-carbon/20 text-carbon/60 hover:border-carbon"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-carbon/40 py-20">{t.common.loading}</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((room, i) => (
              <Reveal key={room.id} delay={(i % 3) * 100}>
                <RoomCard room={room} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
