import { useAtomValue, useSetAtom } from 'jotai'
import { worksheetsDb } from '@/stores/db'
import { profileWorksheetsAtom, allWorksheetsAtom } from '@/stores/worksheet-atoms'
import { activeProfileIdAtom } from '@/stores/profile-atoms'
import type { Worksheet, WorksheetConfig, MathProblem } from '@/types'
import { generateId, getOperationLabel } from '@/lib/utils'

export function useWorksheets() {
  const worksheets = useAtomValue(profileWorksheetsAtom)
  const allEntries = useAtomValue(allWorksheetsAtom)
  const profileId = useAtomValue(activeProfileIdAtom)
  const setWorksheet = useSetAtom(worksheetsDb.set)
  const deleteWorksheetAtom = useSetAtom(worksheetsDb.delete)

  const createWorksheet = async (config: WorksheetConfig, problems: MathProblem[]) => {
    if (!profileId) throw new Error('No active profile')
    const id = generateId()
    const worksheet: Worksheet = {
      id,
      profileId,
      config,
      problems,
      createdAt: new Date().toISOString(),
      title: `${getOperationLabel(config.operationType)} - ${config.problemCount} Problems`,
    }
    await setWorksheet(id, worksheet)
    return worksheet
  }

  const deleteWorksheet = async (id: string) => {
    await deleteWorksheetAtom(id)
  }

  const getWorksheet = (id: string): Worksheet | undefined => {
    const entry = (allEntries ?? []).find(([key]) => key === id)
    if (!entry?.[1]) return undefined
    const ws = entry[1]
    return {
      ...ws,
      problems: Array.isArray(ws.problems) ? ws.problems : [],
      config: ws.config ?? { operationType: 'addition' as const, maxDigits: 2, difficulty: 0, problemCount: 10 },
    }
  }

  return { worksheets, createWorksheet, deleteWorksheet, getWorksheet }
}
