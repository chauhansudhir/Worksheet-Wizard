import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'

const descriptions = [
  'Very Easy - Small numbers, no carrying',
  'Easy - Small numbers',
  'Easy+ - Getting started',
  'Medium - Some carrying/borrowing',
  'Medium+ - Regular carrying',
  'Moderate - Remainders possible',
  'Challenging - Larger numbers',
  'Hard - Complex problems',
  'Very Hard - Big numbers, all features',
  'Expert - Maximum challenge!',
]

const fractionDescriptions = [
  'Very Easy - Halves and thirds (2-3 parts)',
  'Easy - Up to fourths (2-4 parts)',
  'Easy+ - Up to sixths (2-6 parts)',
  'Medium - Up to eighths (2-8 parts)',
  'Medium+ - Up to tenths (2-10 parts)',
  'Moderate - Varied shapes (2-10 parts)',
  'Challenging - Up to twelfths (2-12 parts)',
  'Hard - Larger denominators (2-12 parts)',
  'Very Hard - All fraction types (2-12 parts)',
  'Expert - Maximum variety (2-12 parts)',
]

interface DifficultySliderProps {
  value: number
  onChange: (value: number) => void
  isFractions?: boolean
}

export function DifficultySlider({ value, onChange, isFractions }: DifficultySliderProps) {
  const descs = isFractions ? fractionDescriptions : descriptions

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Difficulty</Label>
        <span className="text-sm font-medium text-primary">{value} / 9</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v!)}
        min={0}
        max={9}
        step={1}
      />
      <p className="text-sm text-muted-foreground">{descs[value]}</p>
    </div>
  )
}
