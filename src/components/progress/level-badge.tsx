import type { LevelInfo } from '@/lib/levels'
import { Badge } from '@/components/ui/badge'
import {
  Sprout, Compass, Lightbulb, Zap, Trophy,
  Wand2, Sword, Crown, Star, Rocket,
} from 'lucide-react'

const iconMap: Record<string, typeof Sprout> = {
  Sprout, Compass, Puzzle: Lightbulb, Zap, Trophy,
  Wand: Wand2, Sword, Crown, Star, Rocket,
}

interface LevelBadgeProps {
  levelInfo: LevelInfo
  className?: string
}

export function LevelBadge({ levelInfo, className }: LevelBadgeProps) {
  const Icon = iconMap[levelInfo.icon] ?? Star

  return (
    <Badge variant="secondary" className={`text-sm px-3 py-1 gap-1.5 ${className ?? ''}`}>
      <Icon className="h-4 w-4" />
      <span>Lv.{levelInfo.level}</span>
      <span className="font-normal text-muted-foreground">{levelInfo.title}</span>
    </Badge>
  )
}
