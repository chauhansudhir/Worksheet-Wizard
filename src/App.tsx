import { RouterProvider } from 'react-router-dom'
import { Provider as JotaiProvider } from 'jotai'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { router } from '@/routes'
import { Suspense } from 'react'

function App() {
  return (
    <JotaiProvider>
      <TooltipProvider>
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
          <RouterProvider router={router} />
        </Suspense>
        <Toaster />
      </TooltipProvider>
    </JotaiProvider>
  )
}

export default App
