import { useAtom, useSetAtom } from 'jotai'
import { profilesDb } from '@/stores/db'
import { activeProfileIdAtom, allProfilesAtom } from '@/stores/profile-atoms'
import type { KidProfile } from '@/types'
import { generateId } from '@/lib/utils'

export function useProfiles() {
  const [entriesResult] = useAtom(allProfilesAtom)
  const setActiveProfileId = useSetAtom(activeProfileIdAtom)
  const setProfile = useSetAtom(profilesDb.set)
  const deleteProfileAtom = useSetAtom(profilesDb.delete)

  const profiles = (entriesResult ?? []).map(([, p]) => p).filter((p): p is KidProfile => p != null && !!p.name)

  const createProfile = async (name: string, avatarColor: string) => {
    const id = generateId()
    const profile: KidProfile = {
      id,
      name,
      avatarColor,
      createdAt: new Date().toISOString(),
      xp: 0,
      level: 1,
    }
    await setProfile(id, profile)
    return profile
  }

  const updateProfile = async (id: string, updates: Partial<KidProfile>) => {
    const entry = (entriesResult ?? []).find(([key]) => key === id)
    if (entry?.[1]) {
      await setProfile(id, { ...entry[1], ...updates })
    }
  }

  const deleteProfile = async (id: string) => {
    await deleteProfileAtom(id)
  }

  const setActiveProfile = (id: string | null) => {
    setActiveProfileId(id)
  }

  return { profiles, createProfile, updateProfile, deleteProfile, setActiveProfile }
}
