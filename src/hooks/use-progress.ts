import { useAtomValue } from 'jotai'
import { activeProfileAtom } from '@/stores/profile-atoms'
import { averageScoreAtom, bestScoreAtom } from '@/stores/grading-atoms'
import { scoreTrendAtom, weeklyActivityAtom, operationBreakdownAtom } from '@/stores/progress-atoms'
import { profileWorksheetsAtom } from '@/stores/worksheet-atoms'
import { getLevel, getXpForNextLevel } from '@/lib/levels'

export function useProgress() {
  const profile = useAtomValue(activeProfileAtom)
  const averageScore = useAtomValue(averageScoreAtom)
  const bestScore = useAtomValue(bestScoreAtom)
  const scoreTrend = useAtomValue(scoreTrendAtom)
  const weeklyActivity = useAtomValue(weeklyActivityAtom)
  const operationBreakdown = useAtomValue(operationBreakdownAtom)
  const worksheets = useAtomValue(profileWorksheetsAtom)

  const xp = profile?.xp ?? 0
  const levelInfo = getLevel(xp)
  const xpProgress = getXpForNextLevel(xp)

  return {
    profile,
    xp,
    levelInfo,
    xpProgress,
    averageScore: averageScore ?? 0,
    bestScore: bestScore ?? 0,
    totalWorksheets: worksheets?.length ?? 0,
    scoreTrend: scoreTrend ?? [],
    weeklyActivity: weeklyActivity ?? [],
    operationBreakdown: operationBreakdown ?? [],
  }
}
