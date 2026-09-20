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

interface TeamCardProps {
  team: Team;
  onViewDetails?: () => void;
}

export default function TeamCard({ team, onViewDetails }: TeamCardProps) {
  const goalDifference = team.goalsFor - team.goalsAgainst;
  const points = team.wins * 3 + team.draws;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-blue-500/30 rounded-xl overflow-hidden hover:border-blue-400/60 transition">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-5xl font-bold text-white">{team.letter}</div>
            <h3 className="text-lg font-bold text-white mt-1">{team.name}</h3>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-100">{points}</div>
            <p className="text-sm text-blue-200">Puntos</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-4 border-b border-blue-500/20 bg-white/5">
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-xs text-blue-300 uppercase">Record</p>
            <p className="text-white font-semibold">
              {team.wins}V - {team.draws}E - {team.losses}D
            </p>
          </div>
          <div>
            <p className="text-xs text-blue-300 uppercase">Goles</p>
            <p className="text-white font-semibold">
              {team.goalsFor} - {team.goalsAgainst}
            </p>
          </div>
        </div>
        <div>
          <p className="text-xs text-blue-300 uppercase mb-1">Diferencia</p>
          <div className="flex items-center">
            <div
              className={`inline-block px-3 py-1 rounded font-bold text-white ${
                goalDifference > 0
                  ? 'bg-green-600'
                  : goalDifference < 0
                  ? 'bg-red-600'
                  : 'bg-gray-600'
              }`}
            >
              {goalDifference > 0 ? '+' : ''}
              {goalDifference}
            </div>
          </div>
        </div>
      </div>

      {/* Players */}
      <div className="px-6 py-4">
        <h4 className="text-sm font-bold text-blue-300 uppercase mb-3">
          Jugadores ({team.players.length}/{team.maxPlayers})
        </h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {team.players.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between bg-white/10 px-3 py-2 rounded border border-white/10 hover:border-blue-400/30 transition"
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                  {player.number}
                </div>
                <span className="text-white text-sm font-semibold">{player.name}</span>
              </div>
              <div className="bg-amber-600/30 text-amber-200 px-2 py-1 rounded text-xs font-bold">
                {player.goals} goles
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action */}
      <div className="px-6 py-3 bg-white/5 border-t border-blue-500/20">
        <button
          onClick={onViewDetails}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition text-sm"
        >
          Ver Detalles
        </button>
      </div>
    </div>
  );
}
