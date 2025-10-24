/**
 * Tests for monitoring actions that interact with the database
 */
import { getOverviewData, getTasksData, getRunsData, getLogsData } from '@/app/monitoring/action';
import microlightDB from '@/database/microlight/index.js';

// Mock the database
jest.mock('@/database/microlight/index.js', () => ({
  sequelize: {
    query: jest.fn(),
    QueryTypes: {
      SELECT: 'SELECT'
    }
  }
}));

describe('Monitoring Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('getOverviewData', () => {
    test('returns correct overview statistics with mocked data', async () => {
      // Mock database responses
      microlightDB.sequelize.query
        .mockResolvedValueOnce([{ count: 1500 }]) // Total runs
        .mockResolvedValueOnce([ // Status breakdown
          { status: 'complete', count: 1200 },
          { status: 'failed', count: 200 },
          { status: 'running', count: 50 },
          { status: 'pending', count: 50 }
        ])
        .mockResolvedValueOnce([{ count: 25 }]); // Recent failures

      const result = await getOverviewData();

      expect(result).toEqual({
        totalRuns: 1500,
        successRate: 80, // 1200/1500 * 100
        runningTasks: 50,
        recentFailures: 25,
        statusBreakdown: [
          { status: 'complete', count: 1200 },
          { status: 'failed', count: 200 },
          { status: 'running', count: 50 },
          { status: 'pending', count: 50 }
        ]
      });

      expect(microlightDB.sequelize.query).toHaveBeenCalledTimes(3);
    });

    test('handles empty database correctly', async () => {
      microlightDB.sequelize.query
        .mockResolvedValueOnce([{ count: 0 }]) // Total runs
        .mockResolvedValueOnce([]) // Status breakdown
        .mockResolvedValueOnce([{ count: 0 }]); // Recent failures

      const result = await getOverviewData();

      expect(result).toEqual({
        totalRuns: 0,
        successRate: 0,
        runningTasks: 0,
        recentFailures: 0,
        statusBreakdown: []
      });
    });

    test('handles database errors gracefully', async () => {
      microlightDB.sequelize.query.mockRejectedValue(new Error('Database connection failed'));

      await expect(getOverviewData()).rejects.toThrow('Failed to fetch overview data');
      expect(console.error).toHaveBeenCalledWith('Error fetching overview:', expect.any(Error));
    });

    test('handles missing data fields correctly', async () => {
      microlightDB.sequelize.query
        .mockResolvedValueOnce([]) // Empty total runs
        .mockResolvedValueOnce([
          { status: 'complete', count: 100 }
        ])
        .mockResolvedValueOnce([]); // Empty recent failures

      const result = await getOverviewData();

      expect(result).toEqual({
        totalRuns: 0,
        successRate: 0,
        runningTasks: 0,
        recentFailures: 0,
        statusBreakdown: [{ status: 'complete', count: 100 }]
      });
    });
  });

  describe('getTasksData', () => {
    test('returns task statistics with calculated success rates', async () => {
      const mockTaskStats = [
        {
          task: 'data-processing',
          totalRuns: 1000,
          successfulRuns: 950,
          failedRuns: 50,
          lastRun: '2025-09-27T10:30:00Z',
          lastStatus: 'complete',
          avgDuration: 45000
        },
        {
          task: 'email-notifications',
          totalRuns: 500,
          successfulRuns: 475,
          failedRuns: 25,
          lastRun: '2025-09-27T09:15:00Z',
          lastStatus: 'failed',
          avgDuration: 2500
        },
        {
          task: 'backup-sync',
          totalRuns: 100,
          successfulRuns: 95,
          failedRuns: 5,
          lastRun: '2025-09-27T08:00:00Z',
          lastStatus: 'running',
          avgDuration: 180000
        }
      ];

      microlightDB.sequelize.query.mockResolvedValue(mockTaskStats);

      const result = await getTasksData();

      expect(result).toEqual([
        {
          ...mockTaskStats[0],
          successRate: 95 // 950/1000 * 100
        },
        {
          ...mockTaskStats[1],
          successRate: 95 // 475/500 * 100
        },
        {
          ...mockTaskStats[2],
          successRate: 95 // 95/100 * 100
        }
      ]);

      expect(microlightDB.sequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        { type: 'SELECT' }
      );
    });

    test('handles tasks with zero runs', async () => {
      const mockTaskStats = [
        {
          task: 'new-task',
          totalRuns: 0,
          successfulRuns: 0,
          failedRuns: 0,
          lastRun: null,
          lastStatus: null,
          avgDuration: null
        }
      ];

      microlightDB.sequelize.query.mockResolvedValue(mockTaskStats);

      const result = await getTasksData();

      expect(result[0].successRate).toBe(0);
    });

    test('handles database errors in task statistics', async () => {
      microlightDB.sequelize.query.mockRejectedValue(new Error('Query failed'));

      await expect(getTasksData()).rejects.toThrow('Failed to fetch task statistics');
      expect(console.error).toHaveBeenCalledWith('Error fetching task statistics:', expect.any(Error));
    });
  });

  describe('getRunsData', () => {
    test('returns runs data without filters', async () => {
      const mockRuns = [
        {
          id: 1,
          task: 'data-processing',
          status: 'complete',
          started_at: '2025-09-27T10:30:00Z',
          completed_at: '2025-09-27T10:31:30Z',
          duration: 90000,
          triggered_by: 'scheduler',
          inputs: '{"file": "data.csv"}'
        },
        {
          id: 2,
          task: 'email-notifications',
          status: 'failed',
          started_at: '2025-09-27T09:15:00Z',
          completed_at: '2025-09-27T09:15:05Z',
          duration: 5000,
          triggered_by: 'user',
          inputs: '{"template": "welcome"}'
        }
      ];

      microlightDB.sequelize.query.mockResolvedValue(mockRuns);

      const result = await getRunsData();

      expect(result).toEqual(mockRuns);
      expect(microlightDB.sequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY started_at DESC'),
        { type: 'SELECT' }
      );
    });

    test('applies status filter correctly', async () => {
      const mockRuns = [
        {
          id: 2,
          task: 'email-notifications',
          status: 'failed',
          started_at: '2025-09-27T09:15:00Z',
          completed_at: '2025-09-27T09:15:05Z',
          duration: 5000,
          triggered_by: 'user',
          inputs: '{"template": "welcome"}'
        }
      ];

      microlightDB.sequelize.query.mockResolvedValue(mockRuns);

      const result = await getRunsData({ status: 'failed' });

      expect(result).toEqual(mockRuns);
      expect(microlightDB.sequelize.query).toHaveBeenCalledWith(
        expect.stringContaining("WHERE status = 'failed'"),
        { type: 'SELECT' }
      );
    });

    test('applies task filter correctly', async () => {
      const mockRuns = [
        {
          id: 1,
          task: 'data-processing',
          status: 'complete',
          started_at: '2025-09-27T10:30:00Z',
          completed_at: '2025-09-27T10:31:30Z',
          duration: 90000,
          triggered_by: 'scheduler',
          inputs: '{"file": "data.csv"}'
        }
      ];

      microlightDB.sequelize.query.mockResolvedValue(mockRuns);

      const result = await getRunsData({ task: 'data' });

      expect(result).toEqual(mockRuns);
      expect(microlightDB.sequelize.query).toHaveBeenCalledWith(
        expect.stringContaining("WHERE task LIKE '%data%'"),
        { type: 'SELECT' }
      );
    });

    test('applies multiple filters correctly', async () => {
      microlightDB.sequelize.query.mockResolvedValue([]);

      await getRunsData({ status: 'failed', task: 'email', limit: 10 });

      expect(microlightDB.sequelize.query).toHaveBeenCalledWith(
        expect.stringContaining("WHERE status = 'failed' AND task LIKE '%email%'"),
        { type: 'SELECT' }
      );
    });

    test('ignores "all" status filter', async () => {
      microlightDB.sequelize.query.mockResolvedValue([]);

      await getRunsData({ status: 'all' });

      const queryCall = microlightDB.sequelize.query.mock.calls[0][0];
      expect(queryCall).not.toContain('WHERE');
    });

    test('handles database errors in runs data', async () => {
      microlightDB.sequelize.query.mockRejectedValue(new Error('Query failed'));

      await expect(getRunsData()).rejects.toThrow('Failed to fetch runs data');
      expect(console.error).toHaveBeenCalledWith('Error fetching runs:', expect.any(Error));
    });
  });

  describe('getLogsData', () => {
    test('returns logs data without filters', async () => {
      const mockLogs = [
        {
          id: 1,
          created_at: '2025-09-27T10:31:25Z',
          type: 'info',
          content: 'Processing completed successfully',
          run: 1,
          task: 'data-processing'
        },
        {
          id: 2,
          created_at: '2025-09-27T09:15:05Z',
          type: 'error',
          content: 'SMTP connection failed',
          run: 2,
          task: 'email-notifications'
        }
      ];

      microlightDB.sequelize.query.mockResolvedValue(mockLogs);

      const result = await getLogsData();

      expect(result).toEqual(mockLogs);
      expect(microlightDB.sequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('LEFT JOIN runs r ON l.run = r.id'),
        { type: 'SELECT' }
      );
    });

    test('applies runId filter correctly', async () => {
      const mockLogs = [
        {
          id: 1,
          created_at: '2025-09-27T10:31:25Z',
          type: 'info',
          content: 'Processing completed successfully',
          run: 1,
          task: 'data-processing'
        }
      ];

      microlightDB.sequelize.query.mockResolvedValue(mockLogs);

      const result = await getLogsData({ runId: 1 });

      expect(result).toEqual(mockLogs);
      expect(microlightDB.sequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE run = 1'),
        { type: 'SELECT' }
      );
    });

    test('applies type filter correctly', async () => {
      const mockLogs = [
        {
          id: 2,
          created_at: '2025-09-27T09:15:05Z',
          type: 'error',
          content: 'SMTP connection failed',
          run: 2,
          task: 'email-notifications'
        }
      ];

      microlightDB.sequelize.query.mockResolvedValue(mockLogs);

      const result = await getLogsData({ type: 'error' });

      expect(result).toEqual(mockLogs);
      expect(microlightDB.sequelize.query).toHaveBeenCalledWith(
        expect.stringContaining("WHERE type = 'error'"),
        { type: 'SELECT' }
      );
    });

    test('applies multiple filters correctly', async () => {
      microlightDB.sequelize.query.mockResolvedValue([]);

      await getLogsData({ runId: 1, type: 'error', limit: 25 });

      expect(microlightDB.sequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE run = 1 AND type = \'error\''),
        { type: 'SELECT' }
      );
    });

    test('ignores "all" type filter', async () => {
      microlightDB.sequelize.query.mockResolvedValue([]);

      await getLogsData({ type: 'all' });

      const queryCall = microlightDB.sequelize.query.mock.calls[0][0];
      expect(queryCall).not.toContain('WHERE');
    });

    test('handles database errors in logs data', async () => {
      microlightDB.sequelize.query.mockRejectedValue(new Error('Query failed'));

      await expect(getLogsData()).rejects.toThrow('Failed to fetch logs data');
      expect(console.error).toHaveBeenCalledWith('Error fetching logs:', expect.any(Error));
    });

    test('uses correct default limit', async () => {
      microlightDB.sequelize.query.mockResolvedValue([]);

      await getLogsData();

      expect(microlightDB.sequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT 100'),
        { type: 'SELECT' }
      );
    });

    test('uses custom limit when provided', async () => {
      microlightDB.sequelize.query.mockResolvedValue([]);

      await getLogsData({ limit: 50 });

      expect(microlightDB.sequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT 50'),
        { type: 'SELECT' }
      );
    });
  });

  describe('SQL Injection Prevention', () => {
    test('properly handles task name with special characters', async () => {
      microlightDB.sequelize.query.mockResolvedValue([]);

      await getRunsData({ task: "'; DROP TABLE runs; --" });

      const queryCall = microlightDB.sequelize.query.mock.calls[0][0];
      expect(queryCall).toContain("task LIKE '%'; DROP TABLE runs; --%'");
    });

    test('properly handles status with special characters', async () => {
      microlightDB.sequelize.query.mockResolvedValue([]);

      await getRunsData({ status: "complete'; DROP TABLE runs; --" });

      const queryCall = microlightDB.sequelize.query.mock.calls[0][0];
      expect(queryCall).toContain("status = 'complete'; DROP TABLE runs; --'");
    });
  });
});