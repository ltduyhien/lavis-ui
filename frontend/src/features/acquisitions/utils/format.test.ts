import type { Acquisition } from '@/shared/api/endpoints'
import {
  formatUptime,
  acquisitionsForMonth,
  totalOreSitesForMonth,
  totalScansForMonth,
  uniqueDaysForMonth,
  avgOreSitesPerScanForMonth,
  lastOreFound,
} from './format'

const mkAcq = (ts: number, ore_sites: number): Acquisition => ({ timestamp: ts, ore_sites })

describe('formatUptime', () => {
  it('formats seconds', () => {
    expect(formatUptime(3000)).toBe('3s')
    expect(formatUptime(0)).toBe('0s')
  })

  it('formats minutes', () => {
    expect(formatUptime(65000)).toBe('1m 5s')
  })

  it('formats hours', () => {
    expect(formatUptime(3665000)).toBe('1h 1m')
  })

  it('handles exactly 1 hour', () => {
    expect(formatUptime(3600000)).toBe('1h 0m')
  })
})

describe('acquisitionsForMonth', () => {
  const acqs: Acquisition[] = [
    mkAcq(new Date(Date.UTC(2025, 0, 15, 12, 0, 0)).getTime() / 1000, 10),
    mkAcq(new Date(Date.UTC(2025, 0, 16, 12, 0, 0)).getTime() / 1000, 5),
    mkAcq(new Date(Date.UTC(2025, 1, 1, 12, 0, 0)).getTime() / 1000, 3),
  ]

  it('filters by year and month', () => {
    const result = acquisitionsForMonth(acqs, 2025, 0)
    expect(result).toHaveLength(2)
    expect(result.every((a) => new Date(a.timestamp * 1000).getUTCMonth() === 0)).toBe(true)
  })

  it('returns empty for no matches', () => {
    expect(acquisitionsForMonth(acqs, 2024, 0)).toHaveLength(0)
  })
})

describe('totalOreSitesForMonth', () => {
  it('sums ore_sites for the month', () => {
    const acqs: Acquisition[] = [
      mkAcq(new Date(Date.UTC(2025, 0, 1)).getTime() / 1000, 5),
      mkAcq(new Date(Date.UTC(2025, 0, 2)).getTime() / 1000, 3),
    ]
    expect(totalOreSitesForMonth(acqs, 2025, 0)).toBe(8)
  })

  it('returns 0 for empty', () => {
    expect(totalOreSitesForMonth([], 2025, 0)).toBe(0)
  })
})

describe('totalScansForMonth', () => {
  it('returns count of acquisitions in month', () => {
    const acqs: Acquisition[] = [
      mkAcq(new Date(Date.UTC(2025, 0, 1)).getTime() / 1000, 1),
      mkAcq(new Date(Date.UTC(2025, 0, 2)).getTime() / 1000, 1),
    ]
    expect(totalScansForMonth(acqs, 2025, 0)).toBe(2)
  })
})

describe('uniqueDaysForMonth', () => {
  it('counts unique days', () => {
    const acqs: Acquisition[] = [
      mkAcq(new Date(Date.UTC(2025, 0, 1, 10, 0)).getTime() / 1000, 1),
      mkAcq(new Date(Date.UTC(2025, 0, 1, 14, 0)).getTime() / 1000, 1),
      mkAcq(new Date(Date.UTC(2025, 0, 2)).getTime() / 1000, 1),
    ]
    expect(uniqueDaysForMonth(acqs, 2025, 0)).toBe(2)
  })
})

describe('avgOreSitesPerScanForMonth', () => {
  it('returns average as string', () => {
    const acqs: Acquisition[] = [
      mkAcq(new Date(Date.UTC(2025, 0, 1)).getTime() / 1000, 4),
      mkAcq(new Date(Date.UTC(2025, 0, 2)).getTime() / 1000, 6),
    ]
    expect(avgOreSitesPerScanForMonth(acqs, 2025, 0)).toBe('5.0')
  })

  it('returns em dash for empty month', () => {
    expect(avgOreSitesPerScanForMonth([], 2025, 0)).toBe('—')
  })
})

describe('lastOreFound', () => {
  it('returns em dash for empty', () => {
    expect(lastOreFound([])).toBe('—')
  })

  it('returns Just now for recent timestamp', () => {
    const ts = Math.floor(Date.now() / 1000) - 30
    expect(lastOreFound([mkAcq(ts, 1)])).toBe('Just now')
  })

  it('returns time ago for older timestamp', () => {
    const ts = Math.floor(Date.now() / 1000) - 90
    expect(lastOreFound([mkAcq(ts, 1)])).toMatch(/\d+m ago/)
  })
})
