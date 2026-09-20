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
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            ⚽ Club de Fútbol
          </h1>
          <p className="text-blue-200">
            {selectedModality === 'sala' ? 'Fútbol Sala' : 'Fútbol Campo'}
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'teams'
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-blue-100 hover:bg-white/20'
            }`}
          >
            Equipos
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'stats'
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-blue-100 hover:bg-white/20'
            }`}
          >
            Estadísticas
          </button>
          {isAuthenticated && (
            <button
              onClick={() => setActiveModal('admin')}
              className="px-6 py-2 rounded-lg font-semibold bg-amber-600 text-white hover:bg-amber-700 transition"
            >
              ⚙️ Panel Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
