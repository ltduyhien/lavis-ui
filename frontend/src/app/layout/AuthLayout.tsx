// AuthLayout.tsx: Layout for unauthenticated pages (login).
// Full-screen Mars background with content centered in the viewport.
// The login card floats over the background image.

import { Outlet } from 'react-router-dom'
// Outlet: React Router placeholder — renders the matched child route (LoginPage).

import marsBg from '@/shared/assets/mars-bg.png'
// marsBg: Import the Mars landscape image as a URL string.
// Vite handles this import — in dev it's a local path, in production it's a hashed asset URL.

export function AuthLayout() {
  return (
    <div
      className="relative flex min-h-svh items-center justify-center bg-cover bg-center bg-no-repeat p-4"
      // relative: Position context for any absolutely-positioned children.
      // flex items-center justify-center: Center the child (login card) both vertically and horizontally.
      // min-h-svh: Minimum height = small viewport height (accounts for mobile browser chrome).
      //   svh is more reliable than vh on mobile where the address bar changes viewport size.
      // bg-cover: Scale the background image to cover the entire container.
      // bg-center: Center the background image.
      // bg-no-repeat: Don't tile the image.
      // p-4: 16px padding on all sides so the card doesn't touch screen edges on mobile.
      style={{ backgroundImage: `url(${marsBg})` }}
      // backgroundImage: Set the Mars landscape as the background via inline style.
      // Inline because Tailwind's bg-[url()] doesn't work well with imported asset URLs.
    >
      <div className="absolute inset-0 bg-black/40" />
      {/* Dark overlay on top of the background image.
          absolute inset-0: Cover the entire parent (top/right/bottom/left = 0).
          bg-black/40: Semi-transparent black (40% opacity).
          Improves readability of the login card text against the bright Mars landscape. */}

      <div className="relative z-10 w-full max-w-md">
        {/* relative z-10: Position above the dark overlay (z-10 > default z-0).
            w-full: Take full width of the parent.
            max-w-md: Cap at 448px — the login card shouldn't stretch across a wide monitor.
            On mobile (< 448px), w-full kicks in so it uses available space minus padding. */}
        <Outlet />
        {/* Outlet: The login page component renders here. */}
      </div>
    </div>
  )
}
