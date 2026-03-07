import { isApiError, getApiErrorMessage } from './error-utils'

describe('isApiError', () => {
  it('returns true for valid ApiError shape', () => {
    expect(isApiError({ message: 'Not found', status: 404 })).toBe(true)
  })

  it('returns false for Error instance', () => {
    expect(isApiError(new Error('fail'))).toBe(false)
  })

  it('returns false for null', () => {
    expect(isApiError(null)).toBe(false)
  })

  it('returns false for object missing message', () => {
    expect(isApiError({ status: 404 })).toBe(false)
  })

  it('returns false for object missing status', () => {
    expect(isApiError({ message: 'err' })).toBe(false)
  })

  it('returns false for wrong types', () => {
    expect(isApiError({ message: 123, status: 404 })).toBe(false)
    expect(isApiError({ message: 'err', status: '404' })).toBe(false)
  })
})

describe('getApiErrorMessage', () => {
  it('returns message for ApiError', () => {
    expect(getApiErrorMessage({ message: 'Server error', status: 500 })).toBe('Server error')
  })

  it('returns message for Error', () => {
    expect(getApiErrorMessage(new Error('Network failed'))).toBe('Network failed')
  })

  it('returns fallback for unknown', () => {
    expect(getApiErrorMessage(null)).toBe('Request failed')
    expect(getApiErrorMessage('string')).toBe('Request failed')
  })

  it('uses custom fallback', () => {
    expect(getApiErrorMessage(null, 'Something went wrong')).toBe('Something went wrong')
  })
})
