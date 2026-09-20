'use client';

interface SidePanelProps {
  selectedModality: 'sala' | 'campo';
  setSelectedModality: (modality: 'sala' | 'campo') => void;
  isAuthenticated: boolean;
  setActiveModal: (modal: string | null) => void;
  onLogout: () => void;
}

export default function SidePanel({
  selectedModality,
  setSelectedModality,
  isAuthenticated,
  setActiveModal,
  onLogout,
}: SidePanelProps) {
  return (
    <aside className="w-64 bg-black border-r border-blue-900/50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-blue-900/50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg mx-auto flex items-center justify-center text-4xl font-bold mb-3">
            ⚽
          </div>
          <h1 className="text-lg font-black bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">Football Club</h1>
          <p className="text-xs text-blue-300 mt-2 uppercase tracking-widest">Panel Control</p>
        </div>
      </div>

      {/* Modality Selection */}
      <div className="p-6 border-b border-blue-900/50">
        <h2 className="text-xs font-black text-blue-400 uppercase mb-4 tracking-widest">Modalidad</h2>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedModality('sala')}
            className={`w-full px-4 py-3 rounded-lg font-bold transition-all border ${
              selectedModality === 'sala'
                ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/50'
                : 'bg-white/5 text-blue-200 border-blue-500/30 hover:bg-white/10'
            }`}
          >
            🏠 Sala
          </button>
          <button
            onClick={() => setSelectedModality('campo')}
            className={`w-full px-4 py-3 rounded-lg font-bold transition-all border ${
              selectedModality === 'campo'
                ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/50'
                : 'bg-white/5 text-blue-200 border-blue-500/30 hover:bg-white/10'
            }`}
          >
            🌾 Campo
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 border-b border-blue-900/50">
        <h2 className="text-xs font-black text-blue-400 uppercase mb-4 tracking-widest">Acciones</h2>
        <button className="w-full px-4 py-3 rounded-lg bg-white/10 text-blue-200 hover:bg-white/20 transition font-bold mb-2 border border-blue-500/30 hover:border-blue-400">
          📊 Match
        </button>
        <a
          href="/football-public"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full px-4 py-3 rounded-lg bg-green-600/20 text-green-300 hover:bg-green-600/30 transition font-bold text-center border border-green-500/50 hover:border-green-400"
        >
          👁️ Pública
        </a>
      </div>

      {/* Admin Section */}
      <div className="p-6 border-b border-blue-900/50 flex-1">
        <h2 className="text-xs font-black text-blue-400 uppercase mb-4 tracking-widest">Seguridad</h2>
        {!isAuthenticated ? (
          <button
            onClick={() => setActiveModal('admin-login')}
            className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 transition font-bold border border-amber-500"
          >
            🔐 Login
          </button>
        ) : (
          <button
            onClick={onLogout}
            className="w-full px-4 py-3 rounded-lg bg-red-600/30 text-red-300 hover:bg-red-600/40 transition font-bold border border-red-500/50"
          >
            🚪 Logout
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 text-center text-xs text-blue-400 border-t border-blue-900/50">
        <p className="font-bold text-blue-300">Football v1.0</p>
        <p className="text-blue-500 text-xs mt-2">Sistema Profesional</p>
      </div>
    </aside>
  );
}
