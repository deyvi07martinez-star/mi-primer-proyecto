/**
 * Datos de contacto y precios de Content by Mela.
 *
 * Esto es lo único que hay que tocar para poner el sitio en producción:
 * cambia el número, el correo y el enlace del calendario, y ajusta los
 * precios de partida. Todo lo demás (paquetes, cotizador, botones de
 * WhatsApp) se genera a partir de aquí.
 */
export const melaConfig = {
  /** Número con código de país, sin "+" ni espacios — así lo espera wa.me */
  whatsapp: "18090000000",
  whatsappDisplay: "+1 809 000 0000",
  email: "hola@contentbymela.com",
  instagram: "https://www.instagram.com/contentbymela/",
  instagramHandle: "@contentbymela",
  calendly: "https://calendly.com/contentbymela/15min",
} as const;

/** Precios de partida en dólares. */
export const packagePrices = {
  esencial: 450,
  signature: 795,
  destino: 1690,
  evento: 350,
  marca: 550,
} as const;

export type PackageKey = keyof typeof packagePrices;

/** Extras del cotizador, en el orden en que se muestran. */
export const addOns = [
  { id: "segunda", price: 250 },
  { id: "previa", price: 220 },
  { id: "highlight", price: 180 },
  { id: "express", price: 120 },
  { id: "venue", price: 200 },
  { id: "viaje", price: 150 },
] as const;

export type AddOnId = (typeof addOns)[number]["id"];

export const waLink = (text: string) =>
  `https://wa.me/${melaConfig.whatsapp}?text=${encodeURIComponent(text)}`;

export const money = (n: number) => `US$${n.toLocaleString("en-US")}`;
