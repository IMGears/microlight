# Monitoring Dashboard

The monitoring dashboard provides visibility into task execution.

## Location

`packages/core/src/app/monitoring/`

## Features

### Overview Page

Displays aggregate statistics:

- Total runs
- Success/failure rates
- Recent activity

### Task Metrics

Per-task statistics:

- Run count
- Success rate
- Average duration
- Last run status

## Server Actions

**Location:** `packages/core/src/app/monitoring/action.js`

### getOverviewData()

Returns aggregate statistics for the dashboard:

```javascript
const overview = await getOverviewData();
// {
//   totalRuns: 150,
//   successRate: 0.95,
//   failedToday: 2,
//   ...
// }
```

### getTasksData()

Returns per-task metrics:

```javascript
const tasks = await getTasksData();
// [
//   { slug: 'my_task', runs: 50, successRate: 0.98 },
//   ...
// ]
```

## Database Queries

### Run statistics

```javascript
const stats = await Runs.findAll({
    attributes: [
        'status',
        [fn('COUNT', col('id')), 'count']
    ],
    group: ['status']
});
```

### Recent failures

```javascript
const failures = await Runs.findAll({
    where: { status: 'failed' },
    order: [['created_at', 'DESC']],
    limit: 10,
    include: [{ model: Logs, where: { type: 'error' } }]
});
```

## UI Components

| Component | Purpose |
|-----------|---------|
| `OverviewCards` | Summary statistics cards |
| `TaskTable` | List of tasks with metrics |
| `RunHistory` | Recent run timeline |
| `StatusChart` | Success/failure pie chart |

## Related Docs

- [Database Schema](/docs/internal/database-schema.md) - Runs and Logs tables
- [Architecture](/docs/internal/architecture.md) - System overview
