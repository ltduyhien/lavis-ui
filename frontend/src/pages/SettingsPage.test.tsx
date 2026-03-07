import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SettingsPage } from './SettingsPage'

const mockChangePassword = jest.fn()
jest.mock('@/features/settings/hooks/useChangePassword', () => ({
  useChangePassword: () => ({
    changePassword: mockChangePassword,
    isLoading: false,
  }),
}))

describe('SettingsPage', () => {
  beforeEach(() => mockChangePassword.mockReset())

  it('renders page header and sections', () => {
    render(<SettingsPage />)
    expect(screen.getByText('Settings')).toBeTruthy()
    expect(screen.getByText('Larvis Humor Setting')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Change Password' })).toBeTruthy()
  })

  it('renders humor slider', () => {
    render(<SettingsPage />)
    const slider = screen.getByRole('slider', { name: /Humor level/i })
    expect(slider).toBeTruthy()
  })

  it('shows error when passwords do not match', async () => {
    render(<SettingsPage />)
    fireEvent.change(screen.getByLabelText(/Old password/i), { target: { value: 'old' } })
    fireEvent.change(screen.getByLabelText(/New password/i), { target: { value: 'new' } })
    fireEvent.change(screen.getByLabelText(/Password confirmation/i), {
      target: { value: 'different' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Change Password/i }))

    expect(await screen.findByText('New password and confirmation do not match.')).toBeTruthy()
    expect(mockChangePassword).not.toHaveBeenCalled()
  })

  it('shows success alert when change succeeds', async () => {
    mockChangePassword.mockResolvedValue({ success: true, error: null })
    render(<SettingsPage />)

    fireEvent.change(screen.getByLabelText(/Old password/i), { target: { value: 'old' } })
    fireEvent.change(screen.getByLabelText(/New password/i), { target: { value: 'new' } })
    fireEvent.change(screen.getByLabelText(/Password confirmation/i), {
      target: { value: 'new' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Change Password/i }))

    await waitFor(() => {
      expect(screen.getByText('Password changed')).toBeTruthy()
    })
  })

  it('shows error alert when change fails', async () => {
    mockChangePassword.mockResolvedValue({ success: false, error: 'Incorrect old password.' })
    render(<SettingsPage />)

    fireEvent.change(screen.getByLabelText(/Old password/i), { target: { value: 'wrong' } })
    fireEvent.change(screen.getByLabelText(/New password/i), { target: { value: 'new' } })
    fireEvent.change(screen.getByLabelText(/Password confirmation/i), {
      target: { value: 'new' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Change Password/i }))

    await waitFor(() => {
      expect(screen.getByText('Incorrect old password.')).toBeTruthy()
    })
  })
})
