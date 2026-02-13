import { MiniDb } from 'jotai-minidb'
import type { KidProfile, Worksheet, GradingResult } from '@/types'

export const profilesDb = new MiniDb<KidProfile>({ name: 'profiles' })
export const worksheetsDb = new MiniDb<Worksheet>({ name: 'worksheets' })
export const gradingDb = new MiniDb<GradingResult>({ name: 'grading' })
