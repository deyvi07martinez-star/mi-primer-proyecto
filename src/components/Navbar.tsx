"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Navbar() {
  const { t } = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";
  const solid = scrolled || !isHome || open;

  const links = [
    { href: "/habitaciones", label: t.nav.rooms },
    { href: "/restaurante", label: t.nav.restaurant },
    { href: "/spa", label: t.nav.spa },
    { href: "/club", label: t.nav.club },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        solid ? "bg-bone/95 backdrop-blur border-b border-carbon/10" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 flex items-center justify-between h-20">
        <Link
          href="/"
          className={`font-serif-display text-xl tracking-[0.2em] ${
            solid ? "text-carbon" : "text-bone"
          }`}
        >
          NOIR&nbsp;&amp;&nbsp;SEL
        </Link>

        <nav className="hidden lg:flex items-center gap-9 text-[13px] tracking-widest uppercase">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:opacity-70 ${solid ? "text-carbon" : "text-bone"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-6">
          <LanguageSwitcher dark={!solid} />
          <Link
            href="/reservar"
            className="bg-copper text-bone text-[13px] tracking-widest uppercase px-5 py-2.5 hover:bg-copper-light transition-colors"
          >
            {t.nav.book}
          </Link>
        </div>

        <button
          className={`lg:hidden ${solid ? "text-carbon" : "text-bone"}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-bone border-t border-carbon/10 px-6 py-6 flex flex-col gap-5 text-sm tracking-widest uppercase text-carbon">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href="/club" onClick={() => setOpen(false)}>
            {t.nav.club}
          </Link>
          <div className="flex items-center justify-between pt-4 border-t border-carbon/10">
            <LanguageSwitcher />
            <Link
              href="/reservar"
              onClick={() => setOpen(false)}
              className="bg-copper text-bone px-5 py-2.5"
            >
              {t.nav.book}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
