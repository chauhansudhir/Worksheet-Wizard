import { useState } from 'react'
import type { MathProblem, AnswerEntry } from '@/types'
import { GradeItem } from './grade-item'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'

interface AnswerState {
  userAnswer: string
  isCorrect: boolean | undefined
}

interface GradingBoardProps {
  problems: MathProblem[]
  onSave: (answers: AnswerEntry[]) => void
}

export function GradingBoard({ problems, onSave }: GradingBoardProps) {
  const [answers, setAnswers] = useState<Map<string, AnswerState>>(new Map())

  const handleAnswerChange = (problemId: string, userAnswer: string) => {
    setAnswers((prev) => {
      const next = new Map(prev)
      const existing = next.get(problemId)
      next.set(problemId, { userAnswer, isCorrect: existing?.isCorrect })
      return next
    })
  }

  const handleToggle = (problemId: string, correct: boolean) => {
    setAnswers((prev) => {
      const next = new Map(prev)
      const existing = next.get(problemId)
      next.set(problemId, { userAnswer: existing?.userAnswer ?? '', isCorrect: correct })
      return next
    })
  }

  const allAnswered = problems.every((p) => answers.get(p.id)?.isCorrect !== undefined)

  const handleSave = () => {
    const entries: AnswerEntry[] = problems.map((p) => ({
      problemId: p.id,
      userAnswer: answers.get(p.id)?.userAnswer ?? '',
      isCorrect: answers.get(p.id)?.isCorrect ?? false,
    }))
    onSave(entries)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Type answers in the input field (auto-checks on blur), or use the check/X buttons to mark manually.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {problems.map((problem, i) => {
          const state = answers.get(problem.id)
          return (
            <GradeItem
              key={problem.id}
              problem={problem}
              index={i}
              userAnswer={state?.userAnswer ?? ''}
              isCorrect={state?.isCorrect}
              onAnswerChange={(answer) => handleAnswerChange(problem.id, answer)}
              onToggle={(correct) => handleToggle(problem.id, correct)}
            />
          )
        })}
      </div>
      <div className="flex justify-center pt-4">
        <Button size="lg" onClick={handleSave} disabled={!allAnswered}>
          <Save className="h-4 w-4 mr-2" />
          Save Grade
          {answers.size > 0 && ` (${Array.from(answers.values()).filter(a => a.isCorrect !== undefined).length}/${problems.length})`}
        </Button>
      </div>
    </div>
  )
}
