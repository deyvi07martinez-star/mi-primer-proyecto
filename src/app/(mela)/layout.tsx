import type { Metadata } from "next";
import { Bodoni_Moda, Archivo, DM_Mono, Italianno } from "next/font/google";
import "./mela.css";
import { MelaLocaleProvider } from "@/lib/mela/MelaLocaleProvider";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400"],
});

const italianno = Italianno({
  variable: "--font-italianno",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Content by Mela — Contenido de bodas en vertical",
  description:
    "Creadora de contenido de bodas en República Dominicana y bodas destino. Cobertura vertical del día completo, entregada en 24 horas y lista para publicar.",
  openGraph: {
    title: "Content by Mela",
    description:
      "Tu boda, publicada antes de que termine la fiesta. Contenido vertical entregado en 24 horas.",
    type: "website",
    locale: "es_DO",
  },
};

export default function MelaLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${bodoni.variable} ${archivo.variable} ${dmMono.variable} ${italianno.variable}`}>
      <body>
        <MelaLocaleProvider>{children}</MelaLocaleProvider>
      </body>
    </html>
  );
}
