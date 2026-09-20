'use client';

import { useState } from 'react';
import TeamManager from './AdminPanelTabs/TeamManager';
import SettingsManager from './AdminPanelTabs/SettingsManager';
import QRGenerator from './AdminPanelTabs/QRGenerator';

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'teams' | 'settings' | 'qr'>('teams');

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-amber-500/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">⚙️ Panel Administrador</h2>
          <button
            onClick={onClose}
            className="text-blue-300 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-blue-500/30 pb-4">
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === 'teams'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800 text-blue-100 hover:bg-slate-700'
            }`}
          >
            👥 Equipos
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === 'settings'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800 text-blue-100 hover:bg-slate-700'
            }`}
          >
            ⚙️ Configuración
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === 'qr'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800 text-blue-100 hover:bg-slate-700'
            }`}
          >
            🎯 Código QR
          </button>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'teams' && <TeamManager />}
          {activeTab === 'settings' && <SettingsManager />}
          {activeTab === 'qr' && <QRGenerator />}
        </div>
      </div>
    </div>
  );
}
