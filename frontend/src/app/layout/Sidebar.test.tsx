import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Sidebar } from './Sidebar'

const mockLogout = jest.fn()
jest.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    userId: 'alice',
    loginAt: Date.now(),
    logout: mockLogout,
  }),
}))

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
)

describe('Sidebar', () => {
  beforeEach(() => mockLogout.mockClear())

  it('renders L4RV1S link to activities', () => {
    render(<Sidebar />, { wrapper })
    const link = screen.getByRole('link', { name: /L4RV1S/i })
    expect(link.getAttribute('href')).toBe('/activities')
  })

  it('renders nav items', () => {
    render(<Sidebar />, { wrapper })
    expect(screen.getByRole('link', { name: /Activities/i })).toBeTruthy()
    expect(screen.getByRole('link', { name: /Reporting/i })).toBeTruthy()
    expect(screen.getByRole('link', { name: /Settings/i })).toBeTruthy()
  })

  it('renders user section when authenticated', () => {
    render(<Sidebar />, { wrapper })
    expect(screen.getByText('Alice')).toBeTruthy()
    expect(screen.getByRole('button', { name: /Log out/i })).toBeTruthy()
  })

  it('calls logout when Log out clicked', () => {
    render(<Sidebar />, { wrapper })
    fireEvent.click(screen.getByRole('button', { name: /Log out/i }))
    expect(mockLogout).toHaveBeenCalledTimes(1)
  })
})
