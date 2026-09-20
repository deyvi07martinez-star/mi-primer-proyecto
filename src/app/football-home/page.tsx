'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function FootballHomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden">
      <style>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.8);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-slide-down {
          animation: slideInDown 0.8s ease-out forwards;
        }

        .animate-slide-up {
          animation: slideInUp 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>

      {/* Video background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-float" style={{ animation: 'float 6s ease-in-out infinite' }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-800 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-blue-900/50 bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className={`flex items-center gap-4 ${isLoaded ? 'animate-slide-down' : 'opacity-0'}`}>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-2xl font-bold">
              ⚽
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                FOOTBALL CLUB
              </h1>
              <p className="text-xs text-blue-400 uppercase tracking-widest">Organización Profesional</p>
            </div>
          </div>
          <nav className={`hidden md:flex gap-8 ${isLoaded ? 'animate-slide-down' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            <a href="#features" className="text-sm uppercase tracking-wider hover:text-blue-400 transition">Características</a>
            <a href="#access" className="text-sm uppercase tracking-wider hover:text-blue-400 transition">Acceso</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Animated Ball */}
          <div className={`mb-12 ${isLoaded ? 'animate-slide-down' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-6xl animate-pulse-glow">
              ⚽
            </div>
          </div>

          {/* Main Title */}
          <div className={`mb-8 ${isLoaded ? 'animate-slide-down' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            <h2 className="text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent leading-tight">
              Sistema de Organización
            </h2>
            <p className="text-2xl md:text-3xl text-blue-300 font-bold">para tu Club de Fútbol</p>
          </div>

          {/* Subtitle */}
          <div className={`mb-12 ${isLoaded ? 'animate-slide-down' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Gestiona equipos, jugadores y partidos en vivo.
              <span className="text-blue-400 font-bold"> Acceso inmediato por QR</span>,
              completamente gratis.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center mb-16 ${isLoaded ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
            <Link
              href="/football"
              className="group relative px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 border-2 border-blue-500"
            >
              <span className="text-xl">🔐</span>
              <span>Panel Administrador</span>
              <div className="absolute inset-0 bg-blue-400 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </Link>
            <Link
              href="/football-public"
              className="group relative px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 border-2 border-blue-400"
            >
              <span className="text-xl">👁️</span>
              <span>Ver Plataforma</span>
              <div className="absolute inset-0 bg-blue-400 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </Link>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-3 gap-4 max-w-2xl mx-auto ${isLoaded ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
            <div className="bg-white/5 backdrop-blur border border-blue-500/30 rounded-lg p-6 hover:border-blue-400/60 transition hover:bg-white/10">
              <div className="text-3xl font-black text-blue-400 mb-2">∞</div>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Equipos</p>
            </div>
            <div className="bg-white/5 backdrop-blur border border-blue-500/30 rounded-lg p-6 hover:border-blue-400/60 transition hover:bg-white/10">
              <div className="text-3xl font-black text-blue-400 mb-2">📊</div>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Estadísticas</p>
            </div>
            <div className="bg-white/5 backdrop-blur border border-blue-500/30 rounded-lg p-6 hover:border-blue-400/60 transition hover:bg-white/10">
              <div className="text-3xl font-black text-blue-400 mb-2">⚡</div>
              <p className="text-sm text-gray-400 uppercase tracking-wider">En Vivo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 bg-gradient-to-b from-transparent via-blue-900/10 to-black px-8 py-20 border-t border-blue-900/50">
        <div className="max-w-7xl mx-auto">
          <h3 className={`text-4xl font-black text-center mb-16 ${isLoaded ? 'animate-slide-down' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
            Características <span className="text-blue-400">Principales</span>
          </h3>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              { icon: '👥', title: 'Equipos y Jugadores', desc: 'Crea y gestiona múltiples equipos con todos sus jugadores' },
              { icon: '⏱️', title: 'Match Center', desc: 'Contador en tiempo real con registro de goles automático' },
              { icon: '🏆', title: 'Tabla de Posiciones', desc: 'Actualización instantánea de puntos y clasificación' },
              { icon: '📱', title: 'Acceso por QR', desc: 'Código descargable e imprimible para tu club' },
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`bg-white/5 backdrop-blur border border-blue-500/30 rounded-xl p-8 hover:border-blue-400/60 hover:bg-white/10 transition-all group ${isLoaded ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: `${0.7 + idx * 0.1}s` }}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h4 className="text-xl font-bold mb-3 text-blue-200">{feature.title}</h4>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Access Section */}
      <div id="access" className="relative z-10 bg-gradient-to-b from-black via-blue-900/5 to-black px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className={`bg-gradient-to-br from-blue-600/20 to-blue-900/20 backdrop-blur border border-blue-500/50 rounded-2xl p-12 ${isLoaded ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '1.1s' }}>
            <h3 className="text-3xl font-black mb-8 text-center">
              ¿Cómo <span className="text-blue-400">Acceder?</span>
            </h3>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                  <div>
                    <h4 className="font-bold text-blue-200 mb-1">Usuarios</h4>
                    <p className="text-gray-400">Escanea el código QR con tu teléfono</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                  <div>
                    <h4 className="font-bold text-blue-200 mb-1">Acceso Inmediato</h4>
                    <p className="text-gray-400">Sin contraseña, completamente gratis</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 font-bold">3</div>
                  <div>
                    <h4 className="font-bold text-blue-200 mb-1">Estadísticas en Vivo</h4>
                    <p className="text-gray-400">Ve equipos, goles y posiciones actualizado</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 font-bold">A</div>
                  <div>
                    <h4 className="font-bold text-blue-200 mb-1">Administrador</h4>
                    <p className="text-gray-400">Contraseña: <span className="font-mono text-blue-300">admin123</span></p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 font-bold">B</div>
                  <div>
                    <h4 className="font-bold text-blue-200 mb-1">Control Total</h4>
                    <p className="text-gray-400">Crea equipos, gestiona jugadores, configura todo</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 font-bold">C</div>
                  <div>
                    <h4 className="font-bold text-blue-200 mb-1">Genera QR</h4>
                    <p className="text-gray-400">Descarga e imprime el código para tu club</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-blue-900/50 bg-black/80 backdrop-blur px-8 py-12 mt-auto">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p className="font-bold text-white mb-2">⚽ Football Club Organization System</p>
          <p className="text-sm">Diseño profesional • Azul • Blanco • Negro • Completamente Funcional</p>
          <p className="text-xs text-gray-600 mt-4">Versión 1.0 • Servidor corriendo en localhost:3000</p>
        </div>
      </footer>
    </div>
  );
}
