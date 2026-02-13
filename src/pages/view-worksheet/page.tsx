import { Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useWorksheets } from '@/hooks/use-worksheets'
import { WorksheetSheet } from '@/components/worksheet/worksheet-sheet'
import { Button } from '@/components/ui/button'
import { Printer, CheckCircle, Eye, ArrowLeft } from 'lucide-react'

function ViewContent() {
  const { id } = useParams<{ id: string }>()
  const { getWorksheet } = useWorksheets()
  const worksheet = id ? getWorksheet(id) : undefined

  if (!worksheet) {
    return (
      <div className="flex flex-col items-center py-16">
        <h3 className="text-lg font-medium">Worksheet not found</h3>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/"><ArrowLeft className="h-4 w-4 mr-2" />Back to Dashboard</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="no-print flex items-center gap-3 mb-6">
        <Button asChild variant="outline" size="sm">
          <Link to="/"><ArrowLeft className="h-4 w-4 mr-2" />Back</Link>
        </Button>
        <div className="flex-1" />
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer className="h-4 w-4 mr-2" />Print
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to={`/worksheet/${id}/answers`}>
            <Eye className="h-4 w-4 mr-2" />Answer Key
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link to={`/worksheet/${id}/grade`}>
            <CheckCircle className="h-4 w-4 mr-2" />Grade
          </Link>
        </Button>
      </div>
      <WorksheetSheet worksheet={worksheet} />
    </div>
  )
}

export default function ViewWorksheetPage() {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading worksheet...</div>}>
      <ViewContent />
    </Suspense>
  )
}
