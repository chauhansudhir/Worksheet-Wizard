import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './layout'
import DashboardPage from '@/pages/dashboard/page'
import ProfilesPage from '@/pages/profiles/page'
import CreateWorksheetPage from '@/pages/create-worksheet/page'
import ViewWorksheetPage from '@/pages/view-worksheet/page'
import AnswerKeyPage from '@/pages/answer-key/page'
import GradeWorksheetPage from '@/pages/grade-worksheet/page'
import HistoryPage from '@/pages/history/page'
import GamesPage from '@/pages/games/page'
import AdminPage from '@/pages/admin/page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'profiles', element: <ProfilesPage /> },
      { path: 'create', element: <CreateWorksheetPage /> },
      { path: 'worksheet/:id', element: <ViewWorksheetPage /> },
      { path: 'worksheet/:id/answers', element: <AnswerKeyPage /> },
      { path: 'worksheet/:id/grade', element: <GradeWorksheetPage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'games', element: <GamesPage /> },
      { path: 'admin', element: <AdminPage /> },
    ],
  },
])
