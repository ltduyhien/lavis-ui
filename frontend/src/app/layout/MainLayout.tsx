// MainLayout.tsx: Layout shell for authenticated pages (dashboard, users, report).
// Sidebar navigation on the left, content area on the right.
// Placeholder for now — will be fleshed out when we build the dashboard.

import { Outlet } from 'react-router-dom'
// Outlet: React Router placeholder — renders the matched child page.

export function MainLayout() {
  return (
    <div className="flex min-h-svh bg-background text-foreground">
      {/* flex: Horizontal layout (sidebar + content side by side).
          min-h-svh: Fill at least the full viewport height.
          bg-background text-foreground: Use shadcn's theme-aware CSS variables. */}

      {/* TODO: Sidebar navigation will go here */}

      <main className="flex-1 p-6">
        {/* flex-1: Take all remaining horizontal space after the sidebar.
            p-6: 24px padding around the content area. */}
        <Outlet />
        {/* Outlet: The page component (DashboardPage, UsersPage, etc.) renders here. */}
      </main>
    </div>
  )
}
