import { Suspense } from 'react'
import { Link } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { useProgress } from '@/hooks/use-progress'
import { recentWorksheetsAtom } from '@/stores/worksheet-atoms'
import { LevelBadge } from '@/components/progress/level-badge'
import { XpProgressBar } from '@/components/progress/xp-progress-bar'
import { ScoreTrendChart } from '@/components/progress/score-trend-chart'
import { WeeklyActivityChart } from '@/components/progress/weekly-activity-chart'
import { OperationBreakdownChart } from '@/components/progress/operation-breakdown-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  PlusCircle, FileText, Target, Trophy, Calculator,
} from 'lucide-react'
import { formatDate, getOperationLabel } from '@/lib/utils'

function DashboardContent() {
  const {
    profile, xp, levelInfo, xpProgress,
    averageScore, bestScore, totalWorksheets,
    scoreTrend, weeklyActivity, operationBreakdown,
  } = useProgress()
  const recentWorksheets = useAtomValue(recentWorksheetsAtom)

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Calculator className="h-16 w-16 text-primary mb-4" />
        <h2 className="text-2xl font-bold">Welcome to Worksheet Wizard!</h2>
        <p className="text-muted-foreground mt-2 mb-6 max-w-md">
          Create a profile for your kid to start generating math worksheets and tracking progress.
        </p>
        <Button asChild size="lg">
          <Link to="/profiles">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create a Profile
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Hi, {profile.name}!</h2>
          <div className="flex items-center gap-3 mt-2">
            <LevelBadge levelInfo={levelInfo} />
          </div>
        </div>
        <Button asChild>
          <Link to="/create">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Worksheet
          </Link>
        </Button>
      </div>

      <XpProgressBar xpProgress={xpProgress} totalXp={xp} />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalWorksheets}</p>
              <p className="text-sm text-muted-foreground">Total Worksheets</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <Target className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{averageScore}%</p>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{bestScore}%</p>
              <p className="text-sm text-muted-foreground">Best Score</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {recentWorksheets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Worksheets</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2">
              {recentWorksheets.map((ws) => (
                <Link
                  key={ws.id}
                  to={`/worksheet/${ws.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors"
                >
                  <div>
                    <p className="font-medium">{ws.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {getOperationLabel(ws.config.operationType)} &middot; {formatDate(ws.createdAt)}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <span>View</span>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreTrendChart data={scoreTrend} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyActivityChart data={weeklyActivity} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Practice Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <OperationBreakdownChart data={operationBreakdown} />
        </CardContent>
      </Card>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
