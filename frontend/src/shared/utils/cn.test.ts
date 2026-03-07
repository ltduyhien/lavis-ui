import { cn } from './cn'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    const show = true
    const hide = false
    expect(cn('base', show && 'active', hide && 'hidden')).toBe('base active')
  })

  it('handles undefined and null', () => {
    expect(cn('base', undefined, null)).toBe('base')
  })

  it('resolves Tailwind conflicts via twMerge', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('py-2 py-6')).toBe('py-6')
  })
})
