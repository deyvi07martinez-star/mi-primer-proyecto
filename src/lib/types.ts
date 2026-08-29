export type RoomType = {
  id: string;
  slug: string;
  name: string;
  category: "habitacion" | "suite" | "villa";
  description: string;
  longDescription: string;
  basePrice: number;
  maxGuests: number;
  sizeM2: number;
  bedType: string;
  view: string;
  amenities: string[];
  images: string[];
};

export type Extra = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: "spa" | "dining" | "experience";
};

export type BookingPayload = {
  roomTypeId: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  extras: string[];
  totalPrice: number;
};
