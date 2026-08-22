# Voz local — oídos y boca de JARVIS

100% local, gratis, sin nube. Dos piezas:

- **Escucha (STT)**: [whisper.cpp](https://github.com/ggml-org/whisper.cpp) — transcribe tu voz a texto en tu máquina.
- **Habla (TTS)**: [Piper](https://github.com/rhasspy/piper) — convierte la respuesta de texto a audio, también local.

Tu audio nunca sale de tu compu: ambas herramientas corren offline una vez instaladas.

## Instalación (una sola vez)

macOS:
```bash
brew install whisper-cpp piper sox
```

Linux (Debian/Ubuntu):
```bash
sudo apt install sox
# whisper.cpp y piper no tienen paquete apt estable en todas las distros —
# instalalos desde sus releases:
#   whisper.cpp: https://github.com/ggml-org/whisper.cpp/releases
#   piper:       https://github.com/rhasspy/piper/releases
# Descomprimí cada binario y agregalo a tu PATH.
```

Descargá un modelo de whisper (el "base" alcanza y es rápido):
```bash
bash ./download-whisper-model.sh
```

Descargá una voz de piper en español:
```bash
bash ./download-piper-voice.sh
```

## Uso

Mantené apretada la barra espaciadora y hablá (push-to-talk), tal como pide el operativo:

```bash
python3 push_to_talk.py
```

Esto:
1. Graba mientras mantenés `espacio` apretado (via `sox`).
2. Transcribe con whisper.cpp.
3. Manda el texto como prompt a Claude Code (`claude -p "..."`).
4. Lee la respuesta en voz alta con piper.

## Arrancarlo solo, sin apretar nada

Si preferís que JARVIS te hable solo en los 4 momentos del día (7am, 9am, 2pm, 7pm), usá el cron que arma `../setup.sh` — ver `INSTALL.md`.
