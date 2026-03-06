// AuthLayout.tsx: Full-screen login layout with Mars planet background.
// Heading + subtitle float above the card, centered vertically in the viewport.
// 50% black overlay darkens the background for text readability.

import { Outlet } from 'react-router-dom'
import marsBg from '@/shared/assets/mars-bg.png'

export function AuthLayout() {
  return (
    <div
      className="relative flex min-h-svh flex-col bg-cover bg-center bg-no-repeat px-4 py-12"
      style={{ backgroundImage: `url(${marsBg})` }}
    >
      <div className="absolute inset-0 bg-mars-overlay" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
        <header className="text-center">
          <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight text-white sm:text-[2rem]">
            Welcome to Mars Command Station
          </h1>
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.25em] text-mars-muted">
            Resource Monitoring and Crew Management
          </p>
        </header>

        <div className="mt-10 w-full max-w-[26rem]">
          <Outlet />
        </div>
      </div>

      <footer className="relative z-10 py-4 text-center text-xs text-mars-muted">
        © {new Date().getFullYear()} Mars Command Station
      </footer>
    </div>
  )
}
