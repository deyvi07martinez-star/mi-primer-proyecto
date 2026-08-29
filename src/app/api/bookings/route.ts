import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { BookingPayload } from "@/lib/types";

export async function POST(req: Request) {
  const body = (await req.json()) as BookingPayload;

  if (!body.roomTypeId || !body.guestName || !body.guestEmail || !body.checkIn || !body.checkOut) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const booking = await prisma.booking.create({
    data: {
      roomTypeId: body.roomTypeId,
      guestName: body.guestName,
      guestEmail: body.guestEmail,
      checkIn: new Date(body.checkIn),
      checkOut: new Date(body.checkOut),
      guests: body.guests,
      extras: JSON.stringify(body.extras ?? []),
      totalPrice: body.totalPrice,
      status: "confirmed",
      paymentStatus: "paid_test",
    },
  });

  return NextResponse.json({ id: booking.id, status: booking.status });
}

export async function GET() {
  const bookings = await prisma.booking.findMany({
    include: { roomType: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(bookings);
}
