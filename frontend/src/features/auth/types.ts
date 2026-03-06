// types.ts: Auth-specific types used by the auth provider and login form.

export interface AuthContextType {
  // AuthContextType: Shape of the auth context value available to all components
  // via useAuth(). Contains the current user state and auth actions.
  isAuthenticated: boolean
  // isAuthenticated: true if the user has a valid JWT token in memory.
  userId: string | null
  // userId: The logged-in user's ID (e.g. "alice"), or null if not authenticated.
  // Extracted from the JWT payload after login.
  login: (userId: string, password: string) => Promise<void>
  // login: Async function to authenticate. Calls POST /token, stores the JWT,
  // and sets the userId. Throws on invalid credentials.
  logout: () => void
  // logout: Clear the token and userId, redirect to login page.
}
