import { render, screen } from '@testing-library/react'
import { ReportsPage } from './ReportsPage'

jest.mock('@/features/acquisitions/hooks/useAcquisitionsPolling', () => ({
  useAcquisitionsPolling: () => ({
    acquisitions: [],
    isLoading: false,
    error: new Error('Failed to load'),
  }),
}))

jest.mock('@/features/reports', () => ({
  getAvailableMonths: () => [],
  monthKey: () => '',
  MONTH_NAMES: [],
  ReportEditForm: () => null,
  ReportFormActions: () => null,
  ReportMonthNav: () => null,
  ReportViewContent: () => null,
  useReportForm: () => ({}),
  useReports: () => ({ reports: {}, updateReport: jest.fn() }),
}))

describe('ReportsPage (error state)', () => {
  it('shows error message when useAcquisitionsPolling returns error', () => {
    render(<ReportsPage />)
    expect(screen.getByText(/Failed to load data/)).toBeTruthy()
    expect(screen.getByText(/Failed to load/)).toBeTruthy()
  })
})
