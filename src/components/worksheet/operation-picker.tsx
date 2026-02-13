import { Plus, Minus, Shuffle, X, Divide, PieChart } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { OperationType } from '@/types'

const operations: { value: OperationType; label: string; icon: typeof Plus }[] = [
  { value: 'addition', label: 'Addition', icon: Plus },
  { value: 'subtraction', label: 'Subtraction', icon: Minus },
  { value: 'mixed', label: 'Mixed (+/-)', icon: Shuffle },
  { value: 'multiplication', label: 'Multiplication', icon: X },
  { value: 'division', label: 'Division', icon: Divide },
  { value: 'fractions', label: 'Fractions', icon: PieChart },
]

interface OperationPickerProps {
  value: OperationType
  onChange: (value: OperationType) => void
}

export function OperationPicker({ value, onChange }: OperationPickerProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {operations.map((op) => (
        <button
          key={op.value}
          type="button"
          onClick={() => onChange(op.value)}
          className={cn(
            'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all',
            value === op.value
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-border hover:border-primary/50 text-muted-foreground'
          )}
        >
          <op.icon className="h-6 w-6" />
          <span className="text-sm font-medium">{op.label}</span>
        </button>
      ))}
    </div>
  )
}
