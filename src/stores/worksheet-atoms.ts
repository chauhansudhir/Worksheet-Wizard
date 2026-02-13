import { atom } from 'jotai'
import { worksheetsDb } from './db'
import { activeProfileIdAtom } from './profile-atoms'
import type { Worksheet } from '@/types'

export const allWorksheetsAtom = worksheetsDb.entries

export const profileWorksheetsAtom = atom<Promise<Worksheet[]>>(async (get) => {
  const profileId = get(activeProfileIdAtom)
  if (!profileId) return []
  const entries = await get(allWorksheetsAtom)
  return entries
    .map(([, ws]) => ws)
    .filter((ws): ws is Worksheet => ws != null && ws.profileId === profileId)
    .map((ws) => ({
      ...ws,
      problems: Array.isArray(ws.problems) ? ws.problems : [],
      config: ws.config ?? { operationType: 'addition' as const, maxDigits: 2, difficulty: 0, problemCount: 10 },
      createdAt: ws.createdAt || new Date().toISOString(),
      title: ws.title || '',
    }))
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
})

export const recentWorksheetsAtom = atom<Promise<Worksheet[]>>(async (get) => {
  const worksheets = await get(profileWorksheetsAtom)
  return worksheets.slice(0, 5)
})
