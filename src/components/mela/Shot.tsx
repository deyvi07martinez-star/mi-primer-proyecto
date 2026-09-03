import Image from "next/image";
import type { Shot as ShotData } from "@/lib/mela/gallery";
import type { MelaLocale } from "@/lib/mela/content";

/** Una toma del portafolio dentro de su marco vertical. */
export function Shot({
  shot,
  locale,
  sizes,
  priority = false,
  decorative = false,
}: {
  shot: ShotData;
  locale: MelaLocale;
  sizes: string;
  priority?: boolean;
  decorative?: boolean;
}) {
  const alt = decorative ? "" : locale === "en" ? shot.altEn : shot.alt;
  return (
    <span className="ph" aria-hidden={decorative || undefined}>
      <Image
        src={`/mela/${shot.file}.jpg`}
        alt={alt}
        width={600}
        height={750}
        sizes={sizes}
        priority={priority}
      />
    </span>
  );
}
