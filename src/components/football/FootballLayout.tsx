'use client';

import { useState } from 'react';
import Header from './Header';
import SidePanel from './SidePanel';
import TeamsView from './TeamsView';
import StatsPanel from './StatsPanel';

interface FootballLayoutProps {
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  isAuthenticated: boolean;
  onAdminAccess: (password: string) => void;
  onLogout: () => void;
}

export default function FootballLayout({
  activeModal,
  setActiveModal,
  isAuthenticated,
  onAdminAccess,
  onLogout,
}: FootballLayoutProps) {
  const [selectedModality, setSelectedModality] = useState<'sala' | 'campo'>('sala');
  const [activeTab, setActiveTab] = useState<'teams' | 'stats'>('teams');

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Sidebar */}
      <SidePanel
        selectedModality={selectedModality}
        setSelectedModality={setSelectedModality}
        isAuthenticated={isAuthenticated}
        setActiveModal={setActiveModal}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          selectedModality={selectedModality}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setActiveModal={setActiveModal}
          isAuthenticated={isAuthenticated}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {activeTab === 'teams' ? (
              <TeamsView modality={selectedModality} />
            ) : (
              <StatsPanel modality={selectedModality} />
            )}
          </div>
        </div>
      </div>

      {/* Admin Login Modal */}
      {activeModal === 'admin-login' && (
        <AdminLoginModal
          onClose={() => setActiveModal(null)}
          onSubmit={onAdminAccess}
        />
      )}
    </div>
  );
}

function AdminLoginModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (password: string) => void;
}) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
    setPassword('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-96">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Acceso Administrador</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa la contraseña"
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg mb-4 focus:outline-none focus:border-blue-600"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Ingresar
          </button>
        </form>
        <button
          onClick={onClose}
          className="w-full mt-3 bg-slate-200 text-slate-900 py-2 rounded-lg font-semibold hover:bg-slate-300 transition"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
