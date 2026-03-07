import { linearRegression } from './math'

describe('linearRegression', () => {
  it('returns empty array for empty input', () => {
    expect(linearRegression([])).toEqual([])
  })

  it('returns single value for single input', () => {
    expect(linearRegression([5])).toEqual([5])
  })

  it('returns regression values for a series', () => {
    const values = [1, 2, 3, 4, 5]
    const result = linearRegression(values)
    expect(result).toHaveLength(5)
    expect(result[0]).toBeCloseTo(1)
    expect(result[4]).toBeCloseTo(5)
  })

  it('handles constant series', () => {
    const values = [3, 3, 3, 3]
    const result = linearRegression(values)
    expect(result.every((v) => v === 3)).toBe(true)
  })
})
