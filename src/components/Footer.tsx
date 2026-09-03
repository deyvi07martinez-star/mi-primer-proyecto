"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="bg-carbon text-bone/80 mt-auto">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-serif-display text-2xl tracking-[0.2em] text-bone">
            NOIR &amp; SEL
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone/60">{t.footer.tagline}</p>
          <p className="mt-6 text-xs uppercase tracking-widest text-bone/40">{t.footer.address}</p>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest text-copper-light mb-4">
            {t.nav.rooms}
          </div>
          <ul className="space-y-2 text-sm text-bone/70">
            <li><Link href="/habitaciones">{t.nav.rooms}</Link></li>
            <li><Link href="/restaurante">{t.nav.restaurant}</Link></li>
            <li><Link href="/spa">{t.nav.spa}</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest text-copper-light mb-4">
            {t.nav.club}
          </div>
          <ul className="space-y-2 text-sm text-bone/70">
            <li><Link href="/club">{t.nav.club}</Link></li>
            <li><Link href="/reservar">{t.nav.book}</Link></li>
            <li><Link href="/admin">{t.nav.admin}</Link></li>
            <li><Link href="/voz">{t.nav.voice}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-bone/10 py-6">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 flex flex-col md:flex-row justify-between gap-2 text-[11px] uppercase tracking-widest text-bone/40">
          <span>© {new Date().getFullYear()} Noir &amp; Sel — {t.footer.rights}</span>
          <span>{t.footer.demoNotice}</span>
        </div>
      </div>
    </footer>
  );
}
