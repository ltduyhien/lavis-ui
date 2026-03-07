import type { Acquisition } from '@/shared/api/endpoints'
import {
  groupAcquisitions,
  filterAcquisitionsForSinglePeriod,
  getAvailableGroupBy,
  GROUP_LABELS,
} from './groupAcquisitions'

const mkAcq = (ts: number, ore_sites: number): Acquisition => ({ timestamp: ts, ore_sites })

const day1 = new Date(Date.UTC(2025, 0, 1, 12, 0, 0)).getTime() / 1000
const day2 = new Date(Date.UTC(2025, 0, 2, 12, 0, 0)).getTime() / 1000
const day3 = new Date(Date.UTC(2025, 0, 3, 12, 0, 0)).getTime() / 1000

describe('groupAcquisitions', () => {
  it('returns empty when no acquisitions', () => {
    expect(groupAcquisitions([], 'day', 0)).toEqual({
      data: [],
      canPrev: false,
      canNext: false,
    })
  })

  it('groups by day and returns data', () => {
    const acqs: Acquisition[] = [
      mkAcq(day1, 5),
      mkAcq(day1, 3),
      mkAcq(day2, 2),
    ]
    const result = groupAcquisitions(acqs, 'day', 0)
    expect(result.data.length).toBeGreaterThan(0)
    expect(result.data.some((d) => d.oreSites === 8)).toBe(true)
    expect(result.data.some((d) => d.scanCount === 2)).toBe(true)
  })

  it('returns canPrev false when at start', () => {
    const acqs: Acquisition[] = [mkAcq(day1, 1), mkAcq(day2, 1), mkAcq(day3, 1)]
    const r = groupAcquisitions(acqs, 'day', 0)
    expect(r.canPrev).toBe(false)
  })
})

describe('filterAcquisitionsForSinglePeriod', () => {
  it('returns empty when no acquisitions', () => {
    expect(filterAcquisitionsForSinglePeriod([], 'day', 0)).toEqual({
      acquisitions: [],
      label: '',
      canPrev: false,
      canNext: false,
    })
  })

  it('returns most recent period for offset 0', () => {
    const acqs: Acquisition[] = [mkAcq(day1, 1), mkAcq(day2, 2), mkAcq(day3, 3)]
    const result = filterAcquisitionsForSinglePeriod(acqs, 'day', 0)
    expect(result.acquisitions).toHaveLength(1)
    expect(result.acquisitions[0].ore_sites).toBe(3)
    expect(result.label).toBeTruthy()
  })

  it('returns previous period for offset -1', () => {
    const acqs: Acquisition[] = [mkAcq(day1, 1), mkAcq(day2, 2), mkAcq(day3, 3)]
    const result = filterAcquisitionsForSinglePeriod(acqs, 'day', -1)
    expect(result.acquisitions).toHaveLength(1)
    expect(result.acquisitions[0].ore_sites).toBe(2)
  })
})

describe('getAvailableGroupBy', () => {
  it('returns day only for empty', () => {
    expect(getAvailableGroupBy([])).toEqual(['day'])
  })

  it('adds week when span >= 7 days', () => {
    const base = day1
    const acqs: Acquisition[] = [
      mkAcq(base, 1),
      mkAcq(base + 8 * 86400, 1),
    ]
    expect(getAvailableGroupBy(acqs)).toContain('week')
  })

  it('adds month when span >= 31 days', () => {
    const acqs: Acquisition[] = [
      mkAcq(day1, 1),
      mkAcq(day1 + 35 * 86400, 1),
    ]
    expect(getAvailableGroupBy(acqs)).toContain('month')
  })

  it('adds year when span >= 365 days', () => {
    const acqs: Acquisition[] = [
      mkAcq(day1, 1),
      mkAcq(day1 + 400 * 86400, 1),
    ]
    expect(getAvailableGroupBy(acqs)).toContain('year')
  })
})

describe('GROUP_LABELS', () => {
  it('has labels for each group type', () => {
    expect(GROUP_LABELS.day).toBe('By Day')
    expect(GROUP_LABELS.week).toBe('By Week')
    expect(GROUP_LABELS.month).toBe('By Month')
    expect(GROUP_LABELS.year).toBe('By Year')
  })
})
