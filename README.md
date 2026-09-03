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

---

# Content by Mela (`/mela`)

Sitio de **Mela**, creadora de contenido de bodas (República Dominicana y bodas
destino), pensado para vender: portafolio, paquetes con precios de partida y un
cotizador que arma el mensaje y lo manda por WhatsApp.

Vive en su propio *root layout* dentro del route group `(mela)`, así que no
comparte nada con Noir & Sel: ni tipografías, ni estilos, ni la barra de
navegación. Noir & Sel se movió al route group `(noir)` y conserva todas sus
URLs (`/`, `/habitaciones`, `/club`…).

## Qué incluye

- **Bilingüe ES/EN** con selector propio; recuerda el idioma en `localStorage` y
  arranca en el del navegador.
- **Portafolio** de tres bodas reales (colonial, campo y destino), cada una como
  una tira horizontal de tomas verticales.
- **Paquetes** en tabla comparativa con precios "desde".
- **Cotizador**: paquete + extras → precio de partida en vivo, y el botón de
  WhatsApp abre el chat con la solicitud ya redactada.
- **Captura de solicitudes**: cada envío se guarda en la tabla `Lead`
  (`POST /api/mela/leads`). El servidor **recalcula el precio**; lo que manda el
  navegador no se guarda tal cual.
- **Proceso, sobre mí, testimonio, preguntas frecuentes** y barra fija de
  WhatsApp en móvil.

## Antes de publicarlo

1. **Datos de contacto y precios** — todo está en `src/lib/mela/config.ts`:
   número de WhatsApp, correo, enlace del calendario y los precios de partida.
   Los valores actuales son marcadores de posición.
2. **Fotos** — las de `public/mela/` salieron de capturas de Instagram y están en
   baja resolución. Reemplázalas por los originales manteniendo los mismos
   nombres de archivo y el sitio no necesita otro cambio.
3. **Cifras del portafolio y de los paquetes** (horas, número de clips, plazos de
   entrega) están en `src/lib/mela/content.ts` y hay que confirmarlas con ella.
4. **Testimonios** — solo hay uno real, tomado de un comentario público en
   Instagram. Los demás hay que pedírselos a sus novias.

## Ver las solicitudes recibidas

```bash
curl http://localhost:3000/api/mela/leads
```

En producción sobre Vercel el SQLite del repo es de solo lectura: para guardar
solicitudes de verdad hay que apuntar `DATABASE_URL` a una base de datos alojada
(Postgres, Turso, PlanetScale…). Mientras tanto el botón de WhatsApp funciona
igual, que es la vía por la que llegan casi todas las novias.
