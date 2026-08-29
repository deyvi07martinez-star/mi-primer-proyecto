import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rooms = await prisma.roomType.findMany({ orderBy: { basePrice: "asc" } });
  const parsed = rooms.map((r) => ({
    ...r,
    amenities: JSON.parse(r.amenities) as string[],
    images: JSON.parse(r.images) as string[],
  }));
  return NextResponse.json(parsed);
}
