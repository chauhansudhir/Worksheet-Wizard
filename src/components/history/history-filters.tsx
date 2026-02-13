import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface HistoryFiltersProps {
  operationFilter: string
  onOperationChange: (value: string) => void
  onClear: () => void
}

const operations: { value: string; label: string }[] = [
  { value: 'all', label: 'All Operations' },
  { value: 'addition', label: 'Addition' },
  { value: 'subtraction', label: 'Subtraction' },
  { value: 'mixed', label: 'Mixed' },
  { value: 'multiplication', label: 'Multiplication' },
  { value: 'division', label: 'Division' },
  { value: 'fractions', label: 'Fractions' },
]

export function HistoryFilters({ operationFilter, onOperationChange, onClear }: HistoryFiltersProps) {
  return (
    <div className="flex items-center gap-3">
      <Select value={operationFilter} onValueChange={onOperationChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter by operation" />
        </SelectTrigger>
        <SelectContent>
          {operations.map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {operationFilter !== 'all' && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  )
}
