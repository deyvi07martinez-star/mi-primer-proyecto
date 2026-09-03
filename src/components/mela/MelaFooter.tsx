"use client";

import { useMela } from "@/lib/mela/MelaLocaleProvider";
import { melaConfig, waLink } from "@/lib/mela/config";

export function MelaFooter() {
  const { c } = useMela();
  return (
    <>
      <footer>
        <div className="wrap foot">
          <span>{c.footer}</span>
          <span>
            <a href={melaConfig.instagram} target="_blank" rel="noopener noreferrer">
              {melaConfig.instagramHandle}
            </a>
          </span>
        </div>
      </footer>
      <div className="dock">
        <a className="pri" href={waLink(c.message.hi)} target="_blank" rel="noopener noreferrer">
          {c.dock.wa}
        </a>
        <a href="#cotizar">{c.dock.quote}</a>
        <a href="#paquetes">{c.dock.pricing}</a>
      </div>
    </>
  );
}
