import { Suspense, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useWorksheets } from '@/hooks/use-worksheets'
import { useGrading } from '@/hooks/use-grading'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScoreDisplay } from '@/components/grading/score-display'
import { Encouragement } from '@/components/grading/encouragement'
import { Printer, ArrowLeft, Save, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { FractionDisplay } from '@/components/worksheet/fraction-display'
import { CircleFraction } from '@/components/worksheet/circle-fraction'
import { BarFraction } from '@/components/worksheet/bar-fraction'
import { SetFraction } from '@/components/worksheet/set-fraction'
import type { MathProblem, AnswerEntry, GradingResult } from '@/types'
import { getCorrectAnswerStr } from '@/components/grading/grade-item'

function AnswerProblemCell({ problem, index, gradeState, onToggle }: {
  problem: MathProblem
  index: number
  gradeState: boolean | undefined
  onToggle: (correct: boolean) => void
}) {
  return (
    <div
      className={cn(
        'problem-cell border-2 rounded-lg p-4 min-h-[80px] flex items-start gap-3 transition-colors',
        gradeState === undefined && 'border-muted bg-card',
        gradeState === true && 'border-green-400 bg-green-50',
        gradeState === false && 'border-purple-400 bg-purple-50',
      )}
    >
      <span className={cn(
        'text-sm font-bold min-w-[1.5rem] mt-1',
        gradeState === true && 'text-green-600',
        gradeState === false && 'text-purple-600',
        gradeState === undefined && 'text-muted-foreground',
      )}>{index + 1}.</span>

      <div className="flex-1 space-y-2">
        {/* Problem display */}
        {problem.type === 'whole' && (
          <div className="flex items-center gap-1 text-lg font-mono">
            <span>{problem.displayString}</span>
            <span className={cn(
              'font-bold',
              gradeState === true && 'text-green-700',
              gradeState === false && 'text-purple-700',
              gradeState === undefined && 'text-primary',
            )}>
              {problem.answer}
              {problem.remainder !== undefined && ` R${problem.remainder}`}
            </span>
          </div>
        )}

        {problem.type === 'fraction' && (
          <div className="flex items-center gap-2 text-lg">
            <FractionDisplay fraction={problem.operand1} />
            <span className="mx-1">{problem.operator}</span>
            <FractionDisplay fraction={problem.operand2} />
            <span className="mx-1">=</span>
            <span className={cn(
              'font-bold',
              gradeState === true && 'text-green-700',
              gradeState === false && 'text-purple-700',
              gradeState === undefined && 'text-primary',
            )}>
              <FractionDisplay fraction={problem.answer} />
            </span>
          </div>
        )}

        {problem.type === 'visual-fraction' && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{problem.prompt}</p>
            <div className="flex items-center gap-4">
              {problem.visualType === 'circle' && (
                <CircleFraction totalParts={problem.totalParts} shadedParts={problem.shadedParts} />
              )}
              {problem.visualType === 'bar' && (
                <BarFraction totalParts={problem.totalParts} shadedParts={problem.shadedParts} />
              )}
              {problem.visualType === 'set' && (
                <SetFraction totalParts={problem.totalParts} shadedParts={problem.shadedParts} />
              )}
              <span className={cn(
                'text-lg font-bold',
                gradeState === true && 'text-green-700',
                gradeState === false && 'text-purple-700',
                gradeState === undefined && 'text-primary',
              )}>
                <FractionDisplay fraction={problem.answer} />
              </span>
            </div>
          </div>
        )}

        {/* Grade buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => onToggle(true)}
            className={cn(
              'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors border',
              gradeState === true
                ? 'bg-green-500 text-white border-green-500'
                : 'bg-card text-muted-foreground border-border hover:border-green-400 hover:text-green-600',
            )}
          >
            <Check className="h-3.5 w-3.5" />
            Correct
          </button>
          <button
            type="button"
            onClick={() => onToggle(false)}
            className={cn(
              'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors border',
              gradeState === false
                ? 'bg-purple-500 text-white border-purple-500'
                : 'bg-card text-muted-foreground border-border hover:border-purple-400 hover:text-purple-600',
            )}
          >
            <X className="h-3.5 w-3.5" />
            Wrong
          </button>
        </div>
      </div>

      {/* Status badge */}
      {gradeState !== undefined && (
        <div className={cn(
          'shrink-0 rounded-full p-1',
          gradeState ? 'bg-green-500' : 'bg-purple-500',
        )}>
          {gradeState ? (
            <Check className="h-3.5 w-3.5 text-white" />
          ) : (
            <X className="h-3.5 w-3.5 text-white" />
          )}
        </div>
      )}
    </div>
  )
}

function AnswerKeyContent() {
  const { id } = useParams<{ id: string }>()
  const { getWorksheet } = useWorksheets()
  const { getGrade, saveGrade } = useGrading()
  const worksheet = id ? getWorksheet(id) : undefined
  const existingGrade = id ? getGrade(id) : undefined

  const [grades, setGrades] = useState<Map<string, boolean>>(() => {
    // Pre-populate from existing grade if available
    const map = new Map<string, boolean>()
    if (existingGrade?.answers) {
      for (const a of existingGrade.answers) {
        map.set(a.problemId, a.isCorrect)
      }
    }
    return map
  })
  const [savedResult, setSavedResult] = useState<{ result: GradingResult; xpEarned: number } | null>(null)

  if (!worksheet) {
    return (
      <div className="flex flex-col items-center py-16">
        <h3 className="text-lg font-medium">Worksheet not found</h3>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/"><ArrowLeft className="h-4 w-4 mr-2" />Back</Link>
        </Button>
      </div>
    )
  }

  const handleToggle = (problemId: string, correct: boolean) => {
    setGrades((prev) => {
      const next = new Map(prev)
      next.set(problemId, correct)
      return next
    })
  }

  const problems = worksheet.problems ?? []
  const allGraded = problems.length > 0 && problems.every((p) => grades.has(p.id))
  const correctCount = Array.from(grades.values()).filter(Boolean).length
  const gradedCount = grades.size
  const totalProblems = problems.length || 1 // avoid division by zero

  const handleSave = async () => {
    const answers: AnswerEntry[] = problems.map((p) => ({
      problemId: p.id,
      userAnswer: getCorrectAnswerStr(p),
      isCorrect: grades.get(p.id) ?? false,
    }))

    const { result, xpEarned, leveledUp, newLevel } = await saveGrade(worksheet.id, answers, worksheet.config)
    setSavedResult({ result, xpEarned })

    toast.success('Grade saved!')
    if (leveledUp) {
      toast.success(`Level Up! You reached Level ${newLevel}!`, {
        description: 'Keep up the amazing work!',
        duration: 5000,
      })
    }
  }

  return (
    <div>
      <div className="no-print flex items-center gap-3 mb-6">
        <Button asChild variant="outline" size="sm">
          <Link to={`/worksheet/${id}`}><ArrowLeft className="h-4 w-4 mr-2" />Back to Worksheet</Link>
        </Button>
        <div className="flex-1" />
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer className="h-4 w-4 mr-2" />Print Answer Key
        </Button>
      </div>

      {savedResult ? (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <ScoreDisplay
                score={savedResult.result.score}
                total={savedResult.result.totalProblems}
                percentage={savedResult.result.percentage}
              />
              <Encouragement percentage={savedResult.result.percentage} xpEarned={savedResult.xpEarned} />
              <div className="flex justify-center gap-3">
                <Button asChild variant="outline">
                  <Link to={`/worksheet/${id}`}>View Worksheet</Link>
                </Button>
                <Button asChild>
                  <Link to="/create">Create New Worksheet</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          {/* Live score bar */}
          <div className="no-print mb-4 flex items-center gap-4">
            <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
              Answer Key
            </span>
            {gradedCount > 0 && (
              <span className="text-sm text-muted-foreground">
                {correctCount} correct, {gradedCount - correctCount} wrong
                {' '}&middot;{' '}
                {gradedCount}/{problems.length} graded
              </span>
            )}
            <div className="flex-1" />
            {allGraded && (
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Grade ({Math.round((correctCount / totalProblems) * 100)}%)
              </Button>
            )}
          </div>

          <div className="worksheet-print-area max-w-4xl mx-auto">
            <div className="mb-6 border-b pb-4">
              <h2 className="text-xl font-bold">{worksheet.title}</h2>
              <div className="flex items-center gap-8 mt-2 text-sm text-muted-foreground">
                <div>
                  Name: <span className="border-b border-muted-foreground/50 inline-block w-48 print:w-64" />
                </div>
                <div>
                  Date: <span className="border-b border-muted-foreground/50 inline-block w-32 print:w-40" />
                </div>
                <div>Score: ______ / {problems.length}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {problems.map((problem, i) => (
                <AnswerProblemCell
                  key={problem.id}
                  problem={problem}
                  index={i}
                  gradeState={grades.get(problem.id)}
                  onToggle={(correct) => handleToggle(problem.id, correct)}
                />
              ))}
            </div>
          </div>

          {/* Floating save bar */}
          {gradedCount > 0 && !allGraded && (
            <div className="no-print sticky bottom-4 mt-6 flex justify-center">
              <div className="bg-card border-2 shadow-lg rounded-full px-6 py-3 flex items-center gap-4">
                <span className="text-sm font-medium">
                  {gradedCount}/{problems.length} graded
                </span>
                <div className="h-4 w-px bg-border" />
                <span className="text-sm text-green-600 font-semibold">{correctCount} correct</span>
                <span className="text-sm text-purple-600 font-semibold">{gradedCount - correctCount} wrong</span>
              </div>
            </div>
          )}

          {allGraded && (
            <div className="no-print sticky bottom-4 mt-6 flex justify-center">
              <Button size="lg" onClick={handleSave} className="shadow-lg rounded-full px-8">
                <Save className="h-4 w-4 mr-2" />
                Save Grade — {correctCount}/{problems.length} ({Math.round((correctCount / totalProblems) * 100)}%)
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function AnswerKeyPage() {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading answer key...</div>}>
      <AnswerKeyContent />
    </Suspense>
  )
}
