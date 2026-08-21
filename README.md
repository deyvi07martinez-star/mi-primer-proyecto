# Sabor Dominicano — Sitio Web del Restaurante

Sitio web de una sola página para un restaurante, listo para publicar. Hecho en HTML, CSS y JavaScript puro (sin frameworks ni build step), así que se puede subir a cualquier hosting estático (GitHub Pages, Netlify, Vercel, Hostinger, etc.) tal cual.

## Ver el sitio en tu computadora

No necesitas instalar nada. Basta con abrir `index.html` en el navegador, o levantar un servidor local:

```bash
python3 -m http.server 8000
```

y visitar `http://localhost:8000`.

## Estructura

- `index.html` — contenido y secciones (Inicio, Nosotros, Menú, Galería, Reservas, Ubicación).
- `styles.css` — estilos, colores y diseño responsivo.
- `script.js` — menú móvil, pestañas del menú, galería con lightbox y el formulario de reservas.

## Cómo personalizarlo con tus datos reales

1. **Nombre y textos**: reemplaza "Sabor Dominicano" y los textos de ejemplo en `index.html` por los de tu restaurante.
2. **Menú y precios**: edita los bloques `.menu-item` dentro de `index.html` (sección `id="menu"`) con tus platos y precios en RD$.
3. **Fotos**: las imágenes de fondo y de la galería usan fotos de muestra de Unsplash. Sustituye las URLs en `index.html` y `styles.css` por fotos reales de tu local y tus platos.
4. **WhatsApp de reservas**: en `script.js`, cambia la constante `RESTAURANT_WHATSAPP` por el número real del restaurante (código de país + número, sin el signo `+`).
5. **Dirección, horario y mapa**: en la sección `id="ubicacion"` de `index.html`, actualiza la dirección, horario, teléfono/email y el enlace del mapa de Google (`src` del `iframe`).
6. **Redes sociales**: agrega los enlaces reales en `.social-links` (Instagram, Facebook, WhatsApp).

## Publicarlo en internet

La forma más rápida y gratuita es **GitHub Pages**:

1. Sube este repositorio a GitHub (si aún no lo está).
2. Ve a *Settings → Pages* en el repositorio.
3. En "Source" selecciona la rama principal y la carpeta raíz (`/`).
4. En un par de minutos tu sitio estará disponible en una URL tipo `https://tu-usuario.github.io/mi-primer-proyecto`.

También puedes arrastrar la carpeta a [Netlify Drop](https://app.netlify.com/drop) para publicarlo en segundos, o comprar un dominio y hosting propio y subir estos mismos archivos por FTP.
