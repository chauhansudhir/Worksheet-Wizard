import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { profilesDb } from './db'
import type { KidProfile } from '@/types'

export const activeProfileIdAtom = atomWithStorage<string | null>('activeProfileId', null)

export const allProfilesAtom = profilesDb.entries

export const activeProfileAtom = atom<Promise<KidProfile | null>>(async (get) => {
  const id = get(activeProfileIdAtom)
  if (!id) return null
  const entries = await get(allProfilesAtom)
  const entry = entries.find(([key]) => key === id)
  return entry?.[1] ?? null
})
