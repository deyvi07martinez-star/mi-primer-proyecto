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

export async function PATCH(req: Request) {
  const { id, basePrice } = await req.json();

  if (!id || typeof basePrice !== "number") {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const updated = await prisma.roomType.update({
    where: { id },
    data: { basePrice },
  });

  return NextResponse.json({ id: updated.id, basePrice: updated.basePrice });
}
