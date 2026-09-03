"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Crown } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { Reveal } from "@/components/Reveal";

type Member = {
  name: string;
  email: string;
  tier: string;
  points: number;
  memberSince: string;
};

const tierColor: Record<string, string> = {
  silver: "text-carbon/60",
  gold: "text-copper",
  platinum: "text-copper-light",
};

export default function ClubPage() {
  const { t } = useLocale();
  const [member, setMember] = useState<Member | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const res = await fetch("/api/member/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      setMember(await res.json());
    } else {
      setError(true);
    }
  };

  return (
    <div className="bg-bone min-h-screen">
      <section className="relative h-[60vh] min-h-[380px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=2000&q=80"
          alt="Club Noir"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-carbon/70 via-carbon/30 to-bone" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <Crown className="text-copper-light mb-4" size={32} />
          <h1 className="font-serif-display text-bone text-4xl md:text-6xl">{t.club.pageTitle}</h1>
          <p className="text-bone/80 mt-4 max-w-lg">{t.club.pageSubtitle}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-24">
        <Reveal className="text-center mb-14">
          <h2 className="font-serif-display text-3xl">{t.club.tiersTitle}</h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {t.club.tiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 120}>
              <div
                className={`p-8 h-full border ${
                  tier.name === "Platinum" ? "border-copper bg-carbon text-bone" : "border-carbon/10 bg-white"
                }`}
              >
                <h3 className={`font-serif-display text-2xl ${tier.name === "Platinum" ? "text-copper-light" : ""}`}>
                  {tier.name}
                </h3>
                <p className={`text-xs uppercase tracking-widest mt-2 ${tier.name === "Platinum" ? "text-bone/50" : "text-carbon/40"}`}>
                  {tier.req}
                </p>
                <ul className="mt-6 space-y-3">
                  {tier.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm">
                      <Check size={16} className="text-copper shrink-0 mt-0.5" />
                      <span className={tier.name === "Platinum" ? "text-bone/80" : "text-carbon/70"}>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="max-w-md mx-auto">
          <div className="bg-carbon text-bone p-8 md:p-10">
            {member ? (
              <div>
                <p className="text-copper-light text-xs uppercase tracking-widest">{t.club.welcomeBack}</p>
                <h3 className="font-serif-display text-2xl mt-2">{member.name}</h3>
                <p className={`uppercase text-sm tracking-widest mt-1 ${tierColor[member.tier]}`}>{member.tier}</p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-serif-display text-4xl text-copper-light">{member.points.toLocaleString()}</span>
                  <span className="text-bone/50 text-sm">{t.club.pointsLabel}</span>
                </div>

                <p className="text-bone/40 text-xs mt-4">
                  {t.club.memberSince}: {new Date(member.memberSince).toLocaleDateString()}
                </p>

                <button
                  onClick={() => setMember(null)}
                  className="mt-8 w-full border border-bone/25 text-xs uppercase tracking-widest py-3.5 hover:border-copper hover:text-copper-light transition-colors cursor-pointer"
                >
                  {t.club.logout}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="font-serif-display text-2xl">{t.club.loginTitle}</h3>
                <p className="text-bone/50 text-sm mt-2">{t.club.loginSubtitle}</p>

                <form onSubmit={handleLogin} className="mt-6 space-y-4">
                  <input
                    required
                    type="email"
                    placeholder={t.club.formEmail}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-transparent border border-bone/25 px-4 py-3 text-sm outline-none focus:border-copper"
                  />
                  <input
                    required
                    type="password"
                    placeholder={t.club.formPassword}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-transparent border border-bone/25 px-4 py-3 text-sm outline-none focus:border-copper"
                  />
                  {error && <p className="text-red-400 text-xs">{t.club.loginError}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-copper text-bone text-xs uppercase tracking-widest py-4 hover:bg-copper-light transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? t.common.loading : t.club.formSubmit}
                  </button>
                </form>
                <p className="text-bone/30 text-[11px] mt-4 text-center">{t.club.demoHint}</p>
              </div>
            )}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
