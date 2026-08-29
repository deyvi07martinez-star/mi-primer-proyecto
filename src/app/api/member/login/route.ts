import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const member = await prisma.member.findUnique({ where: { email } });

  if (!member || member.password !== password) {
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }

  return NextResponse.json({
    name: member.name,
    email: member.email,
    tier: member.tier,
    points: member.points,
    memberSince: member.memberSince,
  });
}
