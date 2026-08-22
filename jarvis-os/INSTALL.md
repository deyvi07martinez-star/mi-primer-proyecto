# Instalar JARVIS OS en tu compu

Esto se corre en TU máquina (no en la nube), porque necesita tu micrófono, tu parlante y tu Claude Code local.

## Paso 0 — Instalar Claude Code

Elegí tu sistema:

**macOS / Linux:**
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows (PowerShell):**
```powershell
irm https://claude.ai/install.ps1 | iex
```

**O vía npm (cualquier sistema con Node):**
```bash
npm install -g @anthropic-ai/claude-code
```

Después, verificá que quedó instalado:
```bash
claude --version
```

Y logueate (te va a pedir iniciar sesión con tu cuenta de Claude):
```bash
claude
```

## Paso 1 — Bajar este proyecto

```bash
git clone https://github.com/deyvi07martinez-star/mi-primer-proyecto.git
cd mi-primer-proyecto
git checkout claude/automatizar-operativo-3sn4k0
cd jarvis-os
```

## Paso 2 — Correr el setup

```bash
chmod +x setup.sh
./setup.sh
```

Esto te va a decir qué falta instalar (sox, whisper.cpp, piper) y te descarga los modelos de voz automáticamente. Si falta algo, `voice/README.md` tiene el comando exacto para tu sistema.

## Paso 3 — Probar que las skills cargan

```bash
claude
```

Y adentro, escribí (texto, no hace falta voz todavía):
```
plan de hoy
```

Si te contesta preguntando tus 3 prioridades y las anota en `vault/medio/plan/`, ya está andando el cerebro.

## Paso 4 — Prender la voz

```bash
cd voice
python3 push_to_talk.py
```

Apretá ENTER, hablá, apretá ENTER de nuevo. Te va a transcribir, mandarlo a Claude Code, y leerte la respuesta.

## Paso 5 — Prender el HUD

En otra terminal:
```bash
cd hud
python3 server.py
```

Abrí `http://localhost:8765` en el navegador. Vas a ver vitales, plan del día e inbox actualizándose solos cada 5 segundos a medida que le hablás a JARVIS.

## Paso 6 (opcional) — Que corra solo, sin que apretés nada

Para que los 4 momentos del día (7am resumen, 9am plan, 2pm métricas, 7pm cierre) se disparen solos, agregá un cron que llame a Claude Code directamente con el pedido de texto — no necesita voz para esto:

```bash
crontab -e
```

Y agregá (ajustá la ruta a donde clonaste el repo):
```cron
0 7  * * * cd /ruta/a/mi-primer-proyecto/jarvis-os && claude -p "inbox" >> vault/salidas/cron.log 2>&1
0 9  * * * cd /ruta/a/mi-primer-proyecto/jarvis-os && claude -p "plan de hoy, preguntame las 3 prioridades" >> vault/salidas/cron.log 2>&1
0 14 * * * cd /ruta/a/mi-primer-proyecto/jarvis-os && claude -p "métricas" >> vault/salidas/cron.log 2>&1
0 19 * * * cd /ruta/a/mi-primer-proyecto/jarvis-os && claude -p "cerrá el día" >> vault/salidas/cron.log 2>&1
```

En macOS necesitás darle permiso de "Full Disk Access" a `cron`/`Terminal` en Preferencias del Sistema para que pueda leer el vault.

## Conectores opcionales

Si querés que la skill `inbox` lea tu correo/calendario de verdad (no solo lo que dictes), conectá Gmail/Calendar desde `claude.ai` → Settings → Connectors, y volvé a correr `claude` — la skill los detecta solos si están disponibles en la sesión.

No hace falta ningún conector de pago para que el resto (métricas por voz, plan, vault, HUD, voz local) funcione.
