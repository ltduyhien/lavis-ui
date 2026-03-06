// App.tsx: Root component of the application.
// Wires together the global providers (auth) and the router.
// This is the top of the component tree — everything renders inside here.

import { RouterProvider } from 'react-router-dom'
// RouterProvider: React Router component that connects the router to the React tree.
// Takes a router object (created with createBrowserRouter) and renders the matched routes.

import { AuthProvider } from './providers/AuthProvider'
// AuthProvider: Wraps the app with auth context so any component can access
// isAuthenticated, userId, login(), and logout() via useAuth().

import { router } from './router'
// router: The route configuration — maps URLs to page components with layout nesting.

export function App() {
  return (
    <AuthProvider>
      {/* AuthProvider must wrap RouterProvider because route guards (ProtectedRoute)
          need to call useAuth() — which requires the auth context to exist above them. */}
      <RouterProvider router={router} />
      {/* RouterProvider: Renders the matched route based on the current browser URL.
          It reads from the router config and renders the correct layout + page. */}
    </AuthProvider>
  )
}
