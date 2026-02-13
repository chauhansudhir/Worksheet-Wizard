import { Suspense, useState, useMemo } from 'react'
import { useWorksheets } from '@/hooks/use-worksheets'
import { useGrading } from '@/hooks/use-grading'
import { PageHeader } from '@/components/layout/page-header'
import { HistoryFilters } from '@/components/history/history-filters'
import { HistoryTable } from '@/components/history/history-table'
import { FileText } from 'lucide-react'
import type { GradingResult } from '@/types'

function HistoryContent() {
  const { worksheets, deleteWorksheet } = useWorksheets()
  const { grades, deleteGrade } = useGrading()
  const [operationFilter, setOperationFilter] = useState('all')

  const gradesMap = useMemo(() => {
    const map = new Map<string, GradingResult>()
    for (const g of grades) {
      if (g?.worksheetId) map.set(g.worksheetId, g)
    }
    return map
  }, [grades])

  const filteredWorksheets = useMemo(() => {
    if (operationFilter === 'all') return worksheets
    return worksheets.filter((ws) => ws?.config?.operationType === operationFilter)
  }, [worksheets, operationFilter])

  const handleDelete = async (id: string) => {
    await deleteWorksheet(id)
    await deleteGrade(id)
  }

  return (
    <div>
      <PageHeader title="Worksheet History" description="View and manage your past worksheets." />

      {worksheets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No worksheets yet</h3>
          <p className="text-muted-foreground mt-1">Create your first worksheet to see it here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <HistoryFilters
            operationFilter={operationFilter}
            onOperationChange={setOperationFilter}
            onClear={() => setOperationFilter('all')}
          />
          <HistoryTable
            worksheets={filteredWorksheets}
            gradesMap={gradesMap}
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  )
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading history...</div>}>
      <HistoryContent />
    </Suspense>
  )
}
