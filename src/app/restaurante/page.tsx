"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { Reveal } from "@/components/Reveal";

export default function RestaurantPage() {
  const { t } = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    guestName: "",
    guestEmail: "",
    date: "",
    time: "19:30",
    partySize: 2,
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/restaurant-reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="bg-bone min-h-screen">
      <section className="relative h-[70vh] min-h-[420px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=2000&q=80"
          alt="Restaurante Sel"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-carbon/60 via-carbon/20 to-bone" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <p className="text-copper-light text-xs tracking-[0.4em] uppercase">Sel</p>
          <h1 className="font-serif-display text-bone text-4xl md:text-6xl mt-4">{t.restaurant.pageTitle}</h1>
          <p className="text-bone/80 mt-4 max-w-lg">{t.restaurant.pageSubtitle}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-24 grid md:grid-cols-2 gap-16">
        <Reveal>
          <h2 className="font-serif-display text-3xl mb-5">{t.restaurant.philosophyTitle}</h2>
          <p className="text-carbon/70 leading-relaxed">{t.restaurant.philosophyBody}</p>

          <h3 className="font-serif-display text-2xl mt-12 mb-5">{t.restaurant.menuTitle}</h3>
          <ul className="divide-y divide-carbon/10">
            {t.restaurant.menuItems.map((item) => (
              <li key={item.name} className="flex justify-between py-3.5 text-sm">
                <span className="text-carbon/80">{item.name}</span>
                <span className="text-copper font-medium">{item.price}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={150}>
          <div className="bg-carbon text-bone p-8 md:p-10">
            <h3 className="font-serif-display text-2xl">{t.restaurant.reserveTitle}</h3>
            <p className="text-bone/60 text-sm mt-2">{t.restaurant.reserveBody}</p>

            {submitted ? (
              <div className="mt-8 border border-copper/40 p-6 text-copper-light text-sm">
                {t.restaurant.formSuccess}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <input
                  required
                  placeholder={t.restaurant.formName}
                  value={form.guestName}
                  onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                  className="w-full bg-transparent border border-bone/25 px-4 py-3 text-sm outline-none focus:border-copper"
                />
                <input
                  required
                  type="email"
                  placeholder={t.restaurant.formEmail}
                  value={form.guestEmail}
                  onChange={(e) => setForm({ ...form, guestEmail: e.target.value })}
                  className="w-full bg-transparent border border-bone/25 px-4 py-3 text-sm outline-none focus:border-copper"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full bg-transparent border border-bone/25 px-4 py-3 text-sm outline-none focus:border-copper [color-scheme:dark]"
                  />
                  <input
                    required
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full bg-transparent border border-bone/25 px-4 py-3 text-sm outline-none focus:border-copper [color-scheme:dark]"
                  />
                </div>
                <input
                  required
                  type="number"
                  min={1}
                  max={20}
                  placeholder={t.restaurant.formParty}
                  value={form.partySize}
                  onChange={(e) => setForm({ ...form, partySize: Number(e.target.value) })}
                  className="w-full bg-transparent border border-bone/25 px-4 py-3 text-sm outline-none focus:border-copper"
                />
                <textarea
                  placeholder={t.restaurant.formNotes}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  className="w-full bg-transparent border border-bone/25 px-4 py-3 text-sm outline-none focus:border-copper resize-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-copper text-bone text-xs uppercase tracking-widest py-4 hover:bg-copper-light transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? t.common.loading : t.restaurant.formSubmit}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
