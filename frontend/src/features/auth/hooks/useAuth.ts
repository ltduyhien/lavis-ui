// useAuth.ts: Custom hook to access the auth context from any component.
// Provides type-safe access to isAuthenticated, userId, login(), and logout().

import { useContext } from 'react'
// useContext: React hook that reads the current value from a context.
// The component will re-render whenever the context value changes.

import { AuthContext } from '@/app/providers/AuthContext'
// AuthContext: The React context object, in its own file separate from the provider component.
// Contains { isAuthenticated, userId, login, logout }.

import type { AuthContextType } from '../types'
// AuthContextType: The TypeScript type for the context value.

export function useAuth(): AuthContextType {
  // useAuth: A convenience wrapper around useContext(AuthContext).
  // Throws an error if used outside of <AuthProvider> — this catches misuse early
  // instead of silently returning undefined and causing hard-to-debug issues.
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
    // This error means a component tried to call useAuth() but isn't wrapped
    // in <AuthProvider>. Check that App.tsx wraps everything in the provider.
  }
  return context
}
