import { Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { activeProfileIdAtom } from '@/stores/profile-atoms'
import { useWorksheets } from '@/hooks/use-worksheets'
import { generateProblems } from '@/lib/math-engine'
import { PageHeader } from '@/components/layout/page-header'
import { ConfigForm } from '@/components/worksheet/config-form'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { WorksheetConfig } from '@/types'

function CreateContent() {
  const navigate = useNavigate()
  const profileId = useAtomValue(activeProfileIdAtom)
  const { createWorksheet } = useWorksheets()

  const handleSubmit = async (config: WorksheetConfig) => {
    const problems = generateProblems(config)
    const worksheet = await createWorksheet(config, problems)
    navigate(`/worksheet/${worksheet.id}`)
  }

  if (!profileId) {
    return (
      <div>
        <PageHeader title="Create Worksheet" />
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Profile Selected</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              Please select or create a profile first.
            </p>
            <Button asChild>
              <Link to="/profiles">Go to Profiles</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Create Worksheet"
        description="Configure your math worksheet and generate problems."
      />
      <Card>
        <CardContent className="p-6">
          <ConfigForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  )
}

export default function CreateWorksheetPage() {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
      <CreateContent />
    </Suspense>
  )
}
