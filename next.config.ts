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
};

export default nextConfig;
