import { Suspense, useState } from 'react'
import { useAtomValue } from 'jotai'
import { activeProfileIdAtom } from '@/stores/profile-atoms'
import { useProfiles } from '@/hooks/use-profiles'
import { PageHeader } from '@/components/layout/page-header'
import { ProfileCard } from '@/components/profile/profile-card'
import { ProfileForm } from '@/components/profile/profile-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { PlusCircle, Users } from 'lucide-react'
import type { KidProfile } from '@/types'

function ProfilesContent() {
  const { profiles, createProfile, updateProfile, deleteProfile, setActiveProfile } = useProfiles()
  const activeProfileId = useAtomValue(activeProfileIdAtom)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState<KidProfile | null>(null)
  const [deletingProfile, setDeletingProfile] = useState<KidProfile | null>(null)

  const handleCreate = async (name: string, color: string) => {
    const profile = await createProfile(name, color)
    if (profiles.length === 0) {
      setActiveProfile(profile.id)
    }
    setDialogOpen(false)
  }

  const handleEdit = async (name: string, color: string) => {
    if (editingProfile) {
      await updateProfile(editingProfile.id, { name, avatarColor: color })
      setEditingProfile(null)
    }
  }

  const handleDelete = async () => {
    if (deletingProfile) {
      await deleteProfile(deletingProfile.id)
      if (activeProfileId === deletingProfile.id) {
        const remaining = profiles.filter((p) => p.id !== deletingProfile.id)
        setActiveProfile(remaining[0]?.id ?? null)
      }
      setDeletingProfile(null)
    }
  }

  return (
    <div>
      <PageHeader
        title="Manage Profiles"
        description="Create profiles for each kid to track their progress separately."
        action={
          <Button onClick={() => setDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Profile
          </Button>
        }
      />

      {profiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No profiles yet</h3>
          <p className="text-muted-foreground mt-1 mb-4">Create a profile to get started!</p>
          <Button onClick={() => setDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create First Profile
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              isActive={activeProfileId === profile.id}
              onSelect={() => setActiveProfile(profile.id)}
              onEdit={() => setEditingProfile(profile)}
              onDelete={() => setDeletingProfile(profile)}
            />
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Profile</DialogTitle>
          </DialogHeader>
          <ProfileForm onSubmit={handleCreate} onCancel={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingProfile} onOpenChange={(open) => !open && setEditingProfile(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          {editingProfile && (
            <ProfileForm
              initialName={editingProfile.name}
              initialColor={editingProfile.avatarColor}
              onSubmit={handleEdit}
              onCancel={() => setEditingProfile(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingProfile} onOpenChange={(open) => !open && setDeletingProfile(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Profile</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingProfile?.name}'s profile? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function ProfilesPage() {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading profiles...</div>}>
      <ProfilesContent />
    </Suspense>
  )
}
