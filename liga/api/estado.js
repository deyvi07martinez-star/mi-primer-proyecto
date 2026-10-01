// Estado compartido de la liga.
//
// Guarda un solo documento JSON (equipos, partido en curso, modalidad y
// partidos del día) para que todos los que abran la página vean lo mismo.
//
// Usa Supabase (PostgreSQL) como base de datos. Si no hay conexión,
// la función responde "configurado: false" y la página sigue funcionando en modo local.

const SUPABASE_URL = 'https://cxqjlnvnxbetlukvisff.supabase.co';
const SUPABASE_KEY = 'sb_publishable_8kdvZC9AD074Bf7xCbAJdQ_L6yJaQgk';
const DOC_STAFF_ID = 2; // fila aparte para el cuerpo técnico y sus fotos
const CLAVE_DUENO = process.env.CLAVE_DUENO || 'futbolclub';

async function supabase(method, path, body = null, prefer = 'return=representation') {
  const url = `${SUPABASE_URL}/rest/v1${path}`;
  const opts = {
    method,
    headers: {
      apikey: SUPABASE_KEY,
      'Content-Type': 'application/json',
      Prefer: prefer,
    },
  };
  // las claves antiguas (JWT) también van como Bearer; las sb_publishable_ no
  if (!SUPABASE_KEY.startsWith('sb_')) opts.headers.Authorization = `Bearer ${SUPABASE_KEY}`;
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(url, opts);
  if (!r.ok) throw new Error(`supabase ${r.status}: ${r.statusText}`);
  return await r.json();
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    const faltan = [];
    if (!SUPABASE_URL) faltan.push('SUPABASE_URL');
    if (!SUPABASE_KEY) faltan.push('SUPABASE_ANON_KEY');
    const parecidas = Object.keys(process.env).filter((k) => /supa/i.test(k));
    res.status(200).json({ configurado: false, faltan, parecidas });
    return;
  }

  try {
    const esStaff = (req.query && req.query.doc) === 'staff';

    if (req.method === 'GET' && esStaff) {
      res.setHeader('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=60');
      const rows = await supabase('GET', `/estado?id=eq.${DOC_STAFF_ID}&select=data`);
      res.status(200).json({ configurado: true, estado: rows && rows.length ? rows[0].data : null });
      return;
    }

    if (req.method === 'GET') {
      res.setHeader('Cache-Control', 'public, s-maxage=2, stale-while-revalidate=10');
      const rows = await supabase('GET', '/estado?id=eq.1&select=data,updated_at');
      let estado = null;
      if (rows && rows.length > 0) {
        estado = rows[0].data;
      }
      res.status(200).json({ configurado: true, estado });
      return;
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') { try { body = JSON.parse(body || '{}'); } catch (e) { body = {}; } }
      if (!body || typeof body !== 'object') body = {};

      if (body.clave !== CLAVE_DUENO) {
        res.status(401).json({ configurado: true, error: 'clave incorrecta' });
        return;
      }

      const estado = body.estado && typeof body.estado === 'object' ? body.estado : {};
      estado.updatedAt = Date.now();

      if (body.doc === 'staff') {
        await supabase('POST', '/estado?on_conflict=id',
          { id: DOC_STAFF_ID, data: estado, updated_at: estado.updatedAt },
          'resolution=merge-duplicates,return=representation');
        res.status(200).json({ configurado: true, ok: true, updatedAt: estado.updatedAt });
        return;
      }

      await supabase('PATCH', '/estado?id=eq.1', { data: estado });
      res.status(200).json({ configurado: true, ok: true, updatedAt: estado.updatedAt });
      return;
    }

    res.status(405).json({ error: 'metodo no permitido' });
  } catch (e) {
    res.status(500).json({ configurado: true, error: String((e && e.message) || e) });
  }
};
