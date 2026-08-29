"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, Maximize, Eye } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { RoomType } from "@/lib/types";

export function RoomCard({ room }: { room: RoomType }) {
  const { t } = useLocale();

  return (
    <div className="group bg-bone border border-carbon/10 flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={room.images[0]}
          alt={room.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <span className="absolute top-4 left-4 bg-carbon/80 text-bone text-[10px] uppercase tracking-widest px-3 py-1.5">
          {room.category === "villa" ? t.rooms.filterVilla.slice(0, -1) : room.category === "suite" ? t.rooms.filterSuite.slice(0, -1) : t.rooms.filterRoom.slice(0, -1)}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-serif-display text-xl">{room.name}</h3>
        <p className="text-sm text-carbon/60 mt-2 leading-relaxed">{room.description}</p>

        <div className="flex items-center gap-4 mt-4 text-carbon/50 text-xs">
          <span className="flex items-center gap-1">
            <Users size={14} /> {room.maxGuests}
          </span>
          <span className="flex items-center gap-1">
            <Maximize size={14} /> {room.sizeM2}m²
          </span>
          <span className="flex items-center gap-1">
            <Eye size={14} /> {room.view}
          </span>
        </div>

        <div className="mt-6 flex items-end justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-carbon/40">{t.rooms.fromNight}</div>
            <div className="font-serif-display text-2xl text-copper">${room.basePrice}</div>
          </div>
          <Link
            href={`/reservar?room=${room.slug}`}
            className="bg-carbon text-bone text-[11px] uppercase tracking-widest px-4 py-3 hover:bg-copper transition-colors"
          >
            {t.rooms.bookButton}
          </Link>
        </div>
      </div>
    </div>
  );
}
