'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Search, Play, Square, AlertCircle, CheckCircle } from 'lucide-react';
import { getOverviewData, getTasksData, getRunsData, getLogsData } from './action';
import { Typography } from '@/components/ui/typography';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

  const DEFAULT_RUNS_LIMIT = 50;
  const DEFAULT_LOGS_LIMIT = 100;

  const fetchRecentRuns = async () => {
    try {
      const data = await getRunsData({
        status: filters.status,
        task: filters.task,
        limit: DEFAULT_RUNS_LIMIT
      });
      setRecentRuns(data);
    } catch (error) {
      console.error('Failed to fetch recent runs:', error);
    }
  };

  const fetchLogs = async () => {
    try {
      const data = await getLogsData({ limit: DEFAULT_LOGS_LIMIT });
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

  const REFRESH_INTERVAL = 30000; // Refresh every 30 seconds

  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(refreshAll, REFRESH_INTERVAL);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'complete': return 'success';
      case 'failed': return 'destructive';
      case 'running': return 'default';
      case 'pending': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'complete': return <CheckCircle className="h-3 w-3" />;
      case 'failed': return <AlertCircle className="h-3 w-3" />;
      case 'running': return <Play className="h-3 w-3" />;
      case 'pending': return <Square className="h-3 w-3" />;
      default: return <Square className="h-3 w-3" />;
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
      <div className="p-6">
        <Typography level="h2">Loading...</Typography>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <Typography level="h2">Task Monitoring Dashboard</Typography>
        <div className="flex gap-2 items-center">
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            onClick={() => setAutoRefresh(!autoRefresh)}
            size="sm"
          >
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
          <Button
            variant="outline"
            onClick={refreshAll}
            loading={loading}
            size="icon"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      {overview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <Typography level="title-sm" color="muted">Total Runs</Typography>
              <Typography level="h2">{overview.totalRuns?.toLocaleString()}</Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <Typography level="title-sm" color="success">Success Rate</Typography>
              <Typography level="h2" color="success">
                {overview.successRate ? `${overview.successRate.toFixed(1)}%` : 'N/A'}
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <Typography level="title-sm" color="primary">Running Tasks</Typography>
              <Typography level="h2" color="primary">{overview.runningTasks || 0}</Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <Typography level="title-sm" color="danger">Failed (24h)</Typography>
              <Typography level="h2" color="danger">{overview.recentFailures || 0}</Typography>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex gap-4 items-center flex-wrap">
        <Select
          value={filters.status}
          onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
        >
          <SelectTrigger size="sm" className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="complete">Complete</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by task name..."
            value={filters.task}
            onChange={(e) => setFilters(prev => ({ ...prev, task: e.target.value }))}
            size="sm"
            className="pl-8 w-[200px]"
          />
        </div>

        <Select
          value={filters.dateRange}
          onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
        >
          <SelectTrigger size="sm" className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last Hour</SelectItem>
            <SelectItem value="24h">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Task Statistics Table */}
      <div className="mb-8">
        <Typography level="h3" className="mb-4">Task Statistics</Typography>
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task Name</TableHead>
                <TableHead>Total Runs</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Avg Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.task}>
                  <TableCell>
                    <Typography level="body-sm" weight="medium">
                      {task.task}
                    </Typography>
                  </TableCell>
                  <TableCell>{task.totalRuns}</TableCell>
                  <TableCell>
                    <Typography
                      level="body-sm"
                      color={task.successRate > 90 ? 'success' : task.successRate > 70 ? 'warning' : 'danger'}
                    >
                      {task.successRate.toFixed(1)}%
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography level="body-sm">
                      {formatDate(task.lastRun)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(task.lastStatus)} className="gap-1">
                      {getStatusIcon(task.lastStatus)}
                      {task.lastStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Typography level="body-sm">
                      {formatDuration(task.avgDuration)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Recent Runs */}
      <div className="mb-8">
        <Typography level="h3" className="mb-4">Recent Runs</Typography>
        <div className="rounded-md border overflow-auto max-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Triggered By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentRuns.map((run) => (
                <TableRow key={run.id}>
                  <TableCell>
                    <Typography level="body-sm" weight="medium">
                      {run.task}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(run.status)} className="gap-1">
                      {getStatusIcon(run.status)}
                      {run.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Typography level="body-sm">
                      {formatDate(run.started_at)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography level="body-sm">
                      {formatDuration(run.duration)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {run.triggered_by}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Recent Logs */}
      <div>
        <Typography level="h3" className="mb-4">Recent Logs</Typography>
        <div className="rounded-md border p-4 max-h-[300px] overflow-auto bg-muted/30">
          {logs.map((log) => (
            <div key={log.id} className="mb-2 font-mono text-sm">
              <Typography level="body-xs" color="muted">
                [{formatDate(log.created_at)}] [{log.type}]
              </Typography>
              <Typography level="body-sm" className="whitespace-pre-wrap">
                {log.content}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
