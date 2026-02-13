import type { MathProblem, ProblemLayout } from '@/types'
import { FractionDisplay } from './fraction-display'
import { CircleFraction } from './circle-fraction'
import { BarFraction } from './bar-fraction'
import { SetFraction } from './set-fraction'
import { cn } from '@/lib/utils'

interface ProblemCellProps {
  problem: MathProblem
  index: number
  showAnswer?: boolean
  layout?: ProblemLayout
}

function VerticalWholeProblem({ problem, showAnswer }: { problem: Extract<MathProblem, { type: 'whole' }>; showAnswer?: boolean }) {
  // Parse operator from displayString: "12 + 5 =" → operator is "+"
  const op = problem.operator

  // Right-align both numbers and the answer
  const topStr = String(problem.operand1)
  const bottomStr = String(problem.operand2)
  const answerStr = String(problem.answer) + (problem.remainder !== undefined ? ` R${problem.remainder}` : '')
  const maxLen = Math.max(topStr.length, bottomStr.length, showAnswer ? answerStr.length : 0)

  return (
    <div className="inline-flex flex-col items-end font-mono text-lg leading-relaxed">
      {/* Top operand */}
      <div className="pr-1">
        {topStr.padStart(maxLen, '\u2007').split('').map((ch, i) => (
          <span key={i}>{ch}</span>
        ))}
      </div>
      {/* Operator + bottom operand */}
      <div className="flex items-center">
        <span className="mr-1 text-muted-foreground">{op}</span>
        {bottomStr.padStart(maxLen, '\u2007').split('').map((ch, i) => (
          <span key={i}>{ch}</span>
        ))}
      </div>
      {/* Divider line */}
      <div className="w-full border-t-2 border-foreground mt-0.5 mb-1" style={{ minWidth: `${(maxLen + 2) * 0.65}em` }} />
      {/* Answer or blank */}
      <div className="pr-1">
        {showAnswer ? (
          <span className="font-bold text-primary">{answerStr}</span>
        ) : (
          <span className="invisible">{topStr.padStart(maxLen, '0')}</span>
        )}
      </div>
    </div>
  )
}

export function ProblemCell({ problem, index, showAnswer, layout = 'horizontal' }: ProblemCellProps) {
  const isVertical = layout === 'vertical' && problem.type === 'whole'

  return (
    <div className={cn(
      'problem-cell border rounded-lg p-4 min-h-[80px] flex gap-3',
      isVertical ? 'items-center' : 'items-start'
    )}>
      <span className="text-sm text-muted-foreground min-w-[1.5rem] mt-1">{index + 1}.</span>
      <div className="flex-1">
        {problem.type === 'whole' && isVertical && (
          <VerticalWholeProblem problem={problem} showAnswer={showAnswer} />
        )}

        {problem.type === 'whole' && !isVertical && (
          <div className="flex items-center gap-1 text-lg font-mono">
            <span>{problem.displayString}</span>
            {showAnswer && (
              <span className="font-bold text-primary">
                {problem.answer}
                {problem.remainder !== undefined && ` R${problem.remainder}`}
              </span>
            )}
            {!showAnswer && <span className="border-b-2 border-muted-foreground/30 inline-block w-20" />}
          </div>
        )}

        {problem.type === 'fraction' && (
          <div className="flex items-center gap-2 text-lg">
            <FractionDisplay fraction={problem.operand1} />
            <span className="mx-1">{problem.operator}</span>
            <FractionDisplay fraction={problem.operand2} />
            <span className="mx-1">=</span>
            {showAnswer ? (
              <span className="font-bold text-primary">
                <FractionDisplay fraction={problem.answer} />
              </span>
            ) : (
              <span className="border-b-2 border-muted-foreground/30 inline-block w-16" />
            )}
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
              <div className="flex items-center gap-2">
                {showAnswer ? (
                  <span className="text-lg font-bold text-primary">
                    <FractionDisplay fraction={problem.answer} />
                  </span>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="border-b border-muted-foreground/50 inline-block w-8 mb-0.5" />
                    <span className="border-b border-muted-foreground/50 inline-block w-8" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
