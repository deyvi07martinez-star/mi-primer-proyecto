#!/usr/bin/env python3
"""Orquestador de voz para JARVIS OS: mic -> whisper.cpp -> Claude Code -> Piper -> parlante.

Todo corre local. Sin dependencias fuera de la librería estándar de Python
(usa los binarios de sox, whisper.cpp y piper que ya instalaste con
voice/README.md).

Uso:
    python3 push_to_talk.py

Control: apretá ENTER para empezar a grabar, hablá, apretá ENTER de nuevo
para cortar y mandar. (Hold-to-talk real con la barra espaciadora es un
paso 2 opcional -- ver el comentario al final del archivo.)
"""
import os
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).parent
WHISPER_MODEL = HERE / "models" / "ggml-base.bin"
PIPER_VOICE = HERE / "voices" / "es_ES-davefx-medium.onnx"

WHISPER_BIN = os.environ.get("WHISPER_BIN", "whisper-cli")
PIPER_BIN = os.environ.get("PIPER_BIN", "piper")
CLAUDE_BIN = os.environ.get("CLAUDE_BIN", "claude")


def check_tool(binary: str, name: str) -> None:
    if subprocess.call(["which", binary], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL) != 0:
        sys.exit(
            f"No encuentro '{binary}' en el PATH ({name}). "
            f"Revisá voice/README.md para instalarlo."
        )


def record(wav_path: Path) -> None:
    input("Apretá ENTER y empezá a hablar...")
    print("Grabando... apretá ENTER de nuevo para cortar.")
    proc = subprocess.Popen(["sox", "-d", "-r", "16000", "-c", "1", str(wav_path)])
    input()
    proc.terminate()
    proc.wait()


def transcribe(wav_path: Path) -> str:
    if not WHISPER_MODEL.exists():
        sys.exit("Falta el modelo de whisper. Corré ./download-whisper-model.sh primero.")
    result = subprocess.run(
        [WHISPER_BIN, "-m", str(WHISPER_MODEL), "-f", str(wav_path), "-l", "es", "-nt", "-otxt", "-of", str(wav_path.with_suffix(""))],
        capture_output=True, text=True,
    )
    if result.returncode != 0:
        sys.exit(f"Error transcribiendo: {result.stderr}")
    txt_path = wav_path.with_suffix(".txt")
    return txt_path.read_text().strip() if txt_path.exists() else ""


def ask_claude(prompt: str, cwd: Path) -> str:
    result = subprocess.run(
        [CLAUDE_BIN, "-p", prompt],
        capture_output=True, text=True, cwd=str(cwd),
    )
    if result.returncode != 0:
        sys.exit(f"Error llamando a Claude Code: {result.stderr}")
    return result.stdout.strip()


def speak(text: str) -> None:
    if not PIPER_VOICE.exists():
        print(f"(sin voz configurada, respuesta en texto)\n{text}")
        return
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        out_wav = Path(f.name)
    proc = subprocess.run(
        [PIPER_BIN, "--model", str(PIPER_VOICE), "--output_file", str(out_wav)],
        input=text, text=True, capture_output=True,
    )
    if proc.returncode != 0:
        print(f"(error en piper: {proc.stderr})\n{text}")
        return
    subprocess.run(["play", "-q", str(out_wav)])
    out_wav.unlink(missing_ok=True)


def main() -> None:
    check_tool("sox", "sox")
    check_tool(WHISPER_BIN, "whisper.cpp")
    check_tool(CLAUDE_BIN, "Claude Code CLI")

    project_root = HERE.parent  # jarvis-os/, para que Claude Code vea las skills y el vault
    print("JARVIS OS -- voz local activa. Ctrl+C para salir.\n")

    while True:
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
            wav_path = Path(f.name)
        try:
            record(wav_path)
            text = transcribe(wav_path)
            if not text:
                print("No te escuché bien, probá de nuevo.\n")
                continue
            print(f"Vos: {text}")
            reply = ask_claude(text, cwd=project_root)
            print(f"JARVIS: {reply}\n")
            speak(reply)
        finally:
            wav_path.unlink(missing_ok=True)
            wav_path.with_suffix(".txt").unlink(missing_ok=True)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nChau.")

# --- Paso 2 opcional: hold-to-talk real con la barra espaciadora ---
# El modo ENTER/ENTER de arriba funciona en cualquier terminal sin
# dependencias extra. Si querés el "mantené apretada la barra y hablá"
# tal cual, instalá `pip install pynput` y reemplazá record() para
# escuchar keydown/keyup de la barra espaciadora en vez de input().
# En Linux puede pedir permisos de acceso a input (grupo `input` o root).
