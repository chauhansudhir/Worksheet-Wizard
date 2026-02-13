import type { WorksheetConfig } from '@/types'

export interface LevelInfo {
  level: number
  title: string
  icon: string
  xpRequired: number
}

export const LEVELS: LevelInfo[] = [
  { level: 1, title: 'Number Newbie', icon: 'Sprout', xpRequired: 0 },
  { level: 2, title: 'Math Explorer', icon: 'Compass', xpRequired: 100 },
  { level: 3, title: 'Problem Solver', icon: 'Puzzle', xpRequired: 300 },
  { level: 4, title: 'Addition Ace', icon: 'Zap', xpRequired: 600 },
  { level: 5, title: 'Calculation Champ', icon: 'Trophy', xpRequired: 1000 },
  { level: 6, title: 'Math Magician', icon: 'Wand', xpRequired: 1500 },
  { level: 7, title: 'Number Ninja', icon: 'Sword', xpRequired: 2200 },
  { level: 8, title: 'Math Master', icon: 'Crown', xpRequired: 3000 },
  { level: 9, title: 'Math Legend', icon: 'Star', xpRequired: 4000 },
  { level: 10, title: 'Math Genius', icon: 'Rocket', xpRequired: 5500 },
]

export function getLevel(xp: number): LevelInfo {
  let current = LEVELS[0]!
  for (const level of LEVELS) {
    if (xp >= level.xpRequired) {
      current = level
    } else {
      break
    }
  }
  return current
}

export function getXpForNextLevel(xp: number): { current: number; next: number; progress: number } {
  const currentLevel = getLevel(xp)
  const nextLevel = LEVELS.find((l) => l.xpRequired > xp)

  if (!nextLevel) {
    return { current: xp, next: xp, progress: 100 }
  }

  const xpIntoLevel = xp - currentLevel.xpRequired
  const xpNeeded = nextLevel.xpRequired - currentLevel.xpRequired
  const progress = Math.floor((xpIntoLevel / xpNeeded) * 100)

  return { current: xpIntoLevel, next: xpNeeded, progress }
}

export function calculateXpEarned(config: WorksheetConfig, percentage: number): number {
  return Math.floor((config.difficulty + 1) * config.problemCount * (percentage / 100))
}
