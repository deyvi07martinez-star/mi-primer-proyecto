"use client";

import { Mic, Square } from "lucide-react";
import { PRESETS, type PresetId } from "@/lib/voice/presets";

export function Panel({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-bone/15 bg-carbon-soft p-6 md:p-8">
      <h2 className="font-serif-display text-2xl text-bone">{title}</h2>
      {hint && <p className="mt-2 text-sm leading-relaxed text-bone/60">{hint}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-[11px] uppercase tracking-widest text-bone/50">
        {label}
        <span className="text-copper-light">{format ? format(value) : value.toFixed(2)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-copper"
      />
    </label>
  );
}

export function EffectPicker({
  value,
  onChange,
}: {
  value: PresetId;
  onChange: (id: PresetId) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {PRESETS.map((preset) => {
        const active = preset.id === value;
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onChange(preset.id)}
            aria-pressed={active}
            title={preset.description}
            className={`border px-3 py-3 text-left transition-colors ${
              active
                ? "border-copper bg-copper/15 text-bone"
                : "border-bone/15 text-bone/70 hover:border-copper/60 hover:text-bone"
            }`}
          >
            <span className="block text-sm">{preset.name}</span>
            <span className="mt-1 block text-[11px] leading-snug text-bone/45">
              {preset.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function LevelMeter({ level }: { level: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden bg-bone/10" aria-hidden>
      <div
        className="h-full bg-copper transition-[width] duration-75"
        style={{ width: `${Math.round(level * 100)}%` }}
      />
    </div>
  );
}

export function RecordButton({
  recording,
  disabled,
  seconds,
  onClick,
  labelIdle = "Grabar",
  labelRecording = "Detener",
}: {
  recording: boolean;
  disabled?: boolean;
  seconds?: number;
  onClick: () => void;
  labelIdle?: string;
  labelRecording?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-3 px-6 py-3 text-[13px] uppercase tracking-widest transition-colors disabled:opacity-40 ${
        recording
          ? "bg-bone text-carbon hover:bg-bone-dim"
          : "bg-copper text-bone hover:bg-copper-light"
      }`}
    >
      {recording ? <Square size={16} /> : <Mic size={16} />}
      {recording ? labelRecording : labelIdle}
      {recording && seconds !== undefined && (
        <span className="tabular-nums">{seconds.toFixed(1)}s</span>
      )}
    </button>
  );
}

export function ActionButton({
  children,
  onClick,
  disabled,
  variant = "outline",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "outline" | "solid" | "ghost";
}) {
  const styles = {
    outline: "border border-bone/25 text-bone hover:border-copper hover:text-copper-light",
    solid: "bg-copper text-bone hover:bg-copper-light",
    ghost: "text-bone/50 hover:text-copper-light",
  }[variant];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-4 py-2.5 text-[13px] uppercase tracking-widest transition-colors disabled:opacity-40 ${styles}`}
    >
      {children}
    </button>
  );
}
