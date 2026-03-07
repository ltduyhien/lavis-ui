import type { Acquisition } from '@/shared/api/endpoints'

export function formatUptime(ms: number): string {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  if (h > 0) return `${h}h ${m % 60}m`
  if (m > 0) return `${m}m ${s % 60}s`
  return `${s}s`
}

export function totalOreSitesToday(acquisitions: Acquisition[]): number {
  const today = new Date().toISOString().slice(0, 10)
  return acquisitions
    .filter((a) => new Date(a.timestamp * 1000).toISOString().slice(0, 10) === today)
    .reduce((sum, a) => sum + a.ore_sites, 0)
}

export function lastOreFound(acquisitions: Acquisition[]): string {
  if (!acquisitions.length) return '—'
  const latest = Math.max(...acquisitions.map((a) => a.timestamp))
  const d = new Date(latest * 1000)
  const now = Date.now() / 1000
  const diff = now - latest
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return d.toLocaleString()
}
