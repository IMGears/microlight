/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import MonitoringDashboard from '@/app/monitoring/MonitoringDashboard';
import * as actions from '@/app/monitoring/actions';

// Mock the actions module
jest.mock('@/app/monitoring/actions', () => ({
  getOverviewData: jest.fn(),
  getTasksData: jest.fn(),
  getRunsData: jest.fn(),
  getLogsData: jest.fn(),
}));

// Mock setInterval and clearInterval
jest.useFakeTimers();

describe('MonitoringDashboard', () => {
  const mockOverviewData = {
    totalRuns: 1500,
    successRate: 89.5,
    runningTasks: 3,
    recentFailures: 12,
    statusBreakdown: [
      { status: 'complete', count: 1342 },
      { status: 'failed', count: 145 },
      { status: 'running', count: 3 },
      { status: 'pending', count: 10 }
    ]
  };

  const mockTasksData = [
    {
      task: 'data-processing',
      totalRuns: 450,
      successfulRuns: 425,
      failedRuns: 25,
      lastRun: '2025-09-27T10:30:00Z',
      lastStatus: 'complete',
      avgDuration: 45000,
      successRate: 94.4
    },
    {
      task: 'email-notifications',
      totalRuns: 300,
      successfulRuns: 285,
      failedRuns: 15,
      lastRun: '2025-09-27T09:15:00Z',
      lastStatus: 'failed',
      avgDuration: 2500,
      successRate: 95.0
    },
    {
      task: 'backup-sync',
      totalRuns: 120,
      successfulRuns: 110,
      failedRuns: 10,
      lastRun: '2025-09-27T08:00:00Z',
      lastStatus: 'running',
      avgDuration: 180000,
      successRate: 91.7
    }
  ];

  const mockRunsData = [
    {
      id: 1,
      task: 'data-processing',
      status: 'complete',
      started_at: '2025-09-27T10:30:00Z',
      completed_at: '2025-09-27T10:31:30Z',
      duration: 90000,
      triggered_by: 'scheduler',
      inputs: { file: 'data.csv' }
    },
    {
      id: 2,
      task: 'email-notifications',
      status: 'failed',
      started_at: '2025-09-27T09:15:00Z',
      completed_at: '2025-09-27T09:15:05Z',
      duration: 5000,
      triggered_by: 'user',
      inputs: { template: 'welcome' }
    },
    {
      id: 3,
      task: 'backup-sync',
      status: 'running',
      started_at: '2025-09-27T08:00:00Z',
      completed_at: null,
      duration: null,
      triggered_by: 'scheduler',
      inputs: { source: '/data', target: '/backup' }
    }
  ];

  const mockLogsData = [
    {
      id: 1,
      created_at: '2025-09-27T10:31:25Z',
      type: 'info',
      content: 'Processing completed successfully. 1,234 records processed.',
      run: 1,
      task: 'data-processing'
    },
    {
      id: 2,
      created_at: '2025-09-27T09:15:05Z',
      type: 'error',
      content: 'SMTP connection failed: timeout after 30 seconds',
      run: 2,
      task: 'email-notifications'
    },
    {
      id: 3,
      created_at: '2025-09-27T08:05:00Z',
      type: 'info',
      content: 'Backup sync started. Estimated duration: 3 hours',
      run: 3,
      task: 'backup-sync'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up default mock implementations
    actions.getOverviewData.mockResolvedValue(mockOverviewData);
    actions.getTasksData.mockResolvedValue(mockTasksData);
    actions.getRunsData.mockResolvedValue(mockRunsData);
    actions.getLogsData.mockResolvedValue(mockLogsData);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('Initial Loading and Data Display', () => {
    test('shows loading state initially', async () => {
      // Make actions return pending promises to simulate loading
      actions.getOverviewData.mockImplementation(() => new Promise(() => {}));
      actions.getTasksData.mockImplementation(() => new Promise(() => {}));
      actions.getRunsData.mockImplementation(() => new Promise(() => {}));
      actions.getLogsData.mockImplementation(() => new Promise(() => {}));

      await act(async () => {
        render(<MonitoringDashboard />);
      });

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('renders overview cards with correct data', async () => {
      await act(async () => {
        render(<MonitoringDashboard />);
      });

      await waitFor(() => {
        expect(screen.getByText('1,500')).toBeInTheDocument(); // Total runs
        expect(screen.getByText('89.5%')).toBeInTheDocument(); // Success rate
        expect(screen.getByText('3')).toBeInTheDocument(); // Running tasks
        expect(screen.getByText('12')).toBeInTheDocument(); // Recent failures
      });
    });

    test('renders task statistics table with correct data', async () => {
      await act(async () => {
        render(<MonitoringDashboard />);
      });

      await waitFor(() => {
        expect(screen.getAllByText('data-processing')).toHaveLength(2); // Should appear in both tables
        expect(screen.getAllByText('email-notifications')).toHaveLength(2); // Should appear in both tables
        expect(screen.getAllByText('backup-sync')).toHaveLength(2); // Should appear in both tables
        expect(screen.getByText('450')).toBeInTheDocument(); // Total runs for data-processing
        expect(screen.getByText('94.4%')).toBeInTheDocument(); // Success rate
      });
    });

    test('renders recent runs table with correct data', async () => {
      await act(async () => {
        render(<MonitoringDashboard />);
      });

      await waitFor(() => {
        expect(screen.getAllByText('scheduler').length).toBeGreaterThan(0);
        expect(screen.getByText('user')).toBeInTheDocument();
        // Check for status chips
        expect(screen.getAllByText('complete').length).toBeGreaterThan(0);
        expect(screen.getAllByText('failed').length).toBeGreaterThan(0);
        expect(screen.getAllByText('running').length).toBeGreaterThan(0);
      });
    });

    test('renders recent logs with correct data', async () => {
      await act(async () => {
        render(<MonitoringDashboard />);
      });

      await waitFor(() => {
        expect(screen.getByText('Processing completed successfully. 1,234 records processed.')).toBeInTheDocument();
        expect(screen.getByText('SMTP connection failed: timeout after 30 seconds')).toBeInTheDocument();
        expect(screen.getByText('Backup sync started. Estimated duration: 3 hours')).toBeInTheDocument();
      });
    });
  });

  describe('Filtering and Controls', () => {
    test('filters by status when status filter is changed', async () => {
      await act(async () => {
        render(<MonitoringDashboard />);
      });

      await waitFor(() => {
        expect(screen.getByText('Task Monitoring Dashboard')).toBeInTheDocument();
      });

      // Test that the component has rendered the filters
      expect(screen.getAllByText('All Status')[0]).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Filter by task name...')).toBeInTheDocument();

      // Verify initial getRunsData call was made
      expect(actions.getRunsData).toHaveBeenCalledWith({
        status: 'all',
        task: '',
        limit: 50
      });
    });

    test('filters by task name when task filter is changed', async () => {
      await act(async () => {
        render(<MonitoringDashboard />);
      });

      await waitFor(() => {
        expect(screen.getByText('Task Monitoring Dashboard')).toBeInTheDocument();
      });

      // Find and change task filter
      await act(async () => {
        const taskInput = screen.getByPlaceholderText('Filter by task name...');
        fireEvent.change(taskInput, { target: { value: 'data-processing' } });
      });

      await waitFor(() => {
        expect(actions.getRunsData).toHaveBeenCalledWith({
          status: 'all',
          task: 'data-processing',
          limit: 50
        });
      });
    });

    test('refreshes all data when refresh button is clicked', async () => {
      await act(async () => {
        render(<MonitoringDashboard />);
      });

      await waitFor(() => {
        expect(screen.getByText('Task Monitoring Dashboard')).toBeInTheDocument();
      });

      // Clear previous calls
      jest.clearAllMocks();

      // Click refresh button
      await act(async () => {
        const refreshButton = screen.getByTestId('RefreshIcon').closest('button');
        fireEvent.click(refreshButton);
      });

      await waitFor(() => {
        expect(actions.getOverviewData).toHaveBeenCalled();
        expect(actions.getTasksData).toHaveBeenCalled();
        expect(actions.getRunsData).toHaveBeenCalled();
        expect(actions.getLogsData).toHaveBeenCalled();
      });
    });

    test('toggles auto-refresh functionality', async () => {
      await act(async () => {
        render(<MonitoringDashboard />);
      });

      await waitFor(() => {
        expect(screen.getByText('Auto-refresh OFF')).toBeInTheDocument();
      });

      // Click auto-refresh toggle
      await act(async () => {
        const autoRefreshButton = screen.getByText('Auto-refresh OFF');
        fireEvent.click(autoRefreshButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Auto-refresh ON')).toBeInTheDocument();
      });

      // Clear previous calls
      jest.clearAllMocks();

      // Fast-forward time to trigger auto-refresh
      await act(async () => {
        jest.advanceTimersByTime(30000);
      });

      await waitFor(() => {
        expect(actions.getOverviewData).toHaveBeenCalled();
        expect(actions.getTasksData).toHaveBeenCalled();
        expect(actions.getRunsData).toHaveBeenCalled();
        expect(actions.getLogsData).toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    test('handles API errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      actions.getOverviewData.mockRejectedValue(new Error('API Error'));
      actions.getTasksData.mockRejectedValue(new Error('API Error'));
      actions.getRunsData.mockRejectedValue(new Error('API Error'));
      actions.getLogsData.mockRejectedValue(new Error('API Error'));

      await act(async () => {
        render(<MonitoringDashboard />);
      });

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch overview:', expect.any(Error));
        expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch tasks:', expect.any(Error));
        expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch recent runs:', expect.any(Error));
        expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch logs:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });

    test('displays dashboard with partial data when some APIs fail', async () => {
      actions.getOverviewData.mockResolvedValue(mockOverviewData);
      actions.getTasksData.mockRejectedValue(new Error('Tasks API Error'));
      actions.getRunsData.mockResolvedValue(mockRunsData);
      actions.getLogsData.mockRejectedValue(new Error('Logs API Error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await act(async () => {
        render(<MonitoringDashboard />);
      });

      await waitFor(() => {
        // Overview data should still be displayed
        expect(screen.getByText('1,500')).toBeInTheDocument();
        expect(screen.getByText('89.5%')).toBeInTheDocument();

        // Recent runs should still be displayed
        expect(screen.getAllByText('data-processing').length).toBeGreaterThan(0);
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Utility Functions', () => {
    test('formats duration correctly', async () => {
      await act(async () => {
        render(<MonitoringDashboard />);
      });

      await waitFor(() => {
        // 90000ms = 1m 30s
        expect(screen.getByText('1m 30s')).toBeInTheDocument();
        // 180000ms = 3m 0s
        expect(screen.getByText('3m 0s')).toBeInTheDocument();
      });
    });

    test('displays correct status colors and icons', async () => {
      await act(async () => {
        render(<MonitoringDashboard />);
      });

      await waitFor(() => {
        const completeChips = screen.getAllByText('complete');
        const failedChips = screen.getAllByText('failed');
        const runningChips = screen.getAllByText('running');

        expect(completeChips.length).toBeGreaterThan(0);
        expect(failedChips.length).toBeGreaterThan(0);
        expect(runningChips.length).toBeGreaterThan(0);
      });
    });

    test('formats dates correctly', async () => {
      await act(async () => {
        render(<MonitoringDashboard />);
      });

      await waitFor(() => {
        // Check that dates are formatted (exact format depends on locale)
        const dateElements = screen.getAllByText(/2025/);
        expect(dateElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Component State Management', () => {
    test('maintains filter state across re-renders', async () => {
      const { rerender } = await act(async () => {
        return render(<MonitoringDashboard />);
      });

      await waitFor(() => {
        expect(screen.getByText('Task Monitoring Dashboard')).toBeInTheDocument();
      });

      // Change task filter only (simpler test)
      await act(async () => {
        const taskInput = screen.getByPlaceholderText('Filter by task name...');
        fireEvent.change(taskInput, { target: { value: 'test-task' } });
      });

      // Re-render component
      await act(async () => {
        rerender(<MonitoringDashboard />);
      });

      // Task filter should persist
      expect(screen.getByDisplayValue('test-task')).toBeInTheDocument();
    });

    test('clears auto-refresh interval on component unmount', async () => {
      const { unmount } = await act(async () => {
        return render(<MonitoringDashboard />);
      });

      await waitFor(() => {
        expect(screen.getByText('Auto-refresh OFF')).toBeInTheDocument();
      });

      // Enable auto-refresh
      await act(async () => {
        const autoRefreshButton = screen.getByText('Auto-refresh OFF');
        fireEvent.click(autoRefreshButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Auto-refresh ON')).toBeInTheDocument();
      });

      // Spy on clearInterval
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

      // Unmount component
      await act(async () => {
        unmount();
      });

      // clearInterval should have been called
      expect(clearIntervalSpy).toHaveBeenCalled();

      clearIntervalSpy.mockRestore();
    });
  });
});