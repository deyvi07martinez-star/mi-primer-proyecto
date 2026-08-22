#!/usr/bin/env bash
# Setup de JARVIS OS -- corré esto una vez despues de clonar el repo.
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "== JARVIS OS setup =="
echo

ok()   { echo "  [ok] $1"; }
warn() { echo "  [!!] $1"; }

# 1. Claude Code CLI
if command -v claude >/dev/null 2>&1; then
  ok "Claude Code encontrado ($(claude --version 2>/dev/null || echo 'version desconocida'))"
else
  warn "Claude Code no está instalado. Ver INSTALL.md antes de seguir."
fi

# 2. sox (grabación de audio)
if command -v sox >/dev/null 2>&1; then
  ok "sox encontrado"
else
  warn "sox no está instalado (necesario para escuchar). macOS: brew install sox"
fi

# 3. whisper.cpp
if command -v whisper-cli >/dev/null 2>&1; then
  ok "whisper.cpp encontrado"
else
  warn "whisper.cpp (whisper-cli) no está en el PATH. Ver voice/README.md"
fi

# 4. piper
if command -v piper >/dev/null 2>&1; then
  ok "piper encontrado"
else
  warn "piper no está en el PATH. Ver voice/README.md"
fi

# 5. modelos de voz descargados
if [ -f "voice/models/ggml-base.bin" ]; then
  ok "modelo de whisper descargado"
else
  warn "falta el modelo de whisper -- corriendo download-whisper-model.sh"
  bash voice/download-whisper-model.sh || warn "no se pudo descargar automáticamente, hacelo a mano"
fi

if [ -f "voice/voices/es_ES-davefx-medium.onnx" ]; then
  ok "voz de piper descargada"
else
  warn "falta la voz de piper -- corriendo download-piper-voice.sh"
  bash voice/download-piper-voice.sh || warn "no se pudo descargar automáticamente, hacelo a mano"
fi

echo
echo "== Vault =="
ok "estructura en vault/ (crudo, medio, pedidos, salidas)"
echo "  Abrí Obsidian y cargá esta carpeta como vault: $DIR/vault"

echo
echo "== Listo =="
echo "Próximos pasos:"
echo "  1) cd $DIR && claude   -> probá pedirle 'plan de hoy' para confirmar que las skills cargan."
echo "  2) cd voice && python3 push_to_talk.py   -> para prender la voz."
echo "  3) cd hud && python3 server.py           -> para prender el HUD en http://localhost:8765"
echo
echo "Para que corra solo 4 veces al día (7am, 9am, 2pm, 7pm), ver el cron sugerido en INSTALL.md."
