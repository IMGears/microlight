'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  Sheet,
  Button,
  Select,
  Option,
  Input,
  Chip,
  IconButton
} from '@mui/joy';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getOverviewData, getTasksData, getRunsData, getLogsData } from './actions';

export default function MonitoringDashboard() {
  const [overview, setOverview] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [recentRuns, setRecentRuns] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    task: '',
    dateRange: '24h'
  });

  const fetchOverview = async () => {
    try {
      const data = await getOverviewData();
      setOverview(data);
    } catch (error) {
      console.error('Failed to fetch overview:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const data = await getTasksData();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const fetchRecentRuns = async () => {
    try {
      const data = await getRunsData({
        status: filters.status,
        task: filters.task,
        limit: 50
      });
      setRecentRuns(data);
    } catch (error) {
      console.error('Failed to fetch recent runs:', error);
    }
  };

  const fetchLogs = async () => {
    try {
      const data = await getLogsData({ limit: 100 });
      setLogs(data);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchOverview(),
      fetchTasks(),
      fetchRecentRuns(),
      fetchLogs()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    refreshAll();
  }, [filters]);

  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(refreshAll, 30000); // Refresh every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'complete': return 'success';
      case 'failed': return 'danger';
      case 'running': return 'primary';
      case 'pending': return 'neutral';
      default: return 'neutral';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'complete': return <CheckCircleIcon />;
      case 'failed': return <ErrorIcon />;
      case 'running': return <PlayArrowIcon />;
      case 'pending': return <StopIcon />;
      default: return <StopIcon />;
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading && !overview) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography level="h2">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography level="h2">Task Monitoring Dashboard</Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            variant={autoRefresh ? 'solid' : 'outlined'}
            color={autoRefresh ? 'primary' : 'neutral'}
            onClick={() => setAutoRefresh(!autoRefresh)}
            size="sm"
          >
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
          <IconButton
            variant="outlined"
            onClick={refreshAll}
            loading={loading}
            size="sm"
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Overview Cards */}
      {overview && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography level="title-sm" color="neutral">Total Runs</Typography>
                <Typography level="h2">{overview.totalRuns?.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography level="title-sm" color="success">Success Rate</Typography>
                <Typography level="h2" color="success">
                  {overview.successRate ? `${overview.successRate.toFixed(1)}%` : 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography level="title-sm" color="primary">Running Tasks</Typography>
                <Typography level="h2" color="primary">{overview.runningTasks || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography level="title-sm" color="danger">Failed (24h)</Typography>
                <Typography level="h2" color="danger">{overview.recentFailures || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <Select
          value={filters.status}
          onChange={(_, value) => setFilters(prev => ({ ...prev, status: value }))}
          size="sm"
          sx={{ minWidth: 120 }}
        >
          <Option value="all">All Status</Option>
          <Option value="complete">Complete</Option>
          <Option value="failed">Failed</Option>
          <Option value="running">Running</Option>
          <Option value="pending">Pending</Option>
        </Select>

        <Input
          placeholder="Filter by task name..."
          value={filters.task}
          onChange={(e) => setFilters(prev => ({ ...prev, task: e.target.value }))}
          size="sm"
          sx={{ minWidth: 200 }}
          startDecorator={<SearchIcon />}
        />

        <Select
          value={filters.dateRange}
          onChange={(_, value) => setFilters(prev => ({ ...prev, dateRange: value }))}
          size="sm"
          sx={{ minWidth: 100 }}
        >
          <Option value="1h">Last Hour</Option>
          <Option value="24h">Last 24h</Option>
          <Option value="7d">Last 7 days</Option>
          <Option value="30d">Last 30 days</Option>
        </Select>
      </Box>

      {/* Task Statistics Table */}
      <Box sx={{ mb: 4 }}>
        <Typography level="h3" sx={{ mb: 2 }}>Task Statistics</Typography>
        <Sheet sx={{ borderRadius: 'sm', overflow: 'auto' }}>
          <Table>
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Total Runs</th>
                <th>Success Rate</th>
                <th>Last Run</th>
                <th>Status</th>
                <th>Avg Duration</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.task}>
                  <td>
                    <Typography level="body-sm" fontWeight="md">
                      {task.task}
                    </Typography>
                  </td>
                  <td>{task.totalRuns}</td>
                  <td>
                    <Typography
                      level="body-sm"
                      color={task.successRate > 90 ? 'success' : task.successRate > 70 ? 'warning' : 'danger'}
                    >
                      {task.successRate.toFixed(1)}%
                    </Typography>
                  </td>
                  <td>
                    <Typography level="body-sm">
                      {formatDate(task.lastRun)}
                    </Typography>
                  </td>
                  <td>
                    <Chip
                      color={getStatusColor(task.lastStatus)}
                      size="sm"
                      startDecorator={getStatusIcon(task.lastStatus)}
                    >
                      {task.lastStatus}
                    </Chip>
                  </td>
                  <td>
                    <Typography level="body-sm">
                      {formatDuration(task.avgDuration)}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Sheet>
      </Box>

      {/* Recent Runs */}
      <Box sx={{ mb: 4 }}>
        <Typography level="h3" sx={{ mb: 2 }}>Recent Runs</Typography>
        <Sheet sx={{ borderRadius: 'sm', overflow: 'auto', maxHeight: 400 }}>
          <Table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Status</th>
                <th>Started</th>
                <th>Duration</th>
                <th>Triggered By</th>
              </tr>
            </thead>
            <tbody>
              {recentRuns.map((run) => (
                <tr key={run.id}>
                  <td>
                    <Typography level="body-sm" fontWeight="md">
                      {run.task}
                    </Typography>
                  </td>
                  <td>
                    <Chip
                      color={getStatusColor(run.status)}
                      size="sm"
                      startDecorator={getStatusIcon(run.status)}
                    >
                      {run.status}
                    </Chip>
                  </td>
                  <td>
                    <Typography level="body-sm">
                      {formatDate(run.started_at)}
                    </Typography>
                  </td>
                  <td>
                    <Typography level="body-sm">
                      {formatDuration(run.duration)}
                    </Typography>
                  </td>
                  <td>
                    <Chip size="sm" variant="outlined">
                      {run.triggered_by}
                    </Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Sheet>
      </Box>

      {/* Recent Logs */}
      <Box>
        <Typography level="h3" sx={{ mb: 2 }}>Recent Logs</Typography>
        <Sheet sx={{ borderRadius: 'sm', p: 2, maxHeight: 300, overflow: 'auto', bgcolor: 'neutral.50' }}>
          {logs.map((log) => (
            <Box key={log.id} sx={{ mb: 1, fontFamily: 'monospace', fontSize: 'sm' }}>
              <Typography level="body-xs" color="neutral">
                [{formatDate(log.created_at)}] [{log.type}]
              </Typography>
              <Typography level="body-sm" sx={{ whiteSpace: 'pre-wrap' }}>
                {log.content}
              </Typography>
            </Box>
          ))}
        </Sheet>
      </Box>
    </Box>
  );
}