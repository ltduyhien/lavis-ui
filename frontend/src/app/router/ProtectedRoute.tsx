// ProtectedRoute.tsx: Route guard that redirects unauthenticated users to /login.
// Wrap any route group in <ProtectedRoute> to require authentication.

import { Navigate, Outlet } from 'react-router-dom'
// Navigate: React Router component that performs a client-side redirect when rendered.
//   <Navigate to="/login" /> is like calling navigate('/login') but declarative.
// Outlet: Placeholder where React Router renders the matched child route.
//   Same concept as {children} but for nested routes.

import { useAuth } from '@/features/auth/hooks/useAuth'
// useAuth: Our custom hook to check if the user is authenticated.

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  // isAuthenticated: true if the user has a valid JWT token in memory.

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
    // Navigate to="/login": Redirect to the login page.
    // replace: Replace the current history entry instead of pushing a new one.
    //   This prevents the user from hitting "back" and landing on the protected page
    //   (which would just redirect them again in an infinite loop).
  }

  return <Outlet />
  // Outlet: If authenticated, render the child route content.
  // The actual page component (DashboardPage, UsersPage, etc.) appears here.
}
