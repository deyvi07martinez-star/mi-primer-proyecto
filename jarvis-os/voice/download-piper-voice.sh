#!/usr/bin/env bash
# Descarga una voz en español para Piper (es_AR o es_MX según prefieras).
set -euo pipefail

VOICE_DIR="$(dirname "$0")/voices"
mkdir -p "$VOICE_DIR"

# Voz español (España, media quality) — cambiá la URL si preferís otro acento,
# ver el catálogo completo en https://github.com/rhasspy/piper/blob/master/VOICES.md
BASE_URL="https://huggingface.co/rhasspy/piper-voices/resolve/main/es/es_ES/davefx/medium"
MODEL="es_ES-davefx-medium.onnx"
CONFIG="es_ES-davefx-medium.onnx.json"

if [ -f "$VOICE_DIR/$MODEL" ]; then
  echo "La voz ya está descargada en $VOICE_DIR/$MODEL"
  exit 0
fi

echo "Descargando voz de Piper en $VOICE_DIR ..."
curl -L -o "$VOICE_DIR/$MODEL" "$BASE_URL/$MODEL"
curl -L -o "$VOICE_DIR/$CONFIG" "$BASE_URL/$CONFIG"
echo "Listo."
