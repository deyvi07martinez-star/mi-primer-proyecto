'use client';

import { useState, useEffect } from 'react';
import TeamCard from './TeamCard';

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

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Equipos Registrados</h2>
        <p className="text-blue-200">Total de equipos: {teams.length}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
}
