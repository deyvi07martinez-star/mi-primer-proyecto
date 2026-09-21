// Estado compartido de la liga.
//
// Guarda un solo documento JSON (equipos, partido en curso, modalidad y
// partidos del día) para que todos los que abran la página vean lo mismo.
//
// Necesita una base de datos Redis conectada al proyecto en Vercel. La
// integración de Upstash inyecta sola las variables; se aceptan los dos
// nombres que usa Vercel. Si no hay base de datos, la función responde
// "configurado: false" y la página sigue funcionando en modo local.

const BASE = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const CLAVE_DOC = 'liga-club-los-prados:estado';
const CLAVE_DUENO = process.env.CLAVE_DUENO || 'futbolclub';

async function redis(comando) {
  const r = await fetch(BASE, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(comando),
  });
  if (!r.ok) throw new Error('redis respondio ' + r.status);
  const data = await r.json();
  return data.result;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  if (!BASE || !TOKEN) {
    res.status(200).json({ configurado: false });
    return;
  }

  try {
    if (req.method === 'GET') {
      // Se cachea 2 segundos en el borde de Vercel: aunque haya cien personas
      // mirando el partido, a la base de datos solo le llega una consulta cada
      // 2 segundos en vez de cien. Es lo que mantiene el plan gratis con holgura.
      res.setHeader('Cache-Control', 'public, s-maxage=2, stale-while-revalidate=10');
      const raw = await redis(['GET', CLAVE_DOC]);
      let estado = null;
      if (raw) { try { estado = JSON.parse(raw); } catch (e) { estado = null; } }
      res.status(200).json({ configurado: true, estado });
      return;
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') { try { body = JSON.parse(body || '{}'); } catch (e) { body = {}; } }
      if (!body || typeof body !== 'object') body = {};

      // solo escribe quien tiene la clave del panel del dueño
      if (body.clave !== CLAVE_DUENO) {
        res.status(401).json({ configurado: true, error: 'clave incorrecta' });
        return;
      }

      const estado = body.estado && typeof body.estado === 'object' ? body.estado : {};
      estado.updatedAt = Date.now();
      await redis(['SET', CLAVE_DOC, JSON.stringify(estado)]);
      res.status(200).json({ configurado: true, ok: true, updatedAt: estado.updatedAt });
      return;
    }

    res.status(405).json({ error: 'metodo no permitido' });
  } catch (e) {
    res.status(500).json({ configurado: true, error: String((e && e.message) || e) });
  }
};
