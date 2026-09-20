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
    <aside className="w-64 bg-slate-950 border-r border-blue-900/50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-blue-900/50">
        <div className="text-center">
          <div className="text-4xl mb-2">⚽</div>
          <h1 className="text-xl font-bold text-white">Football Club</h1>
          <p className="text-xs text-blue-300 mt-1">Organización Profesional</p>
        </div>
      </div>

      {/* Modality Selection */}
      <div className="p-6 border-b border-blue-900/50">
        <h2 className="text-sm font-semibold text-blue-300 uppercase mb-4">Modalidad</h2>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedModality('sala')}
            className={`w-full px-4 py-3 rounded-lg font-semibold transition ${
              selectedModality === 'sala'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-slate-800 text-blue-100 hover:bg-slate-700'
            }`}
          >
            🏠 Fútbol Sala
          </button>
          <button
            onClick={() => setSelectedModality('campo')}
            className={`w-full px-4 py-3 rounded-lg font-semibold transition ${
              selectedModality === 'campo'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-slate-800 text-blue-100 hover:bg-slate-700'
            }`}
          >
            🌾 Fútbol Campo
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 border-b border-blue-900/50">
        <h2 className="text-sm font-semibold text-blue-300 uppercase mb-4">Acciones</h2>
        <button className="w-full px-4 py-3 rounded-lg bg-slate-800 text-blue-100 hover:bg-slate-700 transition font-semibold mb-2">
          📊 Match Center
        </button>
        <button className="w-full px-4 py-3 rounded-lg bg-slate-800 text-blue-100 hover:bg-slate-700 transition font-semibold">
          🎯 Descargar QR
        </button>
      </div>

      {/* Admin Section */}
      <div className="p-6 border-b border-blue-900/50 flex-1">
        <h2 className="text-sm font-semibold text-blue-300 uppercase mb-4">Administrador</h2>
        {!isAuthenticated ? (
          <button
            onClick={() => setActiveModal('admin-login')}
            className="w-full px-4 py-3 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition font-semibold"
          >
            🔐 Login Admin
          </button>
        ) : (
          <button
            onClick={onLogout}
            className="w-full px-4 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-semibold"
          >
            🚪 Logout
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 text-center text-xs text-blue-400">
        <p>Club Football System v1.0</p>
        <p className="text-blue-500 mt-2">Escanea el QR para acceder</p>
      </div>
    </aside>
  );
}
