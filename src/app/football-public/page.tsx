'use client';

import { useState } from 'react';
import TeamsView from '@/components/football/TeamsView';
import StatsPanel from '@/components/football/StatsPanel';

type ViewType = 'teams' | 'stats';

export default function FootballPublicPage() {
  const [selectedModality, setSelectedModality] = useState<'sala' | 'campo'>('sala');
  const [activeView, setActiveView] = useState<ViewType>('teams');

  return (
    <div className="min-h-screen bg-black text-white">
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in { animation: slideIn 0.6s ease-out; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-blue-900/50 bg-black/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-2xl font-bold">
                ⚽
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                  Football Club
                </h1>
                <p className="text-xs text-blue-400 uppercase tracking-widest">Plataforma Pública</p>
              </div>
            </div>
          </div>

          {/* Modality Selector */}
          <div className="flex gap-4 items-center">
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Modalidad:</span>
            <button
              onClick={() => setSelectedModality('sala')}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                selectedModality === 'sala'
                  ? 'bg-blue-600 text-white border border-blue-400'
                  : 'bg-white/10 text-blue-200 border border-blue-500/30 hover:bg-white/20'
              }`}
            >
              🏠 Fútbol Sala
            </button>
            <button
              onClick={() => setSelectedModality('campo')}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                selectedModality === 'campo'
                  ? 'bg-blue-600 text-white border border-blue-400'
                  : 'bg-white/10 text-blue-200 border border-blue-500/30 hover:bg-white/20'
              }`}
            >
              🌾 Fútbol Campo
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-t border-blue-900/30 bg-gradient-to-r from-transparent via-blue-900/10 to-transparent">
          <div className="max-w-7xl mx-auto px-8 flex gap-8">
            <button
              onClick={() => setActiveView('teams')}
              className={`py-4 px-4 font-bold uppercase tracking-wider text-sm transition-all border-b-2 ${
                activeView === 'teams'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-blue-300'
              }`}
            >
              👥 Equipos
            </button>
            <button
              onClick={() => setActiveView('stats')}
              className={`py-4 px-4 font-bold uppercase tracking-wider text-sm transition-all border-b-2 ${
                activeView === 'stats'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-blue-300'
              }`}
            >
              📊 Estadísticas
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="animate-slide-in">
          {activeView === 'teams' ? (
            <TeamsView modality={selectedModality} />
          ) : (
            <StatsPanel modality={selectedModality} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-900/50 bg-gradient-to-t from-blue-900/10 to-transparent px-8 py-12 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-8">
            <div>
              <h4 className="font-bold text-blue-300 mb-4 uppercase tracking-wider">Sobre</h4>
              <p className="text-sm text-gray-400">
                Plataforma profesional para organización de clubes de fútbol. Acceso inmediato sin costo.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-blue-300 mb-4 uppercase tracking-wider">Características</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>✓ Dos modalidades (Sala/Campo)</li>
                <li>✓ Estadísticas en tiempo real</li>
                <li>✓ Acceso por QR</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-blue-300 mb-4 uppercase tracking-wider">Información</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>📱 Completamente responsive</li>
                <li>⚡ Actualización instantánea</li>
                <li>🎯 Interfaz intuitiva</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-900/30 pt-8 text-center text-sm text-gray-500">
            <p>⚽ Football Club Organization • Versión 1.0 • Todos los derechos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
