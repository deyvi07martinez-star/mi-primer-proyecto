'use client';

import { useState } from 'react';
import TeamsView from '@/components/football/TeamsView';
import StatsPanel from '@/components/football/StatsPanel';

type ViewType = 'teams' | 'stats';

export default function FootballPublicPage() {
  const [selectedModality, setSelectedModality] = useState<'sala' | 'campo'>('sala');
  const [activeView, setActiveView] = useState<ViewType>('teams');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 px-8 py-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">⚽ Club de Fútbol</h1>
            <p className="text-blue-200 text-sm">Acceso Público</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedModality('sala')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                selectedModality === 'sala'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-blue-100 hover:bg-white/20'
              }`}
            >
              🏠 Fútbol Sala
            </button>
            <button
              onClick={() => setSelectedModality('campo')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                selectedModality === 'campo'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-blue-100 hover:bg-white/20'
              }`}
            >
              🌾 Fútbol Campo
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white/5 border-b border-white/10 sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-8 py-4 flex gap-4">
          <button
            onClick={() => setActiveView('teams')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeView === 'teams'
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-blue-100 hover:bg-white/20'
            }`}
          >
            👥 Equipos
          </button>
          <button
            onClick={() => setActiveView('stats')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeView === 'stats'
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-blue-100 hover:bg-white/20'
            }`}
          >
            📊 Estadísticas
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {activeView === 'teams' ? (
          <TeamsView modality={selectedModality} />
        ) : (
          <StatsPanel modality={selectedModality} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/10 border-t border-white/20 px-8 py-6 mt-12">
        <div className="max-w-7xl mx-auto text-center text-blue-200 text-sm">
          <p>⚽ Sistema de Organización de Club de Fútbol</p>
          <p className="text-blue-400 text-xs mt-2">Acceso gratuito para todos los miembros del club</p>
        </div>
      </footer>
    </div>
  );
}
