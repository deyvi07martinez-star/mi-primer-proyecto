import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addOns, packagePrices, type PackageKey } from "@/lib/mela/config";

const VALID_PACKAGES = Object.keys(packagePrices) as PackageKey[];
const VALID_ADD_ONS = addOns.map((a) => a.id) as string[];

type LeadPayload = {
  name?: string;
  date?: string;
  place?: string;
  locale?: string;
  message?: string;
  packageKey?: string;
  addOns?: string[];
  estimate?: number;
};

const trim = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(req: Request) {
  let body: LeadPayload;
  try {
    body = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const packageKey = VALID_PACKAGES.includes(body.packageKey as PackageKey)
    ? (body.packageKey as PackageKey)
    : null;
  if (!packageKey) {
    return NextResponse.json({ error: "Unknown package" }, { status: 400 });
  }

  // El precio se recalcula en el servidor: lo que manda el navegador es una
  // pista, no una fuente de verdad.
  const picked = (Array.isArray(body.addOns) ? body.addOns : []).filter((id) =>
    VALID_ADD_ONS.includes(id),
  );
  const estimate =
    packagePrices[packageKey] +
    addOns.filter((a) => picked.includes(a.id)).reduce((sum, a) => sum + a.price, 0);

  const weddingDate = body.date ? new Date(body.date) : null;

  const lead = await prisma.lead.create({
    data: {
      name: trim(body.name, 120),
      place: trim(body.place, 200),
      message: trim(body.message, 2000),
      locale: body.locale === "en" ? "en" : "es",
      packageKey,
      addOns: JSON.stringify(picked),
      estimate,
      weddingDate: weddingDate && !Number.isNaN(weddingDate.getTime()) ? weddingDate : null,
    },
  });

  return NextResponse.json({ id: lead.id, estimate: lead.estimate }, { status: 201 });
}

export async function GET() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json(leads);
}
