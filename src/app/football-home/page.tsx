'use client';

import Link from 'next/link';

export default function FootballHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-white text-2xl font-bold">⚽ Club de Fútbol</p>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          {/* Logo */}
          <div className="text-8xl mb-6">⚽</div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Sistema de Organización
          </h1>
          <p className="text-2xl text-blue-200 mb-8">
            Club de Fútbol Profesional
          </p>

          {/* Description */}
          <p className="text-lg text-blue-300 mb-12 leading-relaxed">
            Gestiona tus equipos, jugadores y partidos de forma profesional.
            Acceso inmediato mediante código QR, sin costo adicional.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 border border-blue-500/30 rounded-lg p-6 hover:border-blue-400/60 transition">
              <p className="text-3xl mb-2">👥</p>
              <h3 className="text-xl font-bold text-white mb-2">Equipos</h3>
              <p className="text-blue-300 text-sm">
                Organiza múltiples equipos con jugadores y estadísticas
              </p>
            </div>

            <div className="bg-white/10 border border-blue-500/30 rounded-lg p-6 hover:border-blue-400/60 transition">
              <p className="text-3xl mb-2">⏱️</p>
              <h3 className="text-xl font-bold text-white mb-2">Match Center</h3>
              <p className="text-blue-300 text-sm">
                Controla partidos en vivo con contador y registro de goles
              </p>
            </div>

            <div className="bg-white/10 border border-blue-500/30 rounded-lg p-6 hover:border-blue-400/60 transition">
              <p className="text-3xl mb-2">📊</p>
              <h3 className="text-xl font-bold text-white mb-2">Estadísticas</h3>
              <p className="text-blue-300 text-sm">
                Seguimiento automático de goles, puntos y clasificaciones
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/football"
              className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition text-lg"
            >
              🔐 Panel Administrador
            </Link>
            <Link
              href="/football-public"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition text-lg"
            >
              👁️ Ver Plataforma Pública
            </Link>
          </div>

          {/* Info */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 max-w-2xl">
            <h3 className="text-white font-bold mb-4">📱 ¿Cómo Acceder?</h3>
            <div className="space-y-2 text-blue-100 text-sm">
              <p>✓ <strong>Usuarios Normales</strong>: Escanea el código QR con tu teléfono</p>
              <p>✓ <strong>Administradores</strong>: Accede al panel con contraseña</p>
              <p>✓ <strong>Acceso Gratuito</strong>: Sin costo, solo escanear el QR</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="bg-white/5 border-t border-white/10 px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Características Principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="text-2xl">🎯</div>
                <div>
                  <h4 className="font-bold text-white">Dos Modalidades</h4>
                  <p className="text-blue-300 text-sm">Fútbol Sala y Campo con configuraciones independientes</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl">📝</div>
                <div>
                  <h4 className="font-bold text-white">Gestión Completa</h4>
                  <p className="text-blue-300 text-sm">Crear equipos, agregar jugadores, asignar números</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl">🏆</div>
                <div>
                  <h4 className="font-bold text-white">Tabla de Posiciones</h4>
                  <p className="text-blue-300 text-sm">Actualización automática de puntos y clasificaciones</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="text-2xl">⏱️</div>
                <div>
                  <h4 className="font-bold text-white">Contador de Tiempo</h4>
                  <p className="text-blue-300 text-sm">20 minutos + 10 minutos de descanso (configurable)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl">🎯</div>
                <div>
                  <h4 className="font-bold text-white">Registro de Goles</h4>
                  <p className="text-blue-300 text-sm">Máximos goleadores y estadísticas por jugador</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl">📱</div>
                <div>
                  <h4 className="font-bold text-white">Acceso por QR</h4>
                  <p className="text-blue-300 text-sm">Código descargable para imprimir en el club</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/10 px-8 py-6">
        <div className="max-w-7xl mx-auto text-center text-blue-300 text-sm">
          <p>⚽ Sistema Profesional de Organización de Club de Fútbol</p>
          <p className="text-blue-400 text-xs mt-2">Versión 1.0 • Acceso Gratuito para Miembros del Club</p>
        </div>
      </footer>
    </div>
  );
}
