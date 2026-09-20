'use client';

import { useState, useEffect } from 'react';
import FootballLayout from '@/components/football/FootballLayout';
import AdminPanel from '@/components/football/AdminPanel';
import MatchCenter from '@/components/football/MatchCenter';

type ModalType = string | null;

export default function FootballPage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const adminPassword = localStorage.getItem('footballAdminAuth');
    if (adminPassword) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAdminAccess = (password: string) => {
    if (password === 'admin123') {
      localStorage.setItem('footballAdminAuth', 'true');
      setIsAuthenticated(true);
      setActiveModal(null);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <FootballLayout
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        isAuthenticated={isAuthenticated}
        onAdminAccess={handleAdminAccess}
        onLogout={() => {
          localStorage.removeItem('footballAdminAuth');
          setIsAuthenticated(false);
        }}
      />

      {activeModal === 'admin' && isAuthenticated && (
        <AdminPanel onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'match' && (
        <MatchCenter onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}
