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
- **Estudio de voz** (`/voz`): modulador de voz que funciona entero en el navegador (ver abajo).

## Estudio de voz (`/voz`)

Tres modos, sin servidor ni servicios externos: el audio y el texto no salen del navegador.

1. **Di algo y lo repito**: graba una frase con el micrófono y la devuelve con el efecto elegido (ardilla, monstruo, robot, cueva, radio, alien, gigante). El tono se cambia con un *pitch shifter* propio en un `AudioWorklet` (`public/worklets/pitch-shifter.js`), así que la frase suena más aguda o más grave **sin acelerarse**. Incluye monitor en vivo y exportación a WAV.
2. **Escribe y lo digo**: cualquier texto se lee en voz alta con la voz sintética del navegador (Web Speech API), con selector de voz, tono y velocidad.
3. **Habla con mis palabras**: graba palabras sueltas (se guardan en IndexedDB, sobreviven a recargas) y al escribir una frase se reproduce encadenando esas grabaciones tuyas; lo que falte lo pone la voz sintética.

Limitación conocida: el navegador no puede clonar una voz para leer texto arbitrario, por eso el modo 2 usa voz sintética y el modo 3 encadena grabaciones reales. El micrófono exige HTTPS (o `localhost`) y permiso del usuario.

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
