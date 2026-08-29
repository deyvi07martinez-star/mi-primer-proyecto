"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X, Sparkles } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleProvider";

type Message = { role: "user" | "assistant"; text: string };

function buildReply(input: string, locale: "es" | "en"): string {
  const q = input.toLowerCase();

  const es = {
    villa:
      "Villa Onyx (2 habitaciones) y Villa Ámbar (3 habitaciones, frente al mar) tienen piscina privada. Villa Ámbar además tiene acceso directo a la playa. ¿Quiere que le muestre disponibilidad?",
    club: "El Club Noir tiene tres niveles: Silver, Gold y Platinum. Los beneficios crecen con cada estadía: descuentos, upgrades y acceso prioritario. Puede iniciar sesión con la cuenta demo en la página del Club.",
    cena: "Con gusto. La 'Cena Privada en la Playa' cuesta $340 e incluye un menú de degustación de 5 tiempos frente al mar. Puede agregarla al configurar su estadía en la página de Reservar.",
    precio:
      "Nuestras habitaciones inician en $420 por noche y las villas desde $2,100 por noche. El precio varía según la temporada y las experiencias que agregue.",
    spa: "Nuestro spa ofrece rituales como el 'Ritual de Sal Marina' ($180) y el 'Masaje en Pareja al Atardecer' ($260). Puede reservarlos desde la página de Spa & Experiencias.",
    restaurante:
      "El restaurante Sel sirve cocina de temporada frente al océano. Puede reservar una mesa directamente desde la página del Restaurante.",
    default:
      "Con gusto le ayudo. Puedo recomendarle una habitación, contarle sobre el Club Noir, o ayudarle a reservar una experiencia en el spa o el restaurante. ¿Qué le gustaría saber?",
  };

  const en = {
    villa:
      "Villa Onyx (2 bedrooms) and Villa Ámbar (3 bedrooms, oceanfront) both have private pools. Villa Ámbar also has direct beach access. Would you like me to check availability?",
    club: "The Noir Club has three tiers: Silver, Gold and Platinum. Benefits grow with every stay — discounts, upgrades and priority access. You can sign in with the demo account on the Club page.",
    cena: "Happy to help. The 'Private Beach Dinner' is $340 and includes a 5-course tasting menu by the water. You can add it while configuring your stay on the Booking page.",
    precio:
      "Our rooms start at $420 per night and villas from $2,100 per night. Pricing varies by season and any experiences you add.",
    spa: "Our spa offers rituals like the 'Sea Salt Ritual' ($180) and the 'Sunset Couples Massage' ($260). You can book them from the Spa & Experiences page.",
    restaurante:
      "Sel restaurant serves seasonal, oceanfront cuisine. You can reserve a table directly from the Restaurant page.",
    default:
      "Happy to help. I can recommend a room, tell you about the Noir Club, or help you book a spa or dining experience. What would you like to know?",
  };

  const dict = locale === "es" ? es : en;

  if (q.includes("villa") || q.includes("piscina") || q.includes("pool")) return dict.villa;
  if (q.includes("club") || q.includes("member") || q.includes("membres")) return dict.club;
  if (q.includes("cena") || q.includes("dinner") || q.includes("playa") || q.includes("beach")) return dict.cena;
  if (q.includes("precio") || q.includes("price") || q.includes("cost") || q.includes("cuesta")) return dict.precio;
  if (q.includes("spa") || q.includes("masaje") || q.includes("massage")) return dict.spa;
  if (q.includes("restaurant") || q.includes("comer") || q.includes("cena") || q.includes("food")) return dict.restaurante;
  return dict.default;
}

export function ConciergeChat() {
  const { t, locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- lazily seeds the greeting only when the panel first opens
      setMessages([{ role: "assistant", text: t.concierge.greeting }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);
    // eslint-disable-next-line react-hooks/purity -- randomized typing delay for a natural-feeling demo response
    const delay = 700 + Math.random() * 500;
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", text: buildReply(trimmed, locale) }]);
      setTyping(false);
    }, delay);
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-carbon text-bone px-5 py-4 shadow-xl hover:bg-carbon-soft transition-colors cursor-pointer"
        aria-label="Concierge"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
        <span className="hidden sm:inline text-xs uppercase tracking-widest">{t.concierge.title}</span>
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[min(92vw,380px)] h-[min(70vh,540px)] bg-bone border border-carbon/15 shadow-2xl flex flex-col">
          <div className="bg-carbon text-bone px-5 py-4 flex items-center gap-2">
            <Sparkles size={16} className="text-copper-light" />
            <div>
              <div className="text-sm font-serif-display tracking-wide">{t.concierge.title}</div>
              <div className="text-[11px] text-bone/50 uppercase tracking-widest">{t.concierge.subtitle}</div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-copper text-bone"
                    : "bg-carbon/5 text-carbon border border-carbon/10"
                }`}
              >
                {m.text}
              </div>
            ))}
            {typing && (
              <div className="bg-carbon/5 border border-carbon/10 w-fit px-3.5 py-2.5 text-sm text-carbon/50">
                <span className="inline-flex gap-1">
                  <span className="animate-pulse">●</span>
                  <span className="animate-pulse [animation-delay:150ms]">●</span>
                  <span className="animate-pulse [animation-delay:300ms]">●</span>
                </span>
              </div>
            )}
          </div>

          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {t.concierge.quickReplies.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-[11px] border border-carbon/20 px-2.5 py-1.5 text-carbon/70 hover:border-copper hover:text-copper transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-carbon/10 p-3 flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.concierge.placeholder}
              className="flex-1 bg-transparent text-sm px-2 py-2 outline-none text-carbon placeholder:text-carbon/40"
            />
            <button
              type="submit"
              className="bg-carbon text-bone p-2.5 hover:bg-copper transition-colors cursor-pointer"
              aria-label={t.concierge.send}
            >
              <Send size={16} />
            </button>
          </form>
          <div className="text-center text-[10px] text-carbon/35 pb-2 uppercase tracking-widest">
            {t.concierge.disclaimer}
          </div>
        </div>
      )}
    </>
  );
}
