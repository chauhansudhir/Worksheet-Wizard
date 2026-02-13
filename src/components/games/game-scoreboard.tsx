import { cn } from '@/lib/utils'

interface TeamScore {
  name: string
  score: number
  streak: number
  lastPower: number
}

interface GameScoreboardProps {
  team1: TeamScore
  team2: TeamScore
  currentTeam: 1 | 2
  round: number
  totalRounds: number
}

export function GameScoreboard({ team1, team2, currentTeam, round, totalRounds }: GameScoreboardProps) {
  return (
    <div className="space-y-3">
      <div className="text-center">
        <span className="text-sm font-medium text-muted-foreground">
          Round {round} of {totalRounds}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Team 1 */}
        <div
          className={cn(
            'rounded-xl border-2 p-4 text-center transition-all duration-300',
            currentTeam === 1
              ? 'border-blue-400 bg-blue-50 shadow-lg shadow-blue-100'
              : 'border-border bg-card'
          )}
        >
          <div className="text-sm font-medium text-blue-600 mb-1">{team1.name}</div>
          <div className="text-3xl font-bold text-blue-700">{team1.score}</div>
          {team1.streak >= 2 && (
            <div className="text-xs font-semibold text-amber-600 mt-1">
              {team1.streak >= 3 ? '2x' : '1.5x'} streak!
            </div>
          )}
          {team1.lastPower > 0 && (
            <div className="mt-2">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Last Power</div>
              <div className="text-sm font-bold text-blue-600">+{team1.lastPower}</div>
            </div>
          )}
        </div>

        {/* Team 2 */}
        <div
          className={cn(
            'rounded-xl border-2 p-4 text-center transition-all duration-300',
            currentTeam === 2
              ? 'border-red-400 bg-red-50 shadow-lg shadow-red-100'
              : 'border-border bg-card'
          )}
        >
          <div className="text-sm font-medium text-red-600 mb-1">{team2.name}</div>
          <div className="text-3xl font-bold text-red-700">{team2.score}</div>
          {team2.streak >= 2 && (
            <div className="text-xs font-semibold text-amber-600 mt-1">
              {team2.streak >= 3 ? '2x' : '1.5x'} streak!
            </div>
          )}
          {team2.lastPower > 0 && (
            <div className="mt-2">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Last Power</div>
              <div className="text-sm font-bold text-red-600">+{team2.lastPower}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
