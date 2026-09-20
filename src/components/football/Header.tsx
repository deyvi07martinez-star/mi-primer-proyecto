'use client';

interface HeaderProps {
  selectedModality: 'sala' | 'campo';
  activeTab: 'teams' | 'stats';
  setActiveTab: (tab: 'teams' | 'stats') => void;
  setActiveModal: (modal: string | null) => void;
  isAuthenticated: boolean;
}

export default function Header({
  selectedModality,
  activeTab,
  setActiveTab,
  setActiveModal,
  isAuthenticated,
}: HeaderProps) {
  return (
    <header className="bg-black/90 backdrop-blur-md border-b border-blue-900/50 px-8 py-6 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-2xl font-bold">
            ⚽
          </div>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
              Football Club
            </h1>
            <p className="text-xs text-blue-400 uppercase tracking-widest">
              {selectedModality === 'sala' ? 'Fútbol Sala' : 'Fútbol Campo'}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-6 py-2 rounded-lg font-bold transition-all border ${
              activeTab === 'teams'
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-white/5 text-blue-200 border-blue-500/30 hover:bg-white/10 hover:border-blue-400'
            }`}
          >
            👥 Equipos
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-2 rounded-lg font-bold transition-all border ${
              activeTab === 'stats'
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-white/5 text-blue-200 border-blue-500/30 hover:bg-white/10 hover:border-blue-400'
            }`}
          >
            📊 Estadísticas
          </button>
          {isAuthenticated && (
            <button
              onClick={() => setActiveModal('admin')}
              className="px-6 py-2 rounded-lg font-bold bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 transition border border-amber-500"
            >
              ⚙️ Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
