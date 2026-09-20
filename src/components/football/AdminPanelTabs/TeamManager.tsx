'use client';

import { useState } from 'react';

interface Player {
  id: string;
  number: number;
  name: string;
  goals: number;
}

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

export default function TeamManager() {
  const [newTeamLetter, setNewTeamLetter] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);

  const handleAddTeam = () => {
    if (newTeamLetter.trim() && newTeamName.trim()) {
      const newTeam: Team = {
        id: Date.now().toString(),
        letter: newTeamLetter.toUpperCase(),
        name: newTeamName,
        players: [],
        maxPlayers: 6,
        wins: 0,
        losses: 0,
        draws: 0,
        goalsFor: 0,
        goalsAgainst: 0,
      };
      setTeams([...teams, newTeam]);
      setNewTeamLetter('');
      setNewTeamName('');
      alert('Equipo creado exitosamente');
    }
  };

  const handleAddPlayer = () => {
    if (selectedTeamId && newPlayerName.trim()) {
      const updatedTeams = teams.map((team) => {
        if (team.id === selectedTeamId && team.players.length < team.maxPlayers) {
          const newPlayer: Player = {
            id: Date.now().toString(),
            number: team.players.length + 1,
            name: newPlayerName,
            goals: 0,
          };
          return { ...team, players: [...team.players, newPlayer] };
        }
        return team;
      });
      setTeams(updatedTeams);
      setNewPlayerName('');
      alert('Jugador agregado al equipo');
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Team Section */}
      <div className="bg-white/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Crear Nuevo Equipo</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Letra del Equipo (A, B, C...)"
            value={newTeamLetter}
            onChange={(e) => setNewTeamLetter(e.target.value)}
            maxLength={1}
            className="w-full px-4 py-2 bg-slate-800 text-white border border-blue-500/30 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Nombre del Equipo"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 text-white border border-blue-500/30 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleAddTeam}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold transition"
          >
            ✅ Crear Equipo
          </button>
        </div>
      </div>

      {/* Add Player Section */}
      <div className="bg-white/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Agregar Jugador</h3>
        <div className="space-y-3">
          <select
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 text-white border border-blue-500/30 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">Selecciona un equipo</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.letter} - {team.name} ({team.players.length}/{team.maxPlayers})
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Nombre del Jugador"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 text-white border border-blue-500/30 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleAddPlayer}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold transition"
            disabled={!selectedTeamId}
          >
            ➕ Agregar Jugador
          </button>
        </div>
      </div>

      {/* Teams List */}
      <div className="bg-white/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Equipos Registrados</h3>
        <div className="space-y-3">
          {teams.length === 0 ? (
            <p className="text-blue-300">No hay equipos registrados aún</p>
          ) : (
            teams.map((team) => (
              <div
                key={team.id}
                className="bg-slate-800/50 border border-blue-500/20 rounded-lg p-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white">
                      Grupo {team.letter} - {team.name}
                    </p>
                    <p className="text-blue-300 text-sm">
                      {team.players.length} jugadores
                    </p>
                  </div>
                  <button className="bg-red-600/30 text-red-200 px-3 py-1 rounded text-sm hover:bg-red-600/50 transition">
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
