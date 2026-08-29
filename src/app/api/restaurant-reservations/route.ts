import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.guestName || !body.guestEmail || !body.date || !body.time || !body.partySize) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const reservation = await prisma.restaurantReservation.create({
    data: {
      guestName: body.guestName,
      guestEmail: body.guestEmail,
      date: new Date(body.date),
      time: body.time,
      partySize: Number(body.partySize),
      notes: body.notes ?? null,
    },
  });

  return NextResponse.json({ id: reservation.id, status: reservation.status });
}

export async function GET() {
  const reservations = await prisma.restaurantReservation.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reservations);
}
