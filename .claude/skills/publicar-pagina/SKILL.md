---
name: publicar-pagina
description: Publicar una página web con link de Vercel, código QR, cartel imprimible y "mente compartida" (todos ven lo mismo en tiempo real, solo el dueño escribe) usando Supabase gratis. Úsalo cuando el usuario pida publicar una página, ponerle QR/link, o sincronizarla entre teléfonos.
---

# Publicar página + QR + mente compartida

El usuario NO es técnico, trabaja desde el teléfono y está cansado de rodeos. Habla en español, da un paso a la vez, manda links directos y haz tú todo lo que se pueda desde el código. Prueba siempre con `curl` y un navegador (Playwright) antes de decir "listo". Referencia real: la Liga Club Los Prados (carpeta `liga/` de este repo).

## 1. Estructura de la página
Carpeta propia en el repo, ej. `liga/`: `index.html` (todo en un archivo), `api/estado.js`, `vercel.json`, `robots.txt`, `sitemap.xml`, imagen para compartir (`og-*.png`), `qr.png/svg`, `cartel.png/pdf`.
- SEO: `<title>`, `description`, `canonical`, Open Graph, JSON-LD, `robots.txt`, `sitemap.xml` con la URL final.
- Vercel: un proyecto aparte con **Root Directory = esa carpeta**. NO uses el proyecto Next.js del repo (`mi-primer-proyecto.vercel.app/liga` da 404; no intentes servirla desde ahí). El dominio queda `https://<nombre>.vercel.app`.
- Vercel despliega solo al hacer push a `main`. Confirma con el usuario/rama designada antes de empujar si las instrucciones de la sesión dicen otra rama.

## 2. Mente compartida (Supabase gratis, sin Redis: Redis/Upstash en Vercel es de pago)
Un solo documento JSON con TODO el estado; el dueño escribe, los demás leen.
1. Crear proyecto en supabase.com (plan Free). Pedir al usuario solo: Project URL y la clave `sb_publishable_...` (Settings > API Keys).
2. SQL Editor (https://supabase.com/dashboard/project/<ref>/sql/new), pegar y **tocar Run** (debe decir Success). El editor autocierra paréntesis: borrar el `)` sobrante de la última línea.
```sql
create table if not exists estado (id int primary key default 1, data jsonb default '{}', updated_at bigint);
alter table estado disable row level security;
insert into estado (id, data, updated_at) values (1, '{}', 0) on conflict (id) do nothing;
```
3. API: copiar `api-estado.js` (esta carpeta) a `<carpeta>/api/estado.js` y reemplazar `__SUPABASE_URL__`, `__SUPABASE_PUBLISHABLE_KEY__`, `__CLAVE_DUENO__`.
   - **Poner URL y clave publishable directo en el código.** Las variables de entorno de Vercel dieron muchos problemas (nombre mal pegado, valor cruzado, falta de Redeploy). La clave `sb_publishable_` es pública por diseño.
   - La clave `sb_publishable_` va en el header `apikey`, **sin** `Authorization: Bearer` (con Bearer da 401).
   - Si RLS está activo sin políticas, el PATCH "funciona" (ok:true) pero no guarda y el GET devuelve `[]`: por eso `disable row level security`.
4. Verificar: `curl https://<dominio>/api/estado` -> `{"configurado":true,...}`; POST con `{"clave":"...","estado":{"x":1}}` y luego GET debe devolver `x`. Luego limpiar con `estado:{}`.

Cliente (en `index.html`), patrón probado:
- `estadoActual()` arma el JSON; `aplicarEstado(remoto)` lo pinta. Solo se aplica si `updatedAt > ultimoRemoto` y no si acabamos de enviar (ventana ~1.5 s).
- Dueño: `empujar()` agrupa cambios (350 ms, máx. 1.2 s) y hace POST con la clave. Espectadores: GET cada 2-3 s, nada si la pestaña está oculta; consulta inmediata al volver.
- Relojes: guardar `endsAt` (hora real) y calcular el restante con `Date.now()`, así no se atrasa si se bloquea el teléfono.
- Seguridad doble: los botones de control no existen en la parte pública Y cada función de acción empieza con `if(enVivo && !esDueno()) return;`.
- Si la API responde `configurado:false`, la página sigue en modo local (un solo teléfono) con aviso visible.

## 3. QR y cartel
En una carpeta temporal: `npm i qrcode playwright-core`, luego
`node qr.js https://<dominio> <carpeta>` (nivel de corrección H, margen 4) y `node cartel.js https://<dominio> <carpeta>` (A4 PNG+PDF; editar los textos).
Verificar que el QR lee la URL correcta (OpenCV: `pip install opencv-python-headless`, `cv2.QRCodeDetector().detectAndDecode`). Confirmar con curl que `/qr.png` y `/cartel.pdf` responden 200 y mandarlos al usuario con SendUserFile (archivos dentro del directorio de trabajo o scratchpad).

## 4. Publicar y comprobar
`git add` solo los archivos de la carpeta, commit, `git push -u origin main`; esperar ~30 s y repetir el `curl` a `/api/estado` hasta ver `configurado:true`. Probar de punta a punta con Playwright (dos contextos: dueño cambia algo, el otro lo ve) y capturas en pantalla de teléfono (390 px).

## 5. Antes de entregar o vender
Cambiar teléfono/WhatsApp/Instagram, la clave del dueño (está en el JS del cliente y en la API: cámbiala en ambos), pasar Supabase y Vercel a las cuentas del comprador, y endurecer la tabla (RLS con políticas y clave de servidor en vez de tabla abierta).

## 6. Ideas pendientes que el usuario ya pidió
- Interruptor "Página abierta / cerrada" en el panel del dueño (guardar `cerrada` y un texto de aviso en el estado; el público ve solo el aviso, el dueño sigue entrando).
