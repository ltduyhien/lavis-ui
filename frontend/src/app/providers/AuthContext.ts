// AuthContext.ts: The React context object for authentication, in its own file.
// Vite's Fast Refresh requires that files exporting React components ONLY export components.
// If a component file also exports a context (createContext), Fast Refresh can't safely
// hot-reload it — it doesn't know if the export is a component or plain value.
// Separating the context into its own file avoids this restriction.

import { createContext } from 'react'
// createContext: Creates a React context — a way to pass data through the component tree
//   without manually threading props through every level.

import type { AuthContextType } from '@/features/auth/types'
// AuthContextType: The shape of our auth context (isAuthenticated, userId, login, logout).

export const AuthContext = createContext<AuthContextType | null>(null)
// AuthContext: Initialized with null — components must be wrapped in AuthProvider to use it.
// The <AuthContextType | null> generic tells TypeScript the context can be null
// (when accessed outside the provider) or AuthContextType (when inside).
