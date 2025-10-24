'use server';

import microlightDB from '../../database/microlight/index.js';

export async function getOverviewData() {
  try {
    // Get overview statistics
    const total_runs_result = await microlightDB.sequelize.query(
      'SELECT COUNT(*) as count FROM runs',
      { type: microlightDB.sequelize.QueryTypes.SELECT }
    );

    const status_stats_result = await microlightDB.sequelize.query(
      `SELECT
        status,
        COUNT(*) as count
      FROM runs
      GROUP BY status`,
      { type: microlightDB.sequelize.QueryTypes.SELECT }
    );

    const recent_failures_result = await microlightDB.sequelize.query(
      `SELECT COUNT(*) as count
      FROM runs
      WHERE status = 'failed'
        AND created_at >= datetime('now', '-24 hours')`,
      { type: microlightDB.sequelize.QueryTypes.SELECT }
    );

    const total_runs = total_runs_result[0]?.count || 0;
    const successful_runs = status_stats_result.find(s => s.status === 'complete')?.count || 0;
    const running_tasks = status_stats_result.find(s => s.status === 'running')?.count || 0;
    const recent_failures = recent_failures_result[0]?.count || 0;

    const success_rate = total_runs > 0 ? (successful_runs / total_runs) * 100 : 0;

    return {
      totalRuns: total_runs,
      successRate: success_rate,
      runningTasks: running_tasks,
      recentFailures: recent_failures,
      statusBreakdown: status_stats_result
    };
  } catch (error) {
    console.error('Error fetching overview:', error);
    throw new Error('Failed to fetch overview data');
  }
}

export async function getTasksData() {
  try {
    // Get task statistics
    const task_stats_result = await microlightDB.sequelize.query(
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

    return task_stats_result.map(task => ({
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

    let where_clause = '';
    const where_conditions = [];

    if (status && status !== 'all') {
      where_conditions.push(`status = '${status}'`);
    }

    if (task && task.trim() !== '') {
      where_conditions.push(`task LIKE '%${task}%'`);
    }

    if (where_conditions.length > 0) {
      where_clause = `WHERE ${where_conditions.join(' AND ')}`;
    }

    const runs_result = await microlightDB.sequelize.query(
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
      ${where_clause}
      ORDER BY started_at DESC
      LIMIT ${limit}`,
      { type: microlightDB.sequelize.QueryTypes.SELECT }
    );

    return runs_result;
  } catch (error) {
    console.error('Error fetching runs:', error);
    throw new Error('Failed to fetch runs data');
  }
}

export async function getLogsData(filters = {}) {
  try {
    const { runId, type, limit = 100 } = filters;

    let where_clause = '';
    const where_conditions = [];

    if (runId) {
      where_conditions.push(`run = ${runId}`);
    }

    if (type && type !== 'all') {
      where_conditions.push(`type = '${type}'`);
    }

    if (where_conditions.length > 0) {
      where_clause = `WHERE ${where_conditions.join(' AND ')}`;
    }

    const logs_result = await microlightDB.sequelize.query(
      `SELECT
        l.id,
        l.created_at,
        l.type,
        l.content,
        l.run,
        r.task
      FROM logs l
      LEFT JOIN runs r ON l.run = r.id
      ${where_clause}
      ORDER BY l.created_at DESC
      LIMIT ${limit}`,
      { type: microlightDB.sequelize.QueryTypes.SELECT }
    );

    return logs_result;
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw new Error('Failed to fetch logs data');
  }
}