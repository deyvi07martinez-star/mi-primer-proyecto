const URL_DB = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function redis(cmd) {
  const r = await fetch(URL_DB, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd)
  });
  return r.json();
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!URL_DB || !TOKEN) return res.status(500).json({ error: 'Falta conectar la base de datos' });

  if (req.method === 'GET') {
    const j = await redis(['GET', 'liga:estado']);
    let d = null;
    try { d = j.result ? JSON.parse(j.result) : null; } catch (e) {}
    return res.status(200).json(d || {});
  }

  if (req.method === 'POST') {
    if (!process.env.OWNER_PASS || req.headers['x-pass'] !== process.env.OWNER_PASS) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    const b = req.body || {};
    if (b.check) return res.status(200).json({ ok: true });
    if (typeof b.blob !== 'string' || b.blob.length > 900000) return res.status(400).json({ error: 'Datos no válidos' });
    await redis(['SET', 'liga:estado', JSON.stringify({ blob: b.blob, t: Date.now() })]);
    return res.status(200).json({ ok: true });
  }
  res.status(405).end();
};
