import type { KidProfile } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { getLevel } from '@/lib/levels'

interface ProfileCardProps {
  profile: KidProfile
  isActive: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}

export function ProfileCard({ profile, isActive, onSelect, onEdit, onDelete }: ProfileCardProps) {
  const levelInfo = getLevel(profile?.xp ?? 0)

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${isActive ? 'ring-2 ring-primary' : ''}`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-12 w-12 rounded-full flex items-center justify-center text-white text-lg font-bold"
              style={{ backgroundColor: profile?.avatarColor ?? '#6b7280' }}
            >
              {profile?.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <h3 className="font-semibold">{profile?.name ?? 'Unknown'}</h3>
              <p className="text-sm text-muted-foreground">
                Level {levelInfo.level} - {levelInfo.title}
              </p>
              <p className="text-xs text-muted-foreground">{profile?.xp ?? 0} XP</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => { e.stopPropagation(); onEdit() }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={(e) => { e.stopPropagation(); onDelete() }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {isActive && (
          <div className="mt-2 text-xs text-primary font-medium">Active Profile</div>
        )}
      </CardContent>
    </Card>
  )
}
