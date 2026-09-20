'use client';

import { useState, useEffect } from 'react';

interface StatsViewProps {
  modality: 'sala' | 'campo';
}

interface TopScorer {
  name: string;
  goals: number;
  teamLetter: string;
}

interface TopTeam {
  letter: string;
  name: string;
  wins: number;
  points: number;
}

export default function StatsPanel({ modality }: StatsViewProps) {
  const [topScorers, setTopScorers] = useState<TopScorer[]>([]);
  const [topTeams, setTopTeams] = useState<TopTeam[]>([]);

  useEffect(() => {
    // Load and calculate stats
    const storedTeams = localStorage.getItem(`teams_${modality}`);
    if (storedTeams) {
      const teams = JSON.parse(storedTeams);

      // Calculate top scorers
      const scorers: TopScorer[] = [];
      teams.forEach((team: any) => {
        team.players.forEach((player: any) => {
          scorers.push({
            name: player.name,
            goals: player.goals,
            teamLetter: team.letter,
          });
        });
      });
      const sortedScorers = scorers.sort((a, b) => b.goals - a.goals).slice(0, 10);
      setTopScorers(sortedScorers);

      // Calculate top teams
      const sortedTeams = [...teams]
        .map((team: any) => ({
          letter: team.letter,
          name: team.name,
          wins: team.wins,
          points: team.wins * 3 + team.draws,
        }))
        .sort((a: any, b: any) => b.points - a.points);
      setTopTeams(sortedTeams);
    }
  }, [modality]);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Estadísticas Generales</h2>
        <p className="text-blue-200">
          {modality === 'sala' ? 'Fútbol Sala' : 'Fútbol Campo'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Scorers */}
        <div className="bg-white/10 backdrop-blur-md border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <span className="text-2xl mr-2">🎯</span>
            Máximos Goleadores
          </h3>
          <div className="space-y-3">
            {topScorers.map((scorer, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white/10 px-4 py-3 rounded-lg border border-white/10 hover:border-blue-400/30 transition"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">{scorer.name}</p>
                    <p className="text-blue-300 text-sm">Equipo {scorer.teamLetter}</p>
                  </div>
                </div>
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                  {scorer.goals}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Teams */}
        <div className="bg-white/10 backdrop-blur-md border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <span className="text-2xl mr-2">🏆</span>
            Tabla de Posiciones
          </h3>
          <div className="space-y-3">
            {topTeams.map((team, index) => (
              <div
                key={team.letter}
                className="flex items-center justify-between bg-white/10 px-4 py-3 rounded-lg border border-white/10 hover:border-blue-400/30 transition"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">{team.name}</p>
                    <p className="text-blue-300 text-sm">Grupo {team.letter}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="text-center">
                    <p className="text-blue-300 text-xs uppercase">Victorias</p>
                    <p className="text-white font-bold text-lg">{team.wins}</p>
                  </div>
                  <div className="bg-amber-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                    {team.points} pts
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
