import { Progress } from '@/components/ui/progress'

interface XpProgressBarProps {
  xpProgress: { current: number; next: number; progress: number }
  totalXp: number
}

export function XpProgressBar({ xpProgress, totalXp }: XpProgressBarProps) {
  return (
    <div className="space-y-1.5">
      <Progress value={xpProgress.progress} className="h-2" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{totalXp} XP total</span>
        <span>{xpProgress.current} / {xpProgress.next} XP to next level</span>
      </div>
    </div>
  )
}
