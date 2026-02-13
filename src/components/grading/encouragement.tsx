import { getEncouragingMessage } from '@/lib/messages'
import { Badge } from '@/components/ui/badge'
import { Sparkles } from 'lucide-react'

interface EncouragementProps {
  percentage: number
  xpEarned: number
}

export function Encouragement({ percentage, xpEarned }: EncouragementProps) {
  const { message, color } = getEncouragingMessage(percentage)

  return (
    <div className="text-center space-y-3">
      <p className={`text-xl font-semibold ${color}`}>{message}</p>
      <Badge variant="secondary" className="text-sm px-3 py-1">
        <Sparkles className="h-3 w-3 mr-1" />
        +{xpEarned} XP earned!
      </Badge>
    </div>
  )
}
