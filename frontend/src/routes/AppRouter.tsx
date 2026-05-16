import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

import { LoginPage } from '../pages/Login'
import { RegisterPage } from '../pages/Register'
import { TasksPage } from '../pages/Tasks'
import { TaskDetailPage } from '../pages/TaskDetail'
import { TaskNewPage } from '../pages/TaskNew'
import { TaskEditPage } from '../pages/TaskEdit'
import { PrivateRoute } from './PrivateRouter'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: '/tasks',
        element: <TasksPage />,
      },
      {
        path: '/tasks/new',
        element: <TaskNewPage />,
      },
      {
        path: '/tasks/:id',
        element: <TaskDetailPage />,
      },
      {
        path: '/tasks/:id/edit',
        element: <TaskEditPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}