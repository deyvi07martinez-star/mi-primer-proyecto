'use client';

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

interface TeamDetailsModalProps {
  team: Team;
  onClose: () => void;
}

export default function TeamDetailsModal({ team, onClose }: TeamDetailsModalProps) {
  const goalDifference = team.goalsFor - team.goalsAgainst;
  const points = team.wins * 3 + team.draws;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-blue-500/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Grupo {team.letter} - {team.name}
            </h2>
            <p className="text-blue-300 mt-1">{team.players.length} jugadores</p>
          </div>
          <button
            onClick={onClose}
            className="text-blue-300 hover:text-white text-3xl"
          >
            ✕
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 rounded-lg p-4 border border-blue-500/30">
            <p className="text-blue-300 text-xs uppercase font-bold mb-1">Puntos</p>
            <p className="text-3xl font-bold text-white">{points}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 border border-blue-500/30">
            <p className="text-blue-300 text-xs uppercase font-bold mb-1">Record</p>
            <p className="text-sm text-white font-bold">
              {team.wins}V {team.draws}E {team.losses}D
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 border border-blue-500/30">
            <p className="text-blue-300 text-xs uppercase font-bold mb-1">Goles</p>
            <p className="text-white font-bold">{team.goalsFor} - {team.goalsAgainst}</p>
          </div>
          <div className={`rounded-lg p-4 border ${
            goalDifference > 0
              ? 'bg-green-600/30 border-green-500'
              : goalDifference < 0
              ? 'bg-red-600/30 border-red-500'
              : 'bg-gray-600/30 border-gray-500'
          }`}>
            <p className="text-xs uppercase font-bold mb-1">Diferencia</p>
            <p className="text-2xl font-bold text-white">
              {goalDifference > 0 ? '+' : ''}{goalDifference}
            </p>
          </div>
        </div>

        {/* Players List */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Jugadores del Equipo</h3>
          <div className="space-y-3">
            {team.players.length === 0 ? (
              <p className="text-blue-300">No hay jugadores registrados</p>
            ) : (
              team.players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between bg-white/10 px-4 py-3 rounded-lg border border-white/10 hover:border-blue-400/30 transition"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                      {player.number}
                    </div>
                    <div>
                      <p className="text-white font-bold">{player.name}</p>
                      <p className="text-blue-400 text-sm">Dorsal #{player.number}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-blue-300 text-xs uppercase font-bold">Goles</p>
                    <p className="text-white text-2xl font-bold">{player.goals}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
