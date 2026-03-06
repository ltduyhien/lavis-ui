import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'

export function LoginForm() {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!userId.trim() || !password.trim()) {
      setError('Please fill out password.')
      return
    }

    setIsLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 5000))
      await login(userId, password)
      navigate('/dashboard', { replace: true })
    } catch {
      setError('Invalid credentials. Please check your username and password. 5 attempts left.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="gap-0 border border-mars-border bg-mars-overlay p-10 shadow-none outline-none ring-0 backdrop-blur-[2px]">
      <CardHeader className="gap-1 p-0">
        <CardTitle className="text-xl text-white">
          Secure terminal access
        </CardTitle>
        <CardDescription className="text-[0.8125rem] text-mars-muted">
          Enter your credentials to access the terminal
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-6 p-0">
        <form onSubmit={handleSubmit} noValidate>
          <div
            className="space-y-5"
            data-invalid={error ? true : undefined}
          >
            <div className="space-y-2">
              <Label
                htmlFor="userId"
                className={`text-sm font-medium ${error && error !== 'Please fill out password.' ? 'text-mars-error' : 'text-mars-muted'}`}
              >
                Username
              </Label>
              <Input
                id="userId"
                type="text"
                variant="glass"
                autoComplete="username"
                placeholder="Enter your username"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                disabled={isLoading}
                required
                aria-invalid={!!(error && error !== 'Please fill out password.')}
                aria-describedby={error && error !== 'Please fill out password.' ? 'login-error' : undefined}
                className="rounded-sm"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className={`text-sm font-medium ${error ? 'text-mars-error' : 'text-mars-muted'}`}
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                variant="glass"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                aria-invalid={!!error}
                aria-describedby={error ? 'login-error' : undefined}
                className="rounded-sm"
              />
              {error && (
                <p
                  id="login-error"
                  role="alert"
                  className="text-sm text-mars-error"
                >
                  {error}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            variant="mars"
            className="mt-6 h-10 w-full cursor-pointer rounded-sm text-sm font-medium disabled:opacity-100"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="inline-flex size-5 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
                Signing in
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="mt-6 p-0">
        <p className="text-xs leading-normal text-mars-muted">
          By accessing this terminal, you agree to the Station Operations Protocol.
        </p>
      </CardFooter>
    </Card>
  )
}
