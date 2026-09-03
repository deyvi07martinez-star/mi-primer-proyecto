"use client";

import { useMemo, useState } from "react";
import { useMela } from "@/lib/mela/MelaLocaleProvider";
import {
  addOns,
  melaConfig,
  money,
  packagePrices,
  waLink,
  type AddOnId,
  type PackageKey,
} from "@/lib/mela/config";

const PACKAGE_KEYS = Object.keys(packagePrices) as PackageKey[];

export function MelaQuote() {
  const { locale, c } = useMela();

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [place, setPlace] = useState("");
  const [pkg, setPkg] = useState<PackageKey>("signature");
  const [picked, setPicked] = useState<AddOnId[]>([]);
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  const chosen = useMemo(
    () => addOns.filter((a) => picked.includes(a.id)),
    [picked],
  );
  const total = packagePrices[pkg] + chosen.reduce((sum, a) => sum + a.price, 0);

  // El nombre del paquete tal y como lo lee ella en el chat, sin el precio.
  const packageLabel = c.quote.options[pkg].split("—")[0].trim();

  const summary = useMemo(() => {
    const m = c.message;
    const lines = [
      m.hi,
      "",
      `${m.name}: ${name || m.tbd}`,
      `${m.date}: ${date || m.tbd}`,
      `${m.place}: ${place || m.tbd}`,
      `${m.pkg}: ${packageLabel} (${money(packagePrices[pkg])})`,
      `${m.extras}: ${
        chosen.length
          ? chosen.map((a) => `${c.quote.addOns[a.id]} (+${a.price})`).join(", ")
          : m.none
      }`,
      `${m.est}: ${money(total)}`,
    ];
    if (msg) lines.push("", `${m.notes}: ${msg}`);
    return lines.join("\n");
  }, [c, name, date, place, packageLabel, pkg, chosen, total, msg]);

  const toggle = (id: AddOnId) =>
    setPicked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  /**
   * Guarda la solicitud antes de saltar a WhatsApp. `keepalive` deja que la
   * petición termine aunque el navegador ya haya abierto la otra pestaña, así
   * que no hace falta bloquear el clic del enlace.
   */
  const saveLead = () => {
    setStatus("idle");
    fetch("/api/mela/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        name, date, place, locale, message: msg,
        packageKey: pkg,
        addOns: picked,
        estimate: total,
      }),
    })
      .then((r) => setStatus(r.ok ? "saved" : "error"))
      .catch(() => setStatus("error"));
  };

  const mailto = `mailto:${melaConfig.email}?subject=${encodeURIComponent(
    c.quote.subject,
  )}&body=${encodeURIComponent(summary)}`;

  return (
    <section id="cotizar">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">{c.quote.eyebrow}</p>
          <h2 className="disp">{c.quote.title}</h2>
          <p className="lede">{c.quote.lede}</p>
        </div>

        <div className="quote">
          <form onSubmit={(e) => e.preventDefault()} noValidate>
            <div className="two">
              <div className="field">
                <label htmlFor="f-name">{c.quote.name}</label>
                <input
                  id="f-name" type="text" autoComplete="name" placeholder={c.quote.namePh}
                  value={name} onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="f-date">{c.quote.date}</label>
                <input id="f-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>

            <div className="field">
              <label htmlFor="f-place">{c.quote.place}</label>
              <input
                id="f-place" type="text" placeholder={c.quote.placePh}
                value={place} onChange={(e) => setPlace(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="f-pkg">{c.quote.pkg}</label>
              <select id="f-pkg" value={pkg} onChange={(e) => setPkg(e.target.value as PackageKey)}>
                {PACKAGE_KEYS.map((k) => (
                  <option key={k} value={k}>
                    {c.quote.options[k]}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>{c.quote.extras}</label>
              <div className="checks">
                {addOns.map((a) => (
                  <label key={a.id}>
                    <input type="checkbox" checked={picked.includes(a.id)} onChange={() => toggle(a.id)} />
                    <span>{c.quote.addOns[a.id]}</span>
                    <span className="amt">+{a.price}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="field">
              <label htmlFor="f-msg">{c.quote.msg}</label>
              <textarea
                id="f-msg" placeholder={c.quote.msgPh}
                value={msg} onChange={(e) => setMsg(e.target.value)}
              />
            </div>
          </form>

          <aside className="total" aria-live="polite">
            <div>
              <p className="eyebrow">{c.quote.totalLabel}</p>
              <p className="big">{money(total)}</p>
            </div>
            <ul>
              <li>
                <span>{packageLabel}</span>
                <span>{money(packagePrices[pkg])}</span>
              </li>
              {chosen.map((a) => (
                <li key={a.id}>
                  <span>{c.quote.addOns[a.id]}</span>
                  <span>+{a.price}</span>
                </li>
              ))}
            </ul>
            <hr className="rule" />
            <div className="acts">
              <a
                className="btn" href={waLink(summary)} target="_blank" rel="noopener noreferrer"
                onClick={saveLead}
              >
                {c.quote.sendWa}
              </a>
              <a className="btn ghost" href={mailto} onClick={saveLead}>
                {c.quote.sendMail}
              </a>
              <a
                className="btn ghost" href={melaConfig.calendly}
                target="_blank" rel="noopener noreferrer"
              >
                {c.quote.book}
              </a>
            </div>
            <p className="copied">
              {status === "saved" ? c.quote.saved : status === "error" ? c.quote.saveError : ""}
            </p>
            <p className="mono" style={{ fontSize: 11.5, color: "var(--muted)" }}>
              {c.quote.disclaimer}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
