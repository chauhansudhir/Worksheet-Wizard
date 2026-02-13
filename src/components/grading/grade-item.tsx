import { useState } from 'react'
import type { MathProblem } from '@/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Check, X, CircleCheck, CircleX } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FractionDisplay } from '@/components/worksheet/fraction-display'
import { CircleFraction } from '@/components/worksheet/circle-fraction'
import { BarFraction } from '@/components/worksheet/bar-fraction'
import { SetFraction } from '@/components/worksheet/set-fraction'

interface GradeItemProps {
  problem: MathProblem
  index: number
  userAnswer: string
  isCorrect: boolean | undefined
  onAnswerChange: (answer: string) => void
  onToggle: (correct: boolean) => void
}

export function getCorrectAnswerStr(problem: MathProblem): string {
  if (problem.type === 'whole') {
    let s = String(problem.answer)
    if (problem.remainder !== undefined) s += ` R${problem.remainder}`
    return s
  }
  if (problem.type === 'visual-fraction') {
    return problem.answerDisplayString
  }
  return problem.answerDisplayString
}

export function checkAnswer(problem: MathProblem, userAnswer: string): boolean {
  const trimmed = userAnswer.trim().toLowerCase()
  if (!trimmed) return false

  if (problem.type === 'whole') {
    const expected = String(problem.answer)
    if (trimmed === expected) return true
    if (problem.remainder !== undefined) {
      const withR = `${problem.answer} r${problem.remainder}`
      const withR2 = `${problem.answer}r${problem.remainder}`
      if (trimmed === withR || trimmed === withR2) return true
    }
    return false
  }

  if (problem.type === 'visual-fraction' || problem.type === 'fraction') {
    const answer = problem.answer
    // Accept "numerator/denominator" format
    const match = trimmed.match(/^(\d+)\s*\/\s*(\d+)$/)
    if (match) {
      const num = parseInt(match[1]!)
      const den = parseInt(match[2]!)
      // Check if equivalent fraction (cross multiply)
      return num * answer.denominator === den * answer.numerator
    }
    // Accept whole number if denominator is 1
    if (answer.denominator === 1 && trimmed === String(answer.numerator)) return true
    return false
  }

  return false
}

function ProblemDisplay({ problem }: { problem: MathProblem }) {
  if (problem.type === 'whole') {
    return <div className="font-mono text-lg">{problem.displayString}</div>
  }
  if (problem.type === 'fraction') {
    return (
      <div className="flex items-center gap-2">
        <FractionDisplay fraction={problem.operand1} />
        <span>{problem.operator}</span>
        <FractionDisplay fraction={problem.operand2} />
        <span>=</span>
      </div>
    )
  }
  if (problem.type === 'visual-fraction') {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{problem.prompt}</p>
        {problem.visualType === 'circle' && (
          <CircleFraction totalParts={problem.totalParts} shadedParts={problem.shadedParts} size={90} />
        )}
        {problem.visualType === 'bar' && (
          <BarFraction totalParts={problem.totalParts} shadedParts={problem.shadedParts} width={120} height={30} />
        )}
        {problem.visualType === 'set' && (
          <SetFraction totalParts={problem.totalParts} shadedParts={problem.shadedParts} size={22} />
        )}
      </div>
    )
  }
  return null
}

export function GradeItem({ problem, index, userAnswer, isCorrect, onAnswerChange, onToggle }: GradeItemProps) {
  const [showHint, setShowHint] = useState(false)

  const handleAnswerBlur = () => {
    if (userAnswer.trim()) {
      const correct = checkAnswer(problem, userAnswer)
      onToggle(correct)
    }
  }

  return (
    <div
      className={cn(
        'border-2 rounded-lg p-4 space-y-3 transition-colors relative',
        isCorrect === undefined && 'border-muted bg-card',
        isCorrect === true && 'bg-green-50 border-green-400',
        isCorrect === false && 'bg-purple-50 border-purple-400'
      )}
    >
      {/* Status indicator badge */}
      {isCorrect !== undefined && (
        <div className={cn(
          'absolute -top-2.5 -right-2.5 rounded-full p-0.5',
          isCorrect ? 'bg-green-500' : 'bg-purple-500'
        )}>
          {isCorrect ? (
            <Check className="h-4 w-4 text-white" />
          ) : (
            <X className="h-4 w-4 text-white" />
          )}
        </div>
      )}

      <div className="flex items-start gap-3">
        <span className={cn(
          'text-sm font-bold min-w-[1.5rem] mt-1',
          isCorrect === true && 'text-green-600',
          isCorrect === false && 'text-purple-600',
          isCorrect === undefined && 'text-muted-foreground'
        )}>{index + 1}.</span>
        <div className="flex-1">
          <ProblemDisplay problem={problem} />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-7">
        <Input
          value={userAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
          onBlur={handleAnswerBlur}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAnswerBlur() }}
          placeholder={problem.type === 'whole' ? 'Answer...' : 'e.g. 3/4'}
          className={cn(
            'w-32 text-center font-mono',
            isCorrect === true && 'border-green-400 bg-green-50',
            isCorrect === false && 'border-purple-400 bg-purple-50'
          )}
        />
        <div className="flex gap-1">
          <Button
            variant={isCorrect === true ? 'default' : 'outline'}
            size="icon"
            className={cn('h-8 w-8', isCorrect === true && 'bg-green-500 hover:bg-green-600')}
            onClick={() => onToggle(true)}
            title="Mark correct"
          >
            <CircleCheck className="h-4 w-4" />
          </Button>
          <Button
            variant={isCorrect === false ? 'default' : 'outline'}
            size="icon"
            className={cn('h-8 w-8', isCorrect === false && 'bg-purple-500 hover:bg-purple-600')}
            onClick={() => onToggle(false)}
            title="Mark incorrect"
          >
            <CircleX className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Feedback labels */}
      {isCorrect === true && (
        <p className="ml-7 text-sm font-semibold text-green-600 flex items-center gap-1">
          <Check className="h-3.5 w-3.5" /> Correct!
        </p>
      )}
      {isCorrect === false && (
        <div className="ml-7 space-y-1">
          <p className="text-sm font-semibold text-purple-600 flex items-center gap-1">
            <X className="h-3.5 w-3.5" /> Incorrect
          </p>
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-foreground underline"
            onClick={() => setShowHint(!showHint)}
          >
            {showHint ? 'hide answer' : 'show correct answer'}
          </button>
          {showHint && (
            <p className="text-sm text-muted-foreground">
              Answer: <span className="font-bold font-mono">{getCorrectAnswerStr(problem)}</span>
            </p>
          )}
        </div>
      )}
    </div>
  )
}

/** Read-only review item shown after grading is saved */
export function GradeResultItem({ problem, index, userAnswer, isCorrect }: {
  problem: MathProblem
  index: number
  userAnswer: string
  isCorrect: boolean
}) {
  return (
    <div
      className={cn(
        'border-2 rounded-lg p-4 space-y-2',
        isCorrect ? 'bg-green-50 border-green-400' : 'bg-purple-50 border-purple-400'
      )}
    >
      <div className="flex items-start gap-3">
        <span className={cn(
          'text-sm font-bold min-w-[1.5rem] mt-1',
          isCorrect ? 'text-green-600' : 'text-purple-600'
        )}>{index + 1}.</span>
        <div className="flex-1">
          <ProblemDisplay problem={problem} />
        </div>
        <div className={cn(
          'shrink-0 rounded-full p-1',
          isCorrect ? 'bg-green-500' : 'bg-purple-500'
        )}>
          {isCorrect ? (
            <Check className="h-4 w-4 text-white" />
          ) : (
            <X className="h-4 w-4 text-white" />
          )}
        </div>
      </div>

      <div className="ml-7 flex items-center gap-3 text-sm">
        {userAnswer && (
          <span className={cn(
            'font-mono px-2 py-0.5 rounded',
            isCorrect ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700 line-through'
          )}>
            {userAnswer}
          </span>
        )}
        {!isCorrect && (
          <span className="font-mono text-green-700 bg-green-100 px-2 py-0.5 rounded">
            {getCorrectAnswerStr(problem)}
          </span>
        )}
        <span className={cn(
          'text-xs font-semibold',
          isCorrect ? 'text-green-600' : 'text-purple-600'
        )}>
          {isCorrect ? 'Correct' : 'Incorrect'}
        </span>
      </div>
    </div>
  )
}
