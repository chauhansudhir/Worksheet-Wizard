import { Link, useNavigate } from 'react-router-dom'
import type { Worksheet, GradingResult } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Eye, CheckCircle, Trash2 } from 'lucide-react'
import { formatDate, getOperationLabel } from '@/lib/utils'
import { getScoreColor } from '@/lib/messages'

interface HistoryTableProps {
  worksheets: Worksheet[]
  gradesMap: Map<string, GradingResult>
  onDelete: (id: string) => void
}

export function HistoryTable({ worksheets, gradesMap, onDelete }: HistoryTableProps) {
  const navigate = useNavigate()

  if (worksheets.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No worksheets found matching your filters.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {worksheets.map((ws) => {
        const grade = gradesMap.get(ws.id)
        const title = ws.title || `${getOperationLabel(ws.config?.operationType ?? 'addition')} - ${ws.config?.problemCount ?? 0} Problems`
        const dateStr = formatDate(ws.createdAt)

        return (
          <div
            key={ws.id}
            onClick={() => navigate(`/worksheet/${ws.id}`)}
            className="flex items-center gap-4 rounded-lg border p-4 hover:bg-accent transition-colors cursor-pointer"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{title}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="secondary">{getOperationLabel(ws.config?.operationType ?? 'addition')}</Badge>
                <span className="text-sm text-muted-foreground">
                  {ws.config?.problemCount ?? 0} problems
                </span>
                <span className="text-sm text-muted-foreground">
                  Diff: {ws.config?.difficulty ?? 0}
                </span>
                {dateStr && (
                  <span className="text-sm text-muted-foreground">{dateStr}</span>
                )}
              </div>
              {grade && (
                <div className="flex items-center gap-3 mt-1.5 text-sm">
                  <span className="text-green-600 font-medium">{grade.score} correct</span>
                  <span className="text-purple-600 font-medium">{grade.totalProblems - grade.score} wrong</span>
                  {grade.gradedAt && (
                    <span className="text-muted-foreground">Graded {formatDate(grade.gradedAt)}</span>
                  )}
                </div>
              )}
            </div>
            {grade ? (
              <span className={`text-lg font-bold ${getScoreColor(grade.percentage)}`}>
                {grade.percentage}%
              </span>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">Not graded</Badge>
            )}
            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
              <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                <Link to={`/worksheet/${ws.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                <Link to={`/worksheet/${ws.id}/grade`}>
                  <CheckCircle className="h-4 w-4" />
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Worksheet</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this worksheet? This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(ws.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )
      })}
    </div>
  )
}
