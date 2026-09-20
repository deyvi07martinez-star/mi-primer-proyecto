'use client';

import { useState, useEffect } from 'react';
import TeamCard from './TeamCard';
import TeamDetailsModal from './TeamDetailsModal';

interface Team {
  id: string;
  letter: string;
  name: string;
  players: Player[];
  maxPlayers: number;
  wins: number;
  losses: number;
  draws: number;
  goalsFor: number;
  goalsAgainst: number;
}

interface Player {
  id: string;
  number: number;
  name: string;
  goals: number;
}

interface TeamsViewProps {
  modality: 'sala' | 'campo';
}

export default function TeamsView({ modality }: TeamsViewProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  useEffect(() => {
    // Load teams from localStorage
    const storedTeams = localStorage.getItem(`teams_${modality}`);
    if (storedTeams) {
      setTeams(JSON.parse(storedTeams));
    } else {
      // Initialize with sample teams
      const sampleTeams: Team[] = [
        {
          id: '1',
          letter: 'A',
          name: 'Equipo Azul',
          players: [
            { id: '1', number: 1, name: 'Juan García', goals: 5 },
            { id: '2', number: 2, name: 'Carlos López', goals: 3 },
            { id: '3', number: 3, name: 'Manuel Pérez', goals: 2 },
            { id: '4', number: 4, name: 'Antonio Martín', goals: 4 },
          ],
          maxPlayers: 6,
          wins: 3,
          losses: 1,
          draws: 1,
          goalsFor: 14,
          goalsAgainst: 8,
        },
        {
          id: '2',
          letter: 'B',
          name: 'Equipo Rojo',
          players: [
            { id: '5', number: 1, name: 'David Fernández', goals: 6 },
            { id: '6', number: 2, name: 'Roberto Jiménez', goals: 2 },
            { id: '7', number: 3, name: 'Francisco Rivera', goals: 1 },
            { id: '8', number: 4, name: 'Miguel Ángel Ruiz', goals: 3 },
          ],
          maxPlayers: 6,
          wins: 2,
          losses: 2,
          draws: 1,
          goalsFor: 12,
          goalsAgainst: 10,
        },
        {
          id: '3',
          letter: 'C',
          name: 'Equipo Verde',
          players: [
            { id: '9', number: 1, name: 'Javier Sánchez', goals: 4 },
            { id: '10', number: 2, name: 'Luis González', goals: 2 },
            { id: '11', number: 3, name: 'Pedro Martínez', goals: 3 },
            { id: '12', number: 4, name: 'Sergio Castro', goals: 1 },
          ],
          maxPlayers: 6,
          wins: 1,
          losses: 3,
          draws: 1,
          goalsFor: 10,
          goalsAgainst: 12,
        },
      ];
      setTeams(sampleTeams);
      localStorage.setItem(`teams_${modality}`, JSON.stringify(sampleTeams));
    }
    setIsLoading(false);
  }, [modality]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-xl">Cargando equipos...</div>
      </div>
    );
  }

  // Group teams by letter
  const groupedTeams = teams.reduce((acc, team) => {
    if (!acc[team.letter]) {
      acc[team.letter] = [];
    }
    acc[team.letter].push(team);
    return acc;
  }, {} as Record<string, Team[]>);

  const sortedLetters = Object.keys(groupedTeams).sort();

  return (
    <div>
      <div className="mb-12">
        <h2 className="text-3xl font-black text-white mb-2">Equipos Registrados</h2>
        <p className="text-blue-200 text-lg">Total de equipos: {teams.length}</p>
      </div>

      <div className="space-y-10">
        {sortedLetters.map((letter) => (
          <div key={letter} className="space-y-4">
            {/* Letter Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-4xl font-black text-white">{letter}</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Grupo {letter}</h3>
                <p className="text-blue-200 text-sm">{groupedTeams[letter].length} equipo(s)</p>
              </div>
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pl-0">
              {groupedTeams[letter].map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onViewDetails={() => setSelectedTeam(team)}
                />
              ))}
            </div>

            {/* Divider */}
            {letter !== sortedLetters[sortedLetters.length - 1] && (
              <div className="border-t border-blue-900/30 mt-8"></div>
            )}
          </div>
        ))}
      </div>

      {selectedTeam && (
        <TeamDetailsModal
          team={selectedTeam}
          onClose={() => setSelectedTeam(null)}
        />
      )}
    </div>
  );
}
