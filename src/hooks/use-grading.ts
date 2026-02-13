import { useAtomValue, useSetAtom } from 'jotai'
import { gradingDb, profilesDb } from '@/stores/db'
import { profileGradingAtom, allGradingAtom } from '@/stores/grading-atoms'
import { activeProfileIdAtom, allProfilesAtom } from '@/stores/profile-atoms'
import type { GradingResult, AnswerEntry, WorksheetConfig } from '@/types'
import { calculateXpEarned, getLevel } from '@/lib/levels'

export function useGrading() {
  const grades = useAtomValue(profileGradingAtom)
  const allEntries = useAtomValue(allGradingAtom)
  const profileId = useAtomValue(activeProfileIdAtom)
  const allProfiles = useAtomValue(allProfilesAtom)
  const setGrade = useSetAtom(gradingDb.set)
  const deleteGradeAtom = useSetAtom(gradingDb.delete)
  const setProfile = useSetAtom(profilesDb.set)

  const saveGrade = async (
    worksheetId: string,
    answers: AnswerEntry[],
    config: WorksheetConfig
  ): Promise<{ result: GradingResult; xpEarned: number; leveledUp: boolean; newLevel: number }> => {
    if (!profileId) throw new Error('No active profile')

    const score = answers.filter((a) => a.isCorrect).length
    const percentage = answers.length > 0 ? Math.round((score / answers.length) * 100) : 0

    const result: GradingResult = {
      id: worksheetId,
      worksheetId,
      profileId,
      answers,
      score,
      totalProblems: answers.length,
      percentage,
      gradedAt: new Date().toISOString(),
    }

    await setGrade(worksheetId, result)

    // Calculate XP
    const xpEarned = calculateXpEarned(config, percentage)
    const profileEntry = (allProfiles ?? []).find(([key]) => key === profileId)

    let leveledUp = false
    let newLevel = 1

    if (profileEntry?.[1]?.name) {
      const profile = profileEntry[1]
      const oldLevel = profile.level
      const newXp = profile.xp + xpEarned

      const levelInfo = getLevel(newXp)
      newLevel = levelInfo.level
      leveledUp = newLevel > oldLevel

      await setProfile(profileId, {
        ...profile,
        xp: newXp,
        level: newLevel,
      })
    }

    return { result, xpEarned, leveledUp, newLevel }
  }

  const getGrade = (worksheetId: string): GradingResult | undefined => {
    const entry = (allEntries ?? []).find(([key]) => key === worksheetId)
    if (!entry?.[1]) return undefined
    // Normalize legacy grades that may lack the answers array
    const grade = entry[1]
    if (!Array.isArray(grade.answers)) {
      return { ...grade, answers: [] }
    }
    return grade
  }

  const deleteGrade = async (worksheetId: string) => {
    await deleteGradeAtom(worksheetId)
  }

  return { grades, saveGrade, getGrade, deleteGrade }
}
