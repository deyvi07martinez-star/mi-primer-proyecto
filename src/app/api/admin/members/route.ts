import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const members = await prisma.member.findMany({ orderBy: { points: "desc" } });
  return NextResponse.json(members);
}
