import { AVATAR_COLORS } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface AvatarPickerProps {
  selected: string
  onSelect: (color: string) => void
}

export function AvatarPicker({ selected, onSelect }: AvatarPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {AVATAR_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onSelect(color)}
          className={cn(
            'h-10 w-10 rounded-full transition-all',
            selected === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-105'
          )}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  )
}
