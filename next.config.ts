import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Bundles the seeded SQLite file into the serverless functions so reads
  // (rooms, extras, members) work on Vercel. Writes made in production are
  // not guaranteed to persist across cold starts — the filesystem there is
  // read-only outside of /tmp. Fine for a visual/interactive demo; a real
  // production deploy should point DATABASE_URL at a hosted database.
  outputFileTracingIncludes: {
    "/api/**/*": ["./prisma/dev.db"],
  },
  // La pagina de la liga vive ahora en su propio sitio (carpeta liga/,
  // publicada como liga-club-los-prados.vercel.app). Estas direcciones son
  // las que estuvieron en circulacion y en los primeros codigos QR: se
  // redirigen para que sigan llevando a la pagina en vez de quedar muertas.
  async redirects() {
    const liga = "https://liga-club-los-prados.vercel.app";
    return ["/liga", "/ligaclub", "/liga-club-los-prados", "/liga.html"].map(
      (source) => ({ source, destination: liga, permanent: true })
    );
  },
};

export default nextConfig;
