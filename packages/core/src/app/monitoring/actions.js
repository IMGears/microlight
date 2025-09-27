'use server';

import microlightDB from '../../database/microlight/index.js';

export async function getOverviewData() {
  try {
    // Get overview statistics
    const totalRunsResult = await microlightDB.sequelize.query(
      'SELECT COUNT(*) as count FROM runs',
      { type: microlightDB.sequelize.QueryTypes.SELECT }
    );

    const statusStatsResult = await microlightDB.sequelize.query(
      `SELECT
        status,
        COUNT(*) as count
      FROM runs
      GROUP BY status`,
      { type: microlightDB.sequelize.QueryTypes.SELECT }
    );

    const recentFailuresResult = await microlightDB.sequelize.query(
      `SELECT COUNT(*) as count
      FROM runs
      WHERE status = 'failed'
        AND created_at >= datetime('now', '-24 hours')`,
      { type: microlightDB.sequelize.QueryTypes.SELECT }
    );

    const totalRuns = totalRunsResult[0]?.count || 0;
    const successfulRuns = statusStatsResult.find(s => s.status === 'complete')?.count || 0;
    const runningTasks = statusStatsResult.find(s => s.status === 'running')?.count || 0;
    const recentFailures = recentFailuresResult[0]?.count || 0;

    const successRate = totalRuns > 0 ? (successfulRuns / totalRuns) * 100 : 0;

    return {
      totalRuns,
      successRate,
      runningTasks,
      recentFailures,
      statusBreakdown: statusStatsResult
    };
  } catch (error) {
    console.error('Error fetching overview:', error);
    throw new Error('Failed to fetch overview data');
  }
}

export async function getTasksData() {
  try {
    // Get task statistics
    const taskStatsResult = await microlightDB.sequelize.query(
      `SELECT
        task,
        COUNT(*) as totalRuns,
        COUNT(CASE WHEN status = 'complete' THEN 1 END) as successfulRuns,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failedRuns,
        MAX(started_at) as lastRun,
        (
          SELECT status
          FROM runs r2
          WHERE r2.task = runs.task
          ORDER BY started_at DESC
          LIMIT 1
        ) as lastStatus,
        AVG(duration) as avgDuration
      FROM runs
      GROUP BY task
      ORDER BY totalRuns DESC`,
      { type: microlightDB.sequelize.QueryTypes.SELECT }
    );

    return taskStatsResult.map(task => ({
      ...task,
      successRate: task.totalRuns > 0 ? (task.successfulRuns / task.totalRuns) * 100 : 0
    }));
  } catch (error) {
    console.error('Error fetching task statistics:', error);
    throw new Error('Failed to fetch task statistics');
  }
}

export async function getRunsData(filters = {}) {
  try {
    const { status, task, limit = 50 } = filters;

    let whereClause = '';
    const whereConditions = [];

    if (status && status !== 'all') {
      whereConditions.push(`status = '${status}'`);
    }

    if (task && task.trim() !== '') {
      whereConditions.push(`task LIKE '%${task}%'`);
    }

    if (whereConditions.length > 0) {
      whereClause = `WHERE ${whereConditions.join(' AND ')}`;
    }

    const runsResult = await microlightDB.sequelize.query(
      `SELECT
        id,
        task,
        status,
        started_at,
        completed_at,
        duration,
        triggered_by,
        inputs
      FROM runs
      ${whereClause}
      ORDER BY started_at DESC
      LIMIT ${limit}`,
      { type: microlightDB.sequelize.QueryTypes.SELECT }
    );

    return runsResult;
  } catch (error) {
    console.error('Error fetching runs:', error);
    throw new Error('Failed to fetch runs data');
  }
}

export async function getLogsData(filters = {}) {
  try {
    const { runId, type, limit = 100 } = filters;

    let whereClause = '';
    const whereConditions = [];

    if (runId) {
      whereConditions.push(`run = ${runId}`);
    }

    if (type && type !== 'all') {
      whereConditions.push(`type = '${type}'`);
    }

    if (whereConditions.length > 0) {
      whereClause = `WHERE ${whereConditions.join(' AND ')}`;
    }

    const logsResult = await microlightDB.sequelize.query(
      `SELECT
        l.id,
        l.created_at,
        l.type,
        l.content,
        l.run,
        r.task
      FROM logs l
      LEFT JOIN runs r ON l.run = r.id
      ${whereClause}
      ORDER BY l.created_at DESC
      LIMIT ${limit}`,
      { type: microlightDB.sequelize.QueryTypes.SELECT }
    );

    return logsResult;
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw new Error('Failed to fetch logs data');
  }
}