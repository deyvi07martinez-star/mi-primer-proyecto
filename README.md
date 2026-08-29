# Noir & Sel

Demo de un sitio web de resort boutique de lujo, construida con **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4** y **Prisma + SQLite**.

## Qué incluye

- **Home** cinematográfico con hero animado (efecto Ken Burns) y mapa interactivo del resort.
- **Habitaciones & Villas**: selector visual filtrable (habitaciones, suites, villas) con datos reales desde la base de datos.
- **Restaurante**: menú de temporada y formulario de reserva de mesa (persistido en base de datos).
- **Spa & Experiencias**: catálogo de rituales y experiencias.
- **Club Noir**: membresía VIP con login (cuenta demo) y niveles con beneficios.
- **Reservar**: configurador de estadía paso a paso (fechas, habitación, extras) con precio total en tiempo real y checkout simulado (modo prueba, sin cobros reales).
- **Concierge IA**: chat flotante disponible en todo el sitio con respuestas simuladas.
- **Panel de administración** (`/admin`): edición de precios de habitaciones, listado de reservas, miembros del Club Noir y reservas del restaurante.
- **Bilingüe**: español / inglés, con selector de idioma persistente.

## Cómo correrlo

```bash
npm install
npx prisma generate
npx prisma db push
npx prisma db seed   # datos de ejemplo: habitaciones, extras, miembro demo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Credenciales de demostración

- **Club Noir (huésped):** `demo@noiretsel.com` / `demo1234`
- **Panel admin (staff):** `admin` / `admin123`

## Notas

- Los pagos están simulados (no hay integración real de Stripe); la arquitectura está lista para conectarla en modo de prueba.
- Las imágenes son fotografías de stock (Unsplash) usadas como placeholder de la identidad visual "Noir & Sel".
- El concierge responde con lógica simulada por palabras clave; está pensado como punto de partida para integrar la API de Claude.
