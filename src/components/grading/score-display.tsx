import { getScoreColor, getScoreBgColor } from '@/lib/messages'

interface ScoreDisplayProps {
  score: number
  total: number
  percentage: number
}

export function ScoreDisplay({ score, total, percentage }: ScoreDisplayProps) {
  return (
    <div className={`rounded-xl p-6 text-center ${getScoreBgColor(percentage)}`}>
      <div className={`text-5xl font-bold ${getScoreColor(percentage)}`}>
        {percentage}%
      </div>
      <p className="text-lg text-muted-foreground mt-2">
        {score} out of {total} correct
      </p>
    </div>
  )
}
