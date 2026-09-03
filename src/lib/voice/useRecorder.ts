"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type RecorderState = "idle" | "requesting" | "recording";

export type Recorder = {
  state: RecorderState;
  /** Segundos grabados hasta ahora. */
  seconds: number;
  /** Nivel de entrada 0-1, para pintar el medidor. */
  level: number;
  error: string | null;
  start: () => Promise<void>;
  /** Detiene y devuelve el audio grabado (null si no hubo nada). */
  stop: () => Promise<Blob | null>;
};

function pickMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type));
}

/** Graba del microfono y publica duracion y nivel mientras tanto. */
export function useRecorder(): Recorder {
  const [state, setState] = useState<RecorderState>("idle");
  const [seconds, setSeconds] = useState(0);
  const [level, setLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const meterRef = useRef<{ ctx: AudioContext; raf: number } | null>(null);

  const teardown = useCallback(() => {
    const meter = meterRef.current;
    if (meter) {
      cancelAnimationFrame(meter.raf);
      void meter.ctx.close();
      meterRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recorderRef.current = null;
    setLevel(0);
  }, []);

  useEffect(() => teardown, [teardown]);

  useEffect(() => {
    if (state !== "recording") return;
    const startedAt = Date.now();
    const id = window.setInterval(() => {
      setSeconds((Date.now() - startedAt) / 1000);
    }, 100);
    return () => window.clearInterval(id);
  }, [state]);

  const start = useCallback(async () => {
    if (state !== "idle") return;
    setError(null);
    setSeconds(0);
    setState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      streamRef.current = stream;

      // Medidor de nivel independiente del contexto de reproduccion, para
      // que cerrarlo no afecte a los efectos.
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const data = new Float32Array(analyser.fftSize);
      const tick = () => {
        analyser.getFloatTimeDomainData(data);
        let sum = 0;
        for (const sample of data) sum += sample * sample;
        const rms = Math.sqrt(sum / data.length);
        setLevel(Math.min(1, rms * 4));
        const raf = requestAnimationFrame(tick);
        if (meterRef.current) meterRef.current.raf = raf;
      };
      meterRef.current = { ctx, raf: requestAnimationFrame(tick) };

      const mimeType = pickMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.start();
      recorderRef.current = recorder;
      setState("recording");
    } catch (err) {
      teardown();
      setState("idle");
      setError(
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "No diste permiso para usar el microfono."
          : "No se pudo acceder al microfono en este navegador.",
      );
    }
  }, [state, teardown]);

  const stop = useCallback(async () => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      teardown();
      setState("idle");
      return null;
    }
    const blob = await new Promise<Blob>((resolve) => {
      recorder.onstop = () => {
        resolve(new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" }));
      };
      recorder.stop();
    });
    teardown();
    setState("idle");
    return blob.size > 0 ? blob : null;
  }, [teardown]);

  return { state, seconds, level, error, start, stop };
}
