'use client';

import { useState, useEffect } from 'react';

interface MatchCenterProps {
  onClose: () => void;
}

export default function MatchCenter({ onClose }: MatchCenterProps) {
  const [team1, setTeam1] = useState('Equipo A');
  const [team2, setTeam2] = useState('Equipo B');
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutos
  const [isRunning, setIsRunning] = useState(false);
  const [isHalftime, setIsHalftime] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (!isHalftime) {
              setIsHalftime(true);
              return 600; // 10 minutos de descanso
            } else {
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isHalftime]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleReset = () => {
    setTimeLeft(1200);
    setScore1(0);
    setScore2(0);
    setIsRunning(false);
    setIsHalftime(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-blue-500/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">⚽ Match Center</h2>
          <button
            onClick={onClose}
            className="text-blue-300 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Status */}
        {isHalftime && (
          <div className="bg-amber-600/30 border border-amber-500 text-amber-200 p-4 rounded-lg mb-6 text-center font-bold">
            ⏸️ DESCANSO (Medio Tiempo)
          </div>
        )}

        {/* Score Display */}
        <div className="bg-gradient-to-r from-blue-600/30 to-slate-700/30 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Team 1 */}
            <div className="text-center">
              <p className="text-blue-200 text-sm uppercase font-bold mb-2">
                {team1}
              </p>
              <div className="text-5xl font-bold text-white">{score1}</div>
            </div>

            {/* Timer */}
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-300 font-mono">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              <p className="text-blue-200 text-xs mt-2 uppercase">
                {isHalftime ? 'Descanso' : 'En Juego'}
              </p>
            </div>

            {/* Team 2 */}
            <div className="text-center">
              <p className="text-blue-200 text-sm uppercase font-bold mb-2">
                {team2}
              </p>
              <div className="text-5xl font-bold text-white">{score2}</div>
            </div>
          </div>
        </div>

        {/* Score Controls */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-blue-300 font-bold mb-3">{team1}</h3>
            <button
              onClick={() => setScore1(score1 + 1)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-lg transition"
            >
              ⭐ +1 Gol
            </button>
          </div>
          <div>
            <h3 className="text-blue-300 font-bold mb-3">{team2}</h3>
            <button
              onClick={() => setScore2(score2 + 1)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-lg transition"
            >
              ⭐ +1 Gol
            </button>
          </div>
        </div>

        {/* Undo Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setScore1(Math.max(0, score1 - 1))}
            className="bg-red-600/30 hover:bg-red-600/50 text-red-200 py-2 rounded-lg font-semibold transition border border-red-500/50"
          >
            ↩️ Deshacer Gol
          </button>
          <button
            onClick={() => setScore2(Math.max(0, score2 - 1))}
            className="bg-red-600/30 hover:bg-red-600/50 text-red-200 py-2 rounded-lg font-semibold transition border border-red-500/50"
          >
            ↩️ Deshacer Gol
          </button>
        </div>

        {/* Controls */}
        <div className="space-y-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`w-full py-3 rounded-lg font-bold text-white transition ${
              isRunning
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isRunning ? '⏸️ Pausar' : '▶️ Iniciar'}
          </button>
          <button
            onClick={handleReset}
            className="w-full bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-lg font-bold transition"
          >
            🔄 Reiniciar Partido
          </button>
        </div>

        {/* Result Section */}
        {timeLeft === 0 && !isRunning && (
          <div className="mt-6 bg-green-600/30 border border-green-500 rounded-lg p-4">
            <h3 className="text-green-200 font-bold mb-3">🏆 Resultado Final</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className={`text-center p-3 rounded ${score1 > score2 ? 'bg-green-500/30 border border-green-500' : 'bg-slate-700'}`}>
                <p className="text-green-200 font-bold">{team1}</p>
                <p className="text-2xl font-bold text-white">{score1}</p>
              </div>
              <div className={`text-center p-3 rounded ${score2 > score1 ? 'bg-green-500/30 border border-green-500' : 'bg-slate-700'}`}>
                <p className="text-green-200 font-bold">{team2}</p>
                <p className="text-2xl font-bold text-white">{score2}</p>
              </div>
            </div>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold transition">
              ✅ Registrar Resultado
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
