import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { OperationPicker } from './operation-picker'
import { DifficultySlider } from './difficulty-slider'
import type { WorksheetConfig, OperationType, ProblemLayout } from '@/types'
import { Sparkles, AlignHorizontalSpaceAround, AlignVerticalSpaceAround } from 'lucide-react'
import { cn } from '@/lib/utils'

const problemCounts = [5, 10, 15, 20, 25, 30]

interface ConfigFormProps {
  onSubmit: (config: WorksheetConfig) => void
}

export function ConfigForm({ onSubmit }: ConfigFormProps) {
  const [operationType, setOperationType] = useState<OperationType>('addition')
  const [maxDigits, setMaxDigits] = useState(2)
  const [difficulty, setDifficulty] = useState(3)
  const [problemCount, setProblemCount] = useState(10)
  const [layout, setLayout] = useState<ProblemLayout>('horizontal')

  const isFractions = operationType === 'fractions'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      operationType,
      maxDigits: isFractions ? 1 : maxDigits,
      difficulty,
      problemCount,
      layout,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Operation Type</Label>
        <OperationPicker value={operationType} onChange={setOperationType} />
      </div>

      {!isFractions && (
        <div className="space-y-2">
          <Label>Max Digits</Label>
          <Select value={String(maxDigits)} onValueChange={(v) => setMaxDigits(Number(v))}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((d) => (
                <SelectItem key={d} value={String(d)}>
                  {d} digit{d > 1 ? 's' : ''} (up to {Math.pow(10, d) - 1})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <DifficultySlider
        value={difficulty}
        onChange={setDifficulty}
        isFractions={isFractions}
      />

      <div className="space-y-2">
        <Label>Number of Problems</Label>
        <div className="flex flex-wrap gap-2">
          {problemCounts.map((count) => (
            <Button
              key={count}
              type="button"
              variant={problemCount === count ? 'default' : 'outline'}
              size="sm"
              onClick={() => setProblemCount(count)}
              className={cn(problemCount === count && 'shadow-sm')}
            >
              {count}
            </Button>
          ))}
        </div>
      </div>

      {!isFractions && (
        <div className="space-y-2">
          <Label>Problem Layout</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={layout === 'horizontal' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLayout('horizontal')}
              className="flex items-center gap-2"
            >
              <AlignHorizontalSpaceAround className="h-4 w-4" />
              Horizontal
            </Button>
            <Button
              type="button"
              variant={layout === 'vertical' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLayout('vertical')}
              className="flex items-center gap-2"
            >
              <AlignVerticalSpaceAround className="h-4 w-4" />
              Vertical
            </Button>
          </div>
        </div>
      )}

      {isFractions && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          <p className="font-medium mb-1">Visual Fraction Problems</p>
          <p>Problems will show circles, bars, and object sets with shaded parts. Kids identify the fraction represented by the shaded portion.</p>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full">
        <Sparkles className="h-4 w-4 mr-2" />
        Generate Worksheet
      </Button>
    </form>
  )
}
