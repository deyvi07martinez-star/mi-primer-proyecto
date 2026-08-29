import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;

const roomTypes = [
  {
    slug: "horizonte",
    name: "Habitación Horizonte",
    category: "habitacion",
    description: "Vistas abiertas al Atlántico desde una terraza privada.",
    longDescription:
      "Una habitación luminosa de 42 m² con ventanales de piso a techo, terraza privada y vistas directas al horizonte marino. Diseñada con líneas limpias, textiles naturales y el equilibrio exacto entre calidez y minimalismo que define a Noir & Sel.",
    basePrice: 420,
    maxGuests: 2,
    sizeM2: 42,
    bedType: "Cama King",
    view: "Vista al mar",
    amenities: JSON.stringify([
      "Terraza privada",
      "Minibar de autor",
      "Bata y pantuflas de lino",
      "Wifi de alta velocidad",
      "Caja fuerte",
    ]),
    images: JSON.stringify([
      img("photo-1590490360182-c33d57733427"),
      img("photo-1582719478250-c89cae4dc85b"),
      img("photo-1611892440504-42a792e24d32"),
    ]),
  },
  {
    slug: "atlantico",
    name: "Habitación Atlántico",
    category: "habitacion",
    description: "Diseño editorial y balcón privado frente al mar.",
    longDescription:
      "48 m² de espacio sereno con balcón privado, sala de estar independiente y una paleta de materiales cálidos: madera clara, lino crudo y acentos de cobre. Ideal para quienes buscan algo más de espacio sin renunciar a la intimidad.",
    basePrice: 520,
    maxGuests: 3,
    sizeM2: 48,
    bedType: "Cama King + sofá cama",
    view: "Vista al mar",
    amenities: JSON.stringify([
      "Balcón privado",
      "Sala de estar",
      "Máquina de café de especialidad",
      "Ducha de lluvia",
      "Servicio a la habitación 24h",
    ]),
    images: JSON.stringify([
      img("photo-1611892440504-42a792e24d32"),
      img("photo-1584132967334-10e028bd69f7"),
      img("photo-1590490360182-c33d57733427"),
    ]),
  },
  {
    slug: "meridiano",
    name: "Suite Meridiano",
    category: "suite",
    description: "Suite junior con piscina de inmersión privada.",
    longDescription:
      "70 m² distribuidos entre dormitorio, sala y una piscina de inmersión privada en la terraza. Pensada para escapadas que combinan silencio, agua y horizonte, con un diseño interior que evoca la calma de un santuario contemporáneo.",
    basePrice: 780,
    maxGuests: 3,
    sizeM2: 70,
    bedType: "Cama King",
    view: "Vista al mar, piscina de inmersión",
    amenities: JSON.stringify([
      "Piscina de inmersión privada",
      "Ducha exterior",
      "Mayordomo bajo solicitud",
      "Carta de almohadas",
      "Acceso prioritario al spa",
    ]),
    images: JSON.stringify([
      img("photo-1551882547-ff40c63fe5fa"),
      img("photo-1584132967334-10e028bd69f7"),
      img("photo-1611892440504-42a792e24d32"),
    ]),
  },
  {
    slug: "cobalto",
    name: "Suite Cobalto",
    category: "suite",
    description: "La suite panorámica insignia de Noir & Sel.",
    longDescription:
      "95 m² en la esquina más alta del resort, con vistas de 180° al océano, terraza envolvente y una sala de estar separada. El acento cobrizo de la marca aparece aquí en cada detalle: grifería, marcos, luminarias.",
    basePrice: 980,
    maxGuests: 4,
    sizeM2: 95,
    bedType: "Cama King + habitación de estar",
    view: "Vista panorámica 180°",
    amenities: JSON.stringify([
      "Terraza envolvente 180°",
      "Sala de estar independiente",
      "Check-in privado",
      "Acceso VIP al Club",
      "Bar privado surtido",
    ]),
    images: JSON.stringify([
      img("photo-1611892440504-42a792e24d32"),
      img("photo-1551882547-ff40c63fe5fa"),
      img("photo-1590490360182-c33d57733427"),
    ]),
  },
  {
    slug: "villa-onyx",
    name: "Villa Onyx",
    category: "villa",
    description: "Villa de dos habitaciones con piscina privada.",
    longDescription:
      "180 m² repartidos en dos habitaciones, sala, cocina de cortesía y una piscina privada rodeada de vegetación. Villa Onyx es un refugio autónomo dentro del resort, ideal para familias o grupos de amigos que buscan total privacidad.",
    basePrice: 2100,
    maxGuests: 4,
    sizeM2: 180,
    bedType: "2 Camas King",
    view: "Jardín privado, piscina propia",
    amenities: JSON.stringify([
      "Piscina privada",
      "Jardín cercado",
      "Cocina de cortesía",
      "Mayordomo dedicado",
      "Golf cart privado",
    ]),
    images: JSON.stringify([
      img("photo-1601918774946-25832a4be0d6"),
      img("photo-1602002418082-a4443e081dd1"),
      img("photo-1551882547-ff40c63fe5fa"),
    ]),
  },
  {
    slug: "villa-ambar",
    name: "Villa Ámbar",
    category: "villa",
    description: "Villa frente al mar, tres habitaciones, acceso directo a la playa.",
    longDescription:
      "310 m² en primera línea de playa, con tres habitaciones, piscina infinita privada y acceso directo a la arena. La experiencia más exclusiva de Noir & Sel, reservada para quienes buscan el máximo nivel de privacidad y servicio.",
    basePrice: 3400,
    maxGuests: 6,
    sizeM2: 310,
    bedType: "3 Camas King",
    view: "Frente al mar, acceso directo a la playa",
    amenities: JSON.stringify([
      "Piscina infinita privada",
      "Acceso directo a la playa",
      "Chef privado bajo solicitud",
      "Mayordomo 24h",
      "Traslados en yate",
    ]),
    images: JSON.stringify([
      img("photo-1602002418082-a4443e081dd1"),
      img("photo-1601918774946-25832a4be0d6"),
      img("photo-1520250497591-112f2f40a3f4"),
    ]),
  },
];

const extras = [
  {
    slug: "ritual-sal-marina",
    name: "Ritual de Sal Marina",
    description: "Exfoliación y masaje con sales minerales locales, 75 minutos.",
    price: 180,
    category: "spa",
  },
  {
    slug: "masaje-pareja",
    name: "Masaje en Pareja al Atardecer",
    description: "Sesión de masaje para dos frente al mar durante el atardecer.",
    price: 260,
    category: "spa",
  },
  {
    slug: "cena-privada-playa",
    name: "Cena Privada en la Playa",
    description: "Mesa exclusiva en la arena, menú de degustación de 5 tiempos.",
    price: 340,
    category: "dining",
  },
  {
    slug: "cata-vinos",
    name: "Cata de Vinos con el Sommelier",
    description: "Selección de vinos internacionales guiada por nuestro sommelier.",
    price: 150,
    category: "dining",
  },
  {
    slug: "catamaran-atardecer",
    name: "Tour en Catamarán al Atardecer",
    description: "Navegación privada de dos horas frente a la costa.",
    price: 220,
    category: "experience",
  },
  {
    slug: "yoga-amanecer",
    name: "Yoga al Amanecer",
    description: "Sesión privada de yoga en la terraza frente al mar.",
    price: 60,
    category: "experience",
  },
];

async function main() {
  await prisma.booking.deleteMany();
  await prisma.restaurantReservation.deleteMany();
  await prisma.member.deleteMany();
  await prisma.extra.deleteMany();
  await prisma.roomType.deleteMany();

  for (const room of roomTypes) {
    await prisma.roomType.create({ data: room });
  }
  for (const extra of extras) {
    await prisma.extra.create({ data: extra });
  }

  await prisma.member.create({
    data: {
      name: "Elena Marchetti",
      email: "demo@noiretsel.com",
      password: "demo1234",
      tier: "platinum",
      points: 4200,
    },
  });

  const rooms = await prisma.roomType.findMany();
  const villaAmbar = rooms.find((r) => r.slug === "villa-ambar")!;
  const cobalto = rooms.find((r) => r.slug === "cobalto")!;

  await prisma.booking.create({
    data: {
      roomTypeId: villaAmbar.id,
      guestName: "James Whitfield",
      guestEmail: "james@example.com",
      checkIn: new Date("2026-09-14"),
      checkOut: new Date("2026-09-20"),
      guests: 4,
      extras: JSON.stringify(["cena-privada-playa", "catamaran-atardecer"]),
      totalPrice: 3400 * 6 + 340 + 220,
      status: "confirmed",
      paymentStatus: "paid_test",
    },
  });

  await prisma.booking.create({
    data: {
      roomTypeId: cobalto.id,
      guestName: "Sofía Reyes",
      guestEmail: "sofia@example.com",
      checkIn: new Date("2026-09-05"),
      checkOut: new Date("2026-09-08"),
      guests: 2,
      extras: JSON.stringify(["masaje-pareja"]),
      totalPrice: 980 * 3 + 260,
      status: "confirmed",
      paymentStatus: "paid_test",
    },
  });

  console.log("Seed completado: habitaciones, extras, miembro demo y reservas de ejemplo.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
