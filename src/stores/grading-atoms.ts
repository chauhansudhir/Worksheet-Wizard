import { atom } from 'jotai'
import { gradingDb } from './db'
import { activeProfileIdAtom } from './profile-atoms'
import type { GradingResult } from '@/types'

export const allGradingAtom = gradingDb.entries

export const profileGradingAtom = atom<Promise<GradingResult[]>>(async (get) => {
  const profileId = get(activeProfileIdAtom)
  if (!profileId) return []
  const entries = await get(allGradingAtom)
  return entries
    .map(([, g]) => g)
    .filter((g): g is GradingResult => g != null && g.profileId === profileId)
    .map((g) => (Array.isArray(g.answers) ? g : { ...g, answers: [] as GradingResult['answers'] }))
    .sort((a, b) => new Date(b.gradedAt ?? 0).getTime() - new Date(a.gradedAt ?? 0).getTime())
})

export const averageScoreAtom = atom<Promise<number>>(async (get) => {
  const grades = await get(profileGradingAtom)
  if (grades.length === 0) return 0
  const sum = grades.reduce((acc, g) => acc + (g.percentage ?? 0), 0)
  return Math.round(sum / grades.length)
})

export const bestScoreAtom = atom<Promise<number>>(async (get) => {
  const grades = await get(profileGradingAtom)
  if (grades.length === 0) return 0
  return Math.max(0, ...grades.map((g) => g.percentage ?? 0))
})
