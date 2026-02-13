import { Suspense, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useWorksheets } from '@/hooks/use-worksheets'
import { useGrading } from '@/hooks/use-grading'
import { GradingBoard } from '@/components/grading/grading-board'
import { ScoreDisplay } from '@/components/grading/score-display'
import { Encouragement } from '@/components/grading/encouragement'
import { GradeResultItem } from '@/components/grading/grade-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { calculateXpEarned } from '@/lib/levels'
import type { AnswerEntry, GradingResult } from '@/types'

function GradeContent() {
  const { id } = useParams<{ id: string }>()
  const { getWorksheet } = useWorksheets()
  const { getGrade, saveGrade } = useGrading()
  const worksheet = id ? getWorksheet(id) : undefined
  const existingGrade = id ? getGrade(id) : undefined
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

  // Treat old grades without per-problem answers as incomplete — let user re-grade
  const hasAnswerDetails = (g: GradingResult | undefined): g is GradingResult =>
    g != null && Array.isArray(g.answers) && g.answers.length > 0

  const grade = hasAnswerDetails(savedResult?.result) ? savedResult!.result
    : hasAnswerDetails(existingGrade) ? existingGrade
    : undefined

  const xpEarned = savedResult?.xpEarned ?? (existingGrade?.percentage != null ? calculateXpEarned(worksheet.config, existingGrade.percentage) : 0)
  const problems = worksheet.problems ?? []

  const handleSave = async (answers: AnswerEntry[]) => {
    const { result, xpEarned, leveledUp, newLevel } = await saveGrade(worksheet.id, answers, worksheet.config)
    setSavedResult({ result, xpEarned })

    if (leveledUp) {
      toast.success(`Level Up! You reached Level ${newLevel}!`, {
        description: 'Keep up the amazing work!',
        duration: 5000,
      })
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button asChild variant="outline" size="sm">
          <Link to={`/worksheet/${id}`}><ArrowLeft className="h-4 w-4 mr-2" />Back to Worksheet</Link>
        </Button>
        <h2 className="text-lg font-semibold">{worksheet.title}</h2>
      </div>

      {grade ? (
        <div className="space-y-6">
          {/* Score summary */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <ScoreDisplay
                score={grade.score}
                total={grade.totalProblems}
                percentage={grade.percentage}
              />
              <Encouragement percentage={grade.percentage} xpEarned={xpEarned} />
              <div className="flex justify-center gap-3">
                <Button asChild variant="outline">
                  <Link to={`/worksheet/${id}/answers`}>View Answer Key</Link>
                </Button>
                <Button asChild>
                  <Link to="/create">Create New Worksheet</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Per-problem breakdown */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Problem-by-Problem Results</CardTitle>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-green-500" />
                    {grade.score ?? 0} correct
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-purple-500" />
                    {(grade.totalProblems ?? 0) - (grade.score ?? 0)} incorrect
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {problems.map((problem, i) => {
                  const entry = grade.answers?.find(a => a.problemId === problem.id)
                  return (
                    <GradeResultItem
                      key={problem.id}
                      problem={problem}
                      index={i}
                      userAnswer={entry?.userAnswer ?? ''}
                      isCorrect={entry?.isCorrect ?? false}
                    />
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <GradingBoard problems={problems} onSave={handleSave} />
      )}
    </div>
  )
}

export default function GradeWorksheetPage() {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
      <GradeContent />
    </Suspense>
  )
}
