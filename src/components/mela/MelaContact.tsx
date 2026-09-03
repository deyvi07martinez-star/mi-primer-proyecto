"use client";

import { useMela } from "@/lib/mela/MelaLocaleProvider";
import { melaConfig, waLink } from "@/lib/mela/config";

export function MelaContact() {
  const { c } = useMela();
  return (
    <section id="contacto">
      <div className="wrap contact">
        <div className="sec-head" style={{ margin: 0 }}>
          <p className="eyebrow">{c.contact.eyebrow}</p>
          <h2 className="disp">{c.contact.title}</h2>
          <p className="lede">{c.contact.lede}</p>
        </div>
        <div className="ways">
          <a href={waLink(c.message.hi)} target="_blank" rel="noopener noreferrer">
            <span className="k">WhatsApp</span>
            <span className="v">{melaConfig.whatsappDisplay}</span>
          </a>
          <a href={`mailto:${melaConfig.email}`}>
            <span className="k">{c.contact.mail}</span>
            <span className="v">{melaConfig.email}</span>
          </a>
          <a href={melaConfig.instagram} target="_blank" rel="noopener noreferrer">
            <span className="k">Instagram</span>
            <span className="v">{melaConfig.instagramHandle}</span>
          </a>
          <a href={melaConfig.calendly} target="_blank" rel="noopener noreferrer">
            <span className="k">{c.contact.call}</span>
            <span className="v">{c.contact.callValue}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
