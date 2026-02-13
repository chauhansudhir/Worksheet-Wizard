import { useRef, useEffect } from 'react'
import type { MathProblem } from '@/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FractionDisplay } from '@/components/worksheet/fraction-display'
import { CircleFraction } from '@/components/worksheet/circle-fraction'
import { BarFraction } from '@/components/worksheet/bar-fraction'
import { SetFraction } from '@/components/worksheet/set-fraction'
import { Send } from 'lucide-react'

interface GameProblemProps {
  problem: MathProblem
  answer: string
  onAnswerChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
}

function LargeProblemDisplay({ problem }: { problem: MathProblem }) {
  if (problem.type === 'whole') {
    return <div className="font-mono text-4xl sm:text-5xl font-bold tracking-wider">{problem.displayString}</div>
  }
  if (problem.type === 'fraction') {
    return (
      <div className="flex items-center gap-4 text-3xl sm:text-4xl">
        <FractionDisplay fraction={problem.operand1} className="text-3xl sm:text-4xl font-bold" />
        <span className="font-bold">{problem.operator}</span>
        <FractionDisplay fraction={problem.operand2} className="text-3xl sm:text-4xl font-bold" />
        <span className="font-bold">=</span>
      </div>
    )
  }
  if (problem.type === 'visual-fraction') {
    return (
      <div className="space-y-3 flex flex-col items-center">
        <p className="text-lg font-medium text-muted-foreground">{problem.prompt}</p>
        {problem.visualType === 'circle' && (
          <CircleFraction totalParts={problem.totalParts} shadedParts={problem.shadedParts} size={140} />
        )}
        {problem.visualType === 'bar' && (
          <BarFraction totalParts={problem.totalParts} shadedParts={problem.shadedParts} width={200} height={50} />
        )}
        {problem.visualType === 'set' && (
          <SetFraction totalParts={problem.totalParts} shadedParts={problem.shadedParts} size={36} />
        )}
      </div>
    )
  }
  return null
}

export function GameProblem({ problem, answer, onAnswerChange, onSubmit, disabled }: GameProblemProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Auto-focus the input when problem changes
    const timeout = setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
    return () => clearTimeout(timeout)
  }, [problem.id])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <LargeProblemDisplay problem={problem} />

      <div className="flex items-center gap-3 w-full max-w-xs">
        <Input
          ref={inputRef}
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={problem.type === 'whole' ? 'Answer...' : 'e.g. 3/4'}
          className="text-center text-2xl font-mono h-14"
          disabled={disabled}
          autoComplete="off"
        />
        <Button
          size="lg"
          className="h-14 px-6"
          onClick={onSubmit}
          disabled={disabled}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
