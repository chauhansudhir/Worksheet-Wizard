import type { Worksheet } from '@/types'
import { ProblemCell } from './problem-cell'

interface WorksheetSheetProps {
  worksheet: Worksheet
  showAnswers?: boolean
}

export function WorksheetSheet({ worksheet, showAnswers }: WorksheetSheetProps) {
  const layout = worksheet.config?.layout ?? 'horizontal'

  return (
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
          <div>Score: ______ / {worksheet.problems.length}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {worksheet.problems.map((problem, i) => (
          <ProblemCell
            key={problem.id}
            problem={problem}
            index={i}
            showAnswer={showAnswers}
            layout={layout}
          />
        ))}
      </div>
    </div>
  )
}
