import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { profilesDb, worksheetsDb, gradingDb } from '@/stores/db'
import { activeProfileIdAtom } from '@/stores/profile-atoms'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { Trash2, Database, AlertTriangle, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminPage() {
  const clearProfiles = useSetAtom(profilesDb.clear)
  const clearWorksheets = useSetAtom(worksheetsDb.clear)
  const clearGrading = useSetAtom(gradingDb.clear)
  const setActiveProfileId = useSetAtom(activeProfileIdAtom)
  const [cleared, setCleared] = useState(false)

  const handleResetAll = async () => {
    await clearProfiles()
    await clearWorksheets()
    await clearGrading()
    setActiveProfileId(null)
    setCleared(true)
    toast.success('All data has been reset')
  }

  const handleClearOldDb = async () => {
    // Clear the old default "jotai-minidb" store that was shared
    try {
      const dbs = await indexedDB.databases()
      for (const db of dbs) {
        if (db.name && (db.name === 'jotai-minidb' || db.name === 'keyval-store')) {
          indexedDB.deleteDatabase(db.name)
        }
      }
      toast.success('Legacy database cleared')
    } catch {
      // indexedDB.databases() not supported in all browsers, try direct delete
      indexedDB.deleteDatabase('jotai-minidb')
      indexedDB.deleteDatabase('keyval-store')
      toast.success('Legacy database cleared')
    }
  }

  return (
    <div>
      <PageHeader title="Admin" description="Manage app data and settings." />

      <div className="space-y-4 max-w-2xl">
        {cleared && (
          <Card className="border-green-300 bg-green-50">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
              <p className="text-sm text-green-700 font-medium">
                All data has been reset. You can now create a fresh profile to get started.
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>
              Manage your app's stored data. These actions cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Reset Everything</p>
                <p className="text-sm text-muted-foreground">
                  Delete all profiles, worksheets, grades, and progress. Start fresh.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Reset All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Reset All Data?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all profiles, worksheets, grades, and progress.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleResetAll}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Yes, Reset Everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Clear Legacy Database</p>
                <p className="text-sm text-muted-foreground">
                  Remove old shared database from before the fix. Run this once to clean up.
                </p>
              </div>
              <Button variant="outline" onClick={handleClearOldDb}>
                <Database className="h-4 w-4 mr-2" />
                Clear Legacy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
