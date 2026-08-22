#!/usr/bin/env bash
# Descarga el modelo "base" de whisper.cpp (multilenguaje, liviano, ~140MB).
set -euo pipefail

MODEL_DIR="$(dirname "$0")/models"
mkdir -p "$MODEL_DIR"

MODEL_URL="https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin"
MODEL_PATH="$MODEL_DIR/ggml-base.bin"

if [ -f "$MODEL_PATH" ]; then
  echo "El modelo ya está descargado en $MODEL_PATH"
  exit 0
fi

echo "Descargando modelo whisper base en $MODEL_PATH ..."
curl -L -o "$MODEL_PATH" "$MODEL_URL"
echo "Listo."
