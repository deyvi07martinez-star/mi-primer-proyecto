'use client';

import { useState, useEffect } from 'react';

interface Settings {
  matchDuration: number; // minutos
  maxPlayersPerTeam: number;
  halftimeDuration: number; // minutos
  allowGuestAccess: boolean;
}

export default function SettingsManager() {
  const [settings, setSettings] = useState<Settings>({
    matchDuration: 20,
    maxPlayersPerTeam: 6,
    halftimeDuration: 10,
    allowGuestAccess: true,
  });

  useEffect(() => {
    const stored = localStorage.getItem('footballSettings');
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('footballSettings', JSON.stringify(settings));
    alert('Configuración guardada exitosamente');
  };

  const handleReset = () => {
    setSettings({
      matchDuration: 20,
      maxPlayersPerTeam: 6,
      halftimeDuration: 10,
      allowGuestAccess: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Match Duration */}
      <div className="bg-white/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">⏱️ Duración del Partido</h3>
        <div className="space-y-4">
          <div>
            <label className="text-blue-300 text-sm font-semibold mb-2 block">
              Duración del Primer Tiempo: {settings.matchDuration} minutos
            </label>
            <input
              type="range"
              min="10"
              max="90"
              step="5"
              value={settings.matchDuration}
              onChange={(e) =>
                setSettings({ ...settings, matchDuration: parseInt(e.target.value) })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="text-blue-300 text-sm font-semibold mb-2 block">
              Duración del Descanso: {settings.halftimeDuration} minutos
            </label>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={settings.halftimeDuration}
              onChange={(e) =>
                setSettings({ ...settings, halftimeDuration: parseInt(e.target.value) })
              }
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Players Configuration */}
      <div className="bg-white/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">👥 Configuración de Jugadores</h3>
        <div className="space-y-4">
          <div>
            <label className="text-blue-300 text-sm font-semibold mb-2 block">
              Máximo de Jugadores por Equipo: {settings.maxPlayersPerTeam}
            </label>
            <input
              type="range"
              min="3"
              max="15"
              step="1"
              value={settings.maxPlayersPerTeam}
              onChange={(e) =>
                setSettings({ ...settings, maxPlayersPerTeam: parseInt(e.target.value) })
              }
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Access Control */}
      <div className="bg-white/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">🔐 Control de Acceso</h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.allowGuestAccess}
            onChange={(e) =>
              setSettings({ ...settings, allowGuestAccess: e.target.checked })
            }
            className="w-5 h-5"
          />
          <span className="text-blue-100">Permitir acceso de invitados por QR</span>
        </label>
      </div>

      {/* Photo Upload */}
      <div className="bg-white/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">📸 Agregar Fotos</h3>
        <div className="border-2 border-dashed border-blue-500/50 rounded-lg p-6 text-center hover:border-blue-400 transition cursor-pointer">
          <input type="file" multiple accept="image/*" className="hidden" id="photo-input" />
          <label htmlFor="photo-input" className="cursor-pointer">
            <p className="text-blue-200 font-semibold">📤 Arrastra fotos aquí o haz clic</p>
            <p className="text-blue-400 text-sm mt-1">PNG, JPG, GIF hasta 10MB</p>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition"
        >
          ✅ Guardar Cambios
        </button>
        <button
          onClick={handleReset}
          className="flex-1 bg-slate-700 hover:bg-slate-800 text-white py-3 rounded-lg font-bold transition"
        >
          🔄 Restablecer
        </button>
      </div>
    </div>
  );
}
