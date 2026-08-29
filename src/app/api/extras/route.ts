import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const extras = await prisma.extra.findMany({ orderBy: { price: "asc" } });
  return NextResponse.json(extras);
}
