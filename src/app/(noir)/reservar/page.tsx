"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Check, ChevronLeft, ChevronRight, CreditCard, Loader2 } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { Reveal } from "@/components/Reveal";
import type { RoomType, Extra } from "@/lib/types";

function nightsBetween(a: string, b: string) {
  if (!a || !b) return 0;
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function BookingFlow() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const preselect = searchParams.get("room");

  const [step, setStep] = useState(1);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [checkIn, setCheckIn] = useState("2026-10-10");
  const [checkOut, setCheckOut] = useState("2026-10-14");
  const [guests, setGuests] = useState(2);
  const [roomSlug, setRoomSlug] = useState<string | null>(preselect);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [contact, setContact] = useState({ name: "", email: "" });
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });
  const [processing, setProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    fetch("/api/rooms").then((r) => r.json()).then(setRooms);
    fetch("/api/extras").then((r) => r.json()).then(setExtras);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing selected room from the ?room= URL param
    if (preselect) setRoomSlug(preselect);
  }, [preselect]);

  const room = useMemo(() => rooms.find((r) => r.slug === roomSlug) ?? null, [rooms, roomSlug]);
  const nights = nightsBetween(checkIn, checkOut);
  const roomSubtotal = room ? room.basePrice * nights : 0;
  const extrasSubtotal = extras
    .filter((e) => selectedExtras.includes(e.slug))
    .reduce((sum, e) => sum + e.price, 0);
  const discount = isMember ? Math.round((roomSubtotal + extrasSubtotal) * 0.1) : 0;
  const total = roomSubtotal + extrasSubtotal - discount;

  const toggleExtra = (slug: string) => {
    setSelectedExtras((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room) return;
    setProcessing(true);
    await new Promise((res) => setTimeout(res, 1600));
    await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomTypeId: room.id,
        guestName: contact.name,
        guestEmail: contact.email,
        checkIn,
        checkOut,
        guests,
        extras: selectedExtras,
        totalPrice: total,
      }),
    });
    setProcessing(false);
    setConfirmed(true);
  };

  const resetAll = () => {
    setConfirmed(false);
    setStep(1);
    setRoomSlug(null);
    setSelectedExtras([]);
    setContact({ name: "", email: "" });
    setCard({ number: "", expiry: "", cvc: "" });
  };

  const steps = [t.booking.step1, t.booking.step2, t.booking.step3, t.booking.step4];

  if (confirmed) {
    return (
      <div className="mx-auto max-w-lg px-6 py-32 text-center">
        <div className="w-16 h-16 rounded-full bg-copper/10 flex items-center justify-center mx-auto mb-6">
          <Check className="text-copper" size={28} />
        </div>
        <h1 className="font-serif-display text-3xl">{t.booking.successTitle}</h1>
        <p className="text-carbon/60 mt-4">{t.booking.successBody}</p>
        <button
          onClick={resetAll}
          className="mt-8 bg-carbon text-bone text-xs uppercase tracking-widest px-8 py-4 hover:bg-copper transition-colors cursor-pointer"
        >
          {t.booking.newBooking}
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-bone min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="font-serif-display text-4xl md:text-5xl">{t.booking.pageTitle}</h1>
          <p className="mt-4 text-carbon/60">{t.booking.pageSubtitle}</p>
        </Reveal>

        <div className="flex justify-center mb-14">
          <div className="flex items-center">
            {steps.map((label, i) => {
              const n = i + 1;
              const active = step === n;
              const done = step > n;
              return (
                <div key={label} className="flex items-center">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border ${
                        active
                          ? "bg-carbon text-bone border-carbon"
                          : done
                          ? "bg-copper text-bone border-copper"
                          : "border-carbon/20 text-carbon/40"
                      }`}
                    >
                      {done ? <Check size={16} /> : n}
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-carbon/40 hidden sm:block max-w-[90px] text-center">
                      {label}
                    </span>
                  </div>
                  {n < steps.length && <div className={`w-10 sm:w-16 h-px mx-2 ${done ? "bg-copper" : "bg-carbon/15"}`} />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-12">
          <div>
            {step === 1 && (
              <Reveal>
                <div className="bg-white border border-carbon/10 p-8">
                  <h2 className="font-serif-display text-2xl mb-6">{t.booking.step1}</h2>
                  <div className="grid sm:grid-cols-3 gap-5">
                    <label className="block">
                      <span className="text-xs uppercase tracking-widest text-carbon/50">{t.booking.checkIn}</span>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="mt-2 w-full border border-carbon/20 px-4 py-3 text-sm outline-none focus:border-copper"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs uppercase tracking-widest text-carbon/50">{t.booking.checkOut}</span>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="mt-2 w-full border border-carbon/20 px-4 py-3 text-sm outline-none focus:border-copper"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs uppercase tracking-widest text-carbon/50">{t.booking.guests}</span>
                      <input
                        type="number"
                        min={1}
                        max={8}
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="mt-2 w-full border border-carbon/20 px-4 py-3 text-sm outline-none focus:border-copper"
                      />
                    </label>
                  </div>
                </div>
              </Reveal>
            )}

            {step === 2 && (
              <Reveal>
                <div className="grid sm:grid-cols-2 gap-5">
                  {rooms.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRoomSlug(r.slug)}
                      className={`text-left bg-white border transition-colors cursor-pointer ${
                        roomSlug === r.slug ? "border-copper ring-1 ring-copper" : "border-carbon/10 hover:border-carbon/30"
                      }`}
                    >
                      <div className="relative aspect-[16/10]">
                        <Image src={r.images[0]} alt={r.name} fill className="object-cover" sizes="400px" />
                        {roomSlug === r.slug && (
                          <span className="absolute top-3 right-3 bg-copper text-bone rounded-full p-1.5">
                            <Check size={14} />
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-serif-display text-lg">{r.name}</h3>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-carbon/50">
                            {r.maxGuests} {t.rooms.guestsLabel.toLowerCase()} · {r.sizeM2}m²
                          </span>
                          <span className="text-copper font-serif-display">${r.basePrice}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </Reveal>
            )}

            {step === 3 && (
              <Reveal>
                <div className="bg-white border border-carbon/10 p-8">
                  <h2 className="font-serif-display text-2xl mb-6">{t.booking.step3}</h2>
                  <div className="space-y-3">
                    {extras.map((extra) => (
                      <label
                        key={extra.id}
                        className={`flex items-center justify-between gap-4 border px-5 py-4 cursor-pointer transition-colors ${
                          selectedExtras.includes(extra.slug) ? "border-copper bg-copper/5" : "border-carbon/10"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={selectedExtras.includes(extra.slug)}
                            onChange={() => toggleExtra(extra.slug)}
                            className="accent-copper w-4 h-4"
                          />
                          <div>
                            <div className="text-sm font-medium">{extra.name}</div>
                            <div className="text-xs text-carbon/50">{extra.description}</div>
                          </div>
                        </div>
                        <span className="text-copper font-serif-display shrink-0">${extra.price}</span>
                      </label>
                    ))}
                  </div>

                  <label className="flex items-center gap-3 mt-8 pt-6 border-t border-carbon/10 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isMember}
                      onChange={(e) => setIsMember(e.target.checked)}
                      className="accent-copper w-4 h-4"
                    />
                    <span className="text-sm">{t.booking.memberDiscount} (-10%)</span>
                  </label>
                </div>
              </Reveal>
            )}

            {step === 4 && (
              <Reveal>
                <form onSubmit={handlePayment} className="bg-white border border-carbon/10 p-8">
                  <h2 className="font-serif-display text-2xl mb-6">{t.booking.step4}</h2>
                  <div className="grid sm:grid-cols-2 gap-5 mb-8">
                    <input
                      required
                      placeholder={t.booking.formName}
                      value={contact.name}
                      onChange={(e) => setContact({ ...contact, name: e.target.value })}
                      className="border border-carbon/20 px-4 py-3 text-sm outline-none focus:border-copper"
                    />
                    <input
                      required
                      type="email"
                      placeholder={t.booking.formEmail}
                      value={contact.email}
                      onChange={(e) => setContact({ ...contact, email: e.target.value })}
                      className="border border-carbon/20 px-4 py-3 text-sm outline-none focus:border-copper"
                    />
                  </div>

                  <div className="bg-carbon/5 border border-carbon/10 p-5 mb-6 flex items-start gap-3">
                    <CreditCard size={18} className="text-copper shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">{t.booking.payTitle}</div>
                      <p className="text-xs text-carbon/50 mt-1">{t.booking.payBody}</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-5">
                    <input
                      required
                      placeholder={t.booking.cardNumber}
                      value={card.number}
                      maxLength={19}
                      onChange={(e) => setCard({ ...card, number: e.target.value })}
                      className="sm:col-span-1 border border-carbon/20 px-4 py-3 text-sm outline-none focus:border-copper"
                    />
                    <input
                      required
                      placeholder={t.booking.cardExpiry}
                      value={card.expiry}
                      maxLength={5}
                      onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                      className="border border-carbon/20 px-4 py-3 text-sm outline-none focus:border-copper"
                    />
                    <input
                      required
                      placeholder={t.booking.cardCvc}
                      value={card.cvc}
                      maxLength={4}
                      onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                      className="border border-carbon/20 px-4 py-3 text-sm outline-none focus:border-copper"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={processing || !room}
                    className="mt-8 w-full bg-copper text-bone text-xs uppercase tracking-widest py-4 hover:bg-copper-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {processing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> {t.booking.processing}
                      </>
                    ) : (
                      t.booking.confirmButton
                    )}
                  </button>
                </form>
              </Reveal>
            )}

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
                className="flex items-center gap-1 text-xs uppercase tracking-widest text-carbon/50 disabled:opacity-0 hover:text-carbon cursor-pointer"
              >
                <ChevronLeft size={16} /> Back
              </button>
              {step < 4 && (
                <button
                  onClick={() => setStep((s) => Math.min(4, s + 1))}
                  disabled={step === 2 && !room}
                  className="flex items-center gap-1 bg-carbon text-bone text-xs uppercase tracking-widest px-6 py-3.5 hover:bg-copper transition-colors disabled:opacity-40 cursor-pointer"
                >
                  Next <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-28 h-fit bg-carbon text-bone p-7">
            <h3 className="font-serif-display text-xl mb-5">
              {room ? room.name : t.booking.selectRoomFirst}
            </h3>
            {room && (
              <div className="relative aspect-[16/10] mb-5">
                <Image src={room.images[0]} alt={room.name} fill className="object-cover" sizes="360px" />
              </div>
            )}
            <div className="space-y-2 text-sm text-bone/70">
              <div className="flex justify-between">
                <span>{checkIn} → {checkOut}</span>
                <span>{nights} {t.booking.nights}</span>
              </div>
              {room && (
                <div className="flex justify-between">
                  <span>{t.booking.subtotalRoom}</span>
                  <span>${roomSubtotal}</span>
                </div>
              )}
              {extrasSubtotal > 0 && (
                <div className="flex justify-between">
                  <span>{t.booking.subtotalExtras}</span>
                  <span>${extrasSubtotal}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-copper-light">
                  <span>{t.booking.memberDiscount}</span>
                  <span>-${discount}</span>
                </div>
              )}
            </div>
            <div className="border-t border-bone/15 mt-5 pt-5 flex justify-between items-baseline">
              <span className="text-xs uppercase tracking-widest text-bone/50">{t.booking.total}</span>
              <span className="font-serif-display text-3xl text-copper-light">${total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={null}>
      <BookingFlow />
    </Suspense>
  );
}
