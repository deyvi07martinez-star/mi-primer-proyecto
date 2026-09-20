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
  // La pagina de la liga se sirve desde public/liga.html. Estas direcciones
  // con nombre apuntan al mismo archivo, para que el enlace que se comparte
  // diga como se llama la liga y no termine en ".html".
  async rewrites() {
    return [
      { source: "/liga-club-los-prados", destination: "/liga.html" },
      { source: "/ligaclub", destination: "/liga.html" },
      { source: "/liga", destination: "/liga.html" },
    ];
  },
};

export default nextConfig;
