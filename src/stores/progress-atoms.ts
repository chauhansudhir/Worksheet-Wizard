import { atom } from 'jotai'
import { profileGradingAtom } from './grading-atoms'
import { profileWorksheetsAtom } from './worksheet-atoms'
import type { GradingResult, Worksheet } from '@/types'

export interface ScoreTrendPoint {
  date: string
  score: number
  worksheetTitle: string
}

export interface WeeklyActivity {
  week: string
  count: number
  avgScore: number
}

export interface OperationBreakdown {
  operation: string
  count: number
}

export const scoreTrendAtom = atom<Promise<ScoreTrendPoint[]>>(async (get) => {
  const grades = await get(profileGradingAtom)
  const worksheets = await get(profileWorksheetsAtom)

  const worksheetMap = new Map<string, Worksheet>()
  for (const ws of worksheets) {
    if (ws?.id) worksheetMap.set(ws.id, ws)
  }

  return grades
    .filter((g) => g?.gradedAt && g.percentage != null)
    .slice(0, 20)
    .reverse()
    .map((g: GradingResult) => ({
      date: new Date(g.gradedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: g.percentage ?? 0,
      worksheetTitle: worksheetMap.get(g.worksheetId)?.title ?? 'Worksheet',
    }))
})

export const weeklyActivityAtom = atom<Promise<WeeklyActivity[]>>(async (get) => {
  const grades = await get(profileGradingAtom)

  const weekMap = new Map<string, { count: number; totalScore: number }>()
  const now = new Date()

  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(now)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() - i * 7)
    const label = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    weekMap.set(label, { count: 0, totalScore: 0 })
  }

  for (const g of grades) {
    if (!g?.gradedAt) continue
    const date = new Date(g.gradedAt)
    const weekStart = new Date(date)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    const label = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const entry = weekMap.get(label)
    if (entry) {
      entry.count++
      entry.totalScore += g.percentage ?? 0
    }
  }

  return Array.from(weekMap.entries()).map(([week, data]) => ({
    week,
    count: data.count,
    avgScore: data.count > 0 ? Math.round(data.totalScore / data.count) : 0,
  }))
})

export const operationBreakdownAtom = atom<Promise<OperationBreakdown[]>>(async (get) => {
  const worksheets = await get(profileWorksheetsAtom)

  const counts = new Map<string, number>()
  for (const ws of worksheets) {
    const op = ws?.config?.operationType
    if (!op) continue
    counts.set(op, (counts.get(op) ?? 0) + 1)
  }

  return Array.from(counts.entries()).map(([operation, count]) => ({
    operation,
    count,
  }))
})
