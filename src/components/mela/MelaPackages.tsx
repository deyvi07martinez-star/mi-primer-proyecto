"use client";

import { useMela } from "@/lib/mela/MelaLocaleProvider";
import { money, packagePrices } from "@/lib/mela/config";

const COLUMN_PRICES = [packagePrices.esencial, packagePrices.signature, packagePrices.destino];

export function MelaPackages() {
  const { c } = useMela();
  return (
    <section id="paquetes">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">{c.packages.eyebrow}</p>
          <h2 className="disp">{c.packages.title}</h2>
          <p className="lede">{c.packages.lede}</p>
        </div>
        <div className="tbl-scroll">
          <table className="pk">
            <thead>
              <tr>
                <th style={{ width: 190 }}>
                  <span className="k">{c.packages.includes}</span>
                </th>
                {c.packages.names.map((name, i) => (
                  <th key={name}>
                    <span className="k">{`0${i + 1}`}</span>
                    <span className="n">{name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.packages.rows.map((row) => (
                <tr key={row.label}>
                  <th>{row.label}</th>
                  {row.values.map((v, i) => (
                    <td key={`${row.label}-${i}`}>{v}</td>
                  ))}
                </tr>
              ))}
              <tr className="price">
                <th>{c.packages.priceLabel}</th>
                {COLUMN_PRICES.map((p) => (
                  <td key={p}>
                    <small>{c.packages.from}</small>
                    {money(p)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="note">{c.packages.note}</p>
      </div>
    </section>
  );
}
