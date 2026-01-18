import type { ReactElement } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'

import { DashboardPage } from 'pages/dashboard'
import { FiltersPage } from 'pages/filters'
import { LlmPage } from 'pages/llm'
import { SettingsPage } from 'pages/settings'
import { AppLayout } from 'widgets/layout'

const routes = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'filters', element: <FiltersPage /> },
      { path: 'llm', element: <LlmPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <Navigate to="/dashboard" replace /> },
    ],
  },
] satisfies Parameters<typeof createBrowserRouter>[0]

export const router = createBrowserRouter(routes)

export type AppRouterElement = ReactElement
