// AuthProvider.tsx: React context provider that manages authentication state.
// Wraps the entire app so any component can access auth state via useAuth().
// Stores the JWT in memory (not localStorage) for XSS protection.

import { useState, useCallback } from 'react'
// useState: React hook to hold state (userId) that triggers re-renders when it changes.
// useCallback: Memoizes functions so they keep the same reference across re-renders.
//   Prevents unnecessary re-renders of child components that depend on these functions.

import type { ReactNode } from 'react'
// ReactNode: TypeScript type for anything React can render — JSX, strings, null, arrays, etc.
// Used to type the `children` prop.

import type { AuthContextType } from '@/features/auth/types'
// AuthContextType: The shape of our auth context (isAuthenticated, userId, login, logout).

import { login as loginApi } from '@/shared/api/endpoints'
// loginApi: The typed API function that calls POST /token.
// Renamed to loginApi to avoid naming conflict with the login function we expose in context.

import { setAccessToken } from '@/shared/api/client'
// setAccessToken: Sets the JWT in the module-level memory of the API client.
// After calling this, all subsequent API requests include the token in their Auth header.

import { AuthContext } from './AuthContext'
// AuthContext: Imported from a separate file so this file only exports the component.
// Vite Fast Refresh requires component-only exports to enable hot-reload without state loss.

export function AuthProvider({ children }: { children: ReactNode }) {
  // AuthProvider: The component that wraps the app and provides auth state to all children.
  // children: The React component tree rendered inside <AuthProvider>...</AuthProvider>.

  const [userId, setUserId] = useState<string | null>(null)
  // userId: The currently logged-in user's ID, or null if not authenticated.
  // This is the single source of truth for auth state in the entire app.

  const login = useCallback(async (id: string, password: string) => {
    // login: Authenticate the user by calling the LARVIS API.
    // useCallback ensures this function reference stays stable across re-renders.
    const response = await loginApi({ user_id: id, password })
    // Call POST /token with the credentials. Throws if the API returns an error.
    setAccessToken(response.access)
    // Store the JWT in the API client's memory for all future requests.
    setUserId(id)
    // Update React state with the user ID — triggers a re-render,
    // which makes isAuthenticated flip to true throughout the app.
  }, [])

  const logout = useCallback(() => {
    // logout: Clear auth state and token. The router will redirect to /login
    // because isAuthenticated becomes false.
    setAccessToken(null)
    setUserId(null)
  }, [])

  const value: AuthContextType = {
    isAuthenticated: userId !== null,
    // isAuthenticated: Derived from userId — true if we have a logged-in user.
    userId,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {/* AuthContext.Provider: Makes the auth state available to all descendants.
          Any component in the tree can call useAuth() to read isAuthenticated, userId,
          or call login/logout. */}
      {children}
    </AuthContext.Provider>
  )
}
