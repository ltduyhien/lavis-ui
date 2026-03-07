jest.mock('@/shared/api/api-config', () => ({ getApiBaseUrl: () => '/api' }))

import { login, getAcquisitions } from '@/shared/api/endpoints'

const originalFetch = global.fetch

describe('API endpoints (integration)', () => {
  afterEach(() => {
    global.fetch = originalFetch
  })

  it('login parses token response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ access: 'jwt-token' }),
    })

    const result = await login({ user_id: 'alice', password: '1234' })

    expect(result.access).toBe('jwt-token')
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/token'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ user_id: 'alice', password: '1234' }),
      })
    )
  })

  it('login throws on 401', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: () => Promise.resolve('Unauthorized'),
    })

    await expect(login({ user_id: 'alice', password: 'wrong' })).rejects.toMatchObject({
      message: 'Unauthorized',
      status: 401,
    })
  })

  it('getAcquisitions returns empty array for non-array response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(null),
    })

    const result = await getAcquisitions()
    expect(result).toEqual([])
  })

  it('getAcquisitions normalizes ore_sites from sites', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([{ timestamp: 1000, sites: 5 }]),
    })

    const result = await getAcquisitions()
    expect(result).toEqual([{ timestamp: 1000, ore_sites: 5 }])
  })
})
