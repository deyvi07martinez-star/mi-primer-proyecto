"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { LayoutDashboard, LogOut } from "lucide-react";
import type { RoomType } from "@/lib/types";

type Tab = "rooms" | "bookings" | "members" | "restaurant";

type BookingRow = {
  id: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  roomType: { name: string };
};

type MemberRow = {
  id: string;
  name: string;
  email: string;
  tier: string;
  points: number;
};

type RestaurantRow = {
  id: string;
  guestName: string;
  date: string;
  time: string;
  partySize: number;
  status: string;
};

export default function AdminPage() {
  const { t } = useLocale();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [tab, setTab] = useState<Tab>("rooms");
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [restaurant, setRestaurant] = useState<RestaurantRow[]>([]);
  const [priceDrafts, setPriceDrafts] = useState<Record<string, number>>({});
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe: reading sessionStorage after mount
    setAuthed(window.sessionStorage.getItem("noirsel-admin") === "true");
    setChecking(false);
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetch("/api/admin/rooms").then((r) => r.json()).then((data: RoomType[]) => {
      setRooms(data);
      setPriceDrafts(Object.fromEntries(data.map((r) => [r.id, r.basePrice])));
    });
    fetch("/api/bookings").then((r) => r.json()).then(setBookings);
    fetch("/api/admin/members").then((r) => r.json()).then(setMembers);
    fetch("/api/restaurant-reservations").then((r) => r.json()).then(setRestaurant);
  }, [authed]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      window.sessionStorage.setItem("noirsel-admin", "true");
      setAuthed(true);
    } else {
      setError(true);
    }
  };

  const savePrice = async (id: string) => {
    const basePrice = priceDrafts[id];
    await fetch("/api/admin/rooms", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, basePrice }),
    });
    setSavedId(id);
    setTimeout(() => setSavedId(null), 1500);
  };

  if (checking) return null;

  if (!authed) {
    return (
      <div className="min-h-screen bg-carbon flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 justify-center mb-8 text-bone">
            <LayoutDashboard className="text-copper-light" size={22} />
            <span className="font-serif-display text-xl tracking-widest">NOIR &amp; SEL</span>
          </div>
          <div className="bg-carbon-soft border border-bone/10 p-8">
            <h1 className="font-serif-display text-2xl text-bone">{t.admin.loginTitle}</h1>
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <input
                required
                placeholder={t.admin.formUser}
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full bg-transparent border border-bone/25 px-4 py-3 text-sm outline-none focus:border-copper text-bone"
              />
              <input
                required
                type="password"
                placeholder={t.admin.formPassword}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-transparent border border-bone/25 px-4 py-3 text-sm outline-none focus:border-copper text-bone"
              />
              {error && <p className="text-red-400 text-xs">{t.admin.loginError}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-copper text-bone text-xs uppercase tracking-widest py-4 hover:bg-copper-light transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? t.common.loading : t.admin.formSubmit}
              </button>
            </form>
            <p className="text-bone/30 text-[11px] mt-4 text-center">{t.admin.demoHint}</p>
          </div>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "rooms", label: t.admin.tabs.rooms },
    { key: "bookings", label: t.admin.tabs.bookings },
    { key: "members", label: t.admin.tabs.members },
    { key: "restaurant", label: t.admin.tabs.restaurant },
  ];

  return (
    <div className="min-h-screen bg-bone-dim pt-28 pb-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-serif-display text-3xl">{t.admin.title}</h1>
            <p className="text-carbon/50 text-sm">{t.admin.subtitle}</p>
          </div>
          <button
            onClick={() => {
              window.sessionStorage.removeItem("noirsel-admin");
              setAuthed(false);
            }}
            className="flex items-center gap-2 text-xs uppercase tracking-widest border border-carbon/20 px-4 py-2.5 hover:border-carbon cursor-pointer"
          >
            <LogOut size={14} /> {t.admin.logout}
          </button>
        </div>

        <div className="flex gap-2 mb-8 border-b border-carbon/10">
          {tabs.map((tb) => (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className={`px-5 py-3 text-xs uppercase tracking-widest border-b-2 -mb-px cursor-pointer ${
                tab === tb.key ? "border-copper text-carbon" : "border-transparent text-carbon/40"
              }`}
            >
              {tb.label}
            </button>
          ))}
        </div>

        {tab === "rooms" && (
          <div className="bg-white border border-carbon/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-widest text-carbon/40 border-b border-carbon/10">
                  <th className="p-4">Nombre</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4">{t.admin.priceLabel}</th>
                  <th className="p-4" />
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => (
                  <tr key={r.id} className="border-b border-carbon/5 last:border-0">
                    <td className="p-4 font-medium">{r.name}</td>
                    <td className="p-4 text-carbon/60 capitalize">{r.category}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <span>$</span>
                        <input
                          type="number"
                          value={priceDrafts[r.id] ?? r.basePrice}
                          onChange={(e) =>
                            setPriceDrafts({ ...priceDrafts, [r.id]: Number(e.target.value) })
                          }
                          className="w-24 border border-carbon/20 px-2 py-1.5 outline-none focus:border-copper"
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => savePrice(r.id)}
                        className="text-[11px] uppercase tracking-widest bg-carbon text-bone px-4 py-2 hover:bg-copper transition-colors cursor-pointer"
                      >
                        {savedId === r.id ? t.admin.savedNotice : t.admin.saveButton}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "bookings" && (
          <div className="bg-white border border-carbon/10 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-widest text-carbon/40 border-b border-carbon/10">
                  <th className="p-4">{t.admin.guestLabel}</th>
                  <th className="p-4">Habitación</th>
                  <th className="p-4">{t.admin.dateLabel}</th>
                  <th className="p-4">{t.admin.totalLabel}</th>
                  <th className="p-4">{t.admin.statusLabel}</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-carbon/5 last:border-0">
                    <td className="p-4">
                      <div className="font-medium">{b.guestName}</div>
                      <div className="text-carbon/40 text-xs">{b.guestEmail}</div>
                    </td>
                    <td className="p-4">{b.roomType.name}</td>
                    <td className="p-4 text-carbon/60 whitespace-nowrap">
                      {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-copper font-medium">${b.totalPrice.toLocaleString()}</td>
                    <td className="p-4">
                      <span className="text-[11px] uppercase tracking-widest bg-copper/10 text-copper px-2.5 py-1">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-carbon/40">—</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === "members" && (
          <div className="bg-white border border-carbon/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-widest text-carbon/40 border-b border-carbon/10">
                  <th className="p-4">Nombre</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">{t.admin.tierLabel}</th>
                  <th className="p-4">{t.admin.pointsLabel}</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id} className="border-b border-carbon/5 last:border-0">
                    <td className="p-4 font-medium">{m.name}</td>
                    <td className="p-4 text-carbon/60">{m.email}</td>
                    <td className="p-4 capitalize">{m.tier}</td>
                    <td className="p-4 text-copper font-medium">{m.points.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "restaurant" && (
          <div className="bg-white border border-carbon/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-widest text-carbon/40 border-b border-carbon/10">
                  <th className="p-4">{t.admin.guestLabel}</th>
                  <th className="p-4">{t.admin.dateLabel}</th>
                  <th className="p-4">Personas</th>
                  <th className="p-4">{t.admin.statusLabel}</th>
                </tr>
              </thead>
              <tbody>
                {restaurant.map((r) => (
                  <tr key={r.id} className="border-b border-carbon/5 last:border-0">
                    <td className="p-4 font-medium">{r.guestName}</td>
                    <td className="p-4 text-carbon/60">
                      {new Date(r.date).toLocaleDateString()} · {r.time}
                    </td>
                    <td className="p-4">{r.partySize}</td>
                    <td className="p-4">
                      <span className="text-[11px] uppercase tracking-widest bg-copper/10 text-copper px-2.5 py-1">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {restaurant.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-carbon/40">—</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
