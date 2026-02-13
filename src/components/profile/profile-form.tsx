import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AvatarPicker } from './avatar-picker'
import { AVATAR_COLORS } from '@/lib/utils'

interface ProfileFormProps {
  initialName?: string
  initialColor?: string
  onSubmit: (name: string, color: string) => void
  onCancel: () => void
}

export function ProfileForm({ initialName = '', initialColor, onSubmit, onCancel }: ProfileFormProps) {
  const [name, setName] = useState(initialName)
  const [color, setColor] = useState(initialColor ?? AVATAR_COLORS[0]!)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim(), color)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          autoFocus
        />
      </div>
      <div className="space-y-2">
        <Label>Avatar Color</Label>
        <AvatarPicker selected={color} onSelect={setColor} />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!name.trim()}>
          Save
        </Button>
      </div>
    </form>
  )
}
