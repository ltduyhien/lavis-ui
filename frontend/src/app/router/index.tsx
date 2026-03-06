// router/index.tsx: Central route definitions for the app.
// Maps URL paths to page components and assigns layouts.

import { createBrowserRouter, Navigate } from 'react-router-dom'
// createBrowserRouter: React Router v7 function that creates a router using the browser's
//   History API (pushState/popState). Enables clean URLs like /dashboard instead of /#/dashboard.
// Navigate: Component that performs a redirect when rendered.

import { AuthLayout } from '@/app/layout/AuthLayout'
// AuthLayout: Full-screen Mars background with centered content. Used for the login page.

import { MainLayout } from '@/app/layout/MainLayout'
// MainLayout: Sidebar + header + content area shell. Used for all authenticated pages.

import { ProtectedRoute } from './ProtectedRoute'
// ProtectedRoute: Route guard — redirects to /login if the user isn't authenticated.

import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
// Page components — each one is a composition of features displayed at a specific URL.

export const router = createBrowserRouter([
  // createBrowserRouter: Takes an array of route objects defining the URL → component mapping.
  // Routes are nested — child routes render inside their parent's <Outlet />.

  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
    // Root path (/) redirects to /dashboard.
    // replace: Don't add / to the history stack — pressing back won't loop back here.
  },

  {
    element: <AuthLayout />,
    // AuthLayout wraps all unauthenticated routes.
    // No `path` here — this is a "layout route" that only provides the visual shell.
    children: [
      {
        path: '/login',
        element: <LoginPage />,
        // /login renders the LoginPage inside the AuthLayout (Mars background + centered card).
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    // ProtectedRoute wraps all routes that require authentication.
    // If the user isn't logged in, they get redirected to /login.
    children: [
      {
        element: <MainLayout />,
        // MainLayout provides the sidebar + header shell for authenticated pages.
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
            // /dashboard → the ore acquisitions dashboard (charts, stats, table).
          },
          // TODO: /users, /users/:id, /report routes will be added here.
        ],
      },
    ],
  },
])
