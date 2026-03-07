import { render, screen } from '@testing-library/react'
import { ReportsPage } from './ReportsPage'

jest.mock('@/features/acquisitions/hooks/useAcquisitionsPolling', () => ({
  useAcquisitionsPolling: () => ({
    acquisitions: [],
    isLoading: false,
    error: null,
  }),
}))

jest.mock('@/features/reports', () => ({
  getAvailableMonths: () => [{ year: 2025, month: 0 }],
  monthKey: (y: number, m: number) => `${y}-${m}`,
  MONTH_NAMES: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ],
  ReportEditForm: () => <div data-testid="report-edit-form">Edit Form</div>,
  ReportFormActions: () => <div data-testid="report-form-actions">Actions</div>,
  ReportMonthNav: () => <div data-testid="report-month-nav">Month Nav</div>,
  ReportViewContent: () => <div data-testid="report-view-content">View</div>,
  useReportForm: () => ({
    customReport: { notes: '', fileNames: [] },
    setCustomReport: jest.fn(),
    files: [],
    rejectReason: null,
    inputRef: { current: null },
    handleFileChange: jest.fn(),
    handleDrop: jest.fn(),
    handleDragOver: jest.fn(),
    removeFile: jest.fn(),
    handleSend: jest.fn(),
    handleReset: jest.fn(),
    resetOnMonthChange: jest.fn(),
  }),
  useReports: () => ({
    reports: {},
    updateReport: jest.fn(),
  }),
}))

describe('ReportsPage', () => {
  it('renders page header', () => {
    render(<ReportsPage />)
    expect(screen.getByText('Reporting')).toBeTruthy()
    expect(screen.getByText(/Monthly reports/)).toBeTruthy()
  })

  it('renders month nav and edit form when no error', () => {
    render(<ReportsPage />)
    expect(screen.getByTestId('report-month-nav')).toBeTruthy()
    expect(screen.getByTestId('report-edit-form')).toBeTruthy()
  })
})
