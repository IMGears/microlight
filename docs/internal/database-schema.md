# Database Schema

Microlight uses Sequelize ORM with support for SQLite (default) or PostgreSQL.

## Connection

**Location:** `packages/core/src/database/microlight/index.js`

```javascript
// PostgreSQL (if ML_DB_PG is set)
const sequelize = new Sequelize(process.env.ML_DB_PG);

// SQLite (default)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '.microlight/microlight.db'
});
```

## Tables

### Runs

**Location:** `packages/core/src/database/microlight/tables/Runs.model.js`

Tracks task execution history.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER | Primary key, auto-increment |
| `task` | TEXT | Task slug identifier |
| `status` | TEXT | pending, running, complete, failed, timeout |
| `started_at` | DATE | When execution started |
| `completed_at` | DATE | When execution finished |
| `inputs` | JSON | Task input parameters |
| `triggered_by` | TEXT | user, api, webhook, schedule |
| `duration` | INTEGER | Execution time in milliseconds |
| `created_at` | DATE | Record creation timestamp |
| `updated_at` | DATE | Last update timestamp |

**Status values:**

| Status | Description |
|--------|-------------|
| `pending` | Run created, waiting to execute |
| `running` | Task is currently executing |
| `complete` | Task finished successfully |
| `failed` | Task threw an error |
| `timeout` | Task exceeded time limit |

**Triggered by values:**

| Value | Description |
|-------|-------------|
| `user` | Manual trigger via UI |
| `api` | POST /api/tasks/[slug] |
| `schedule` | Cron job |
| `webhook` | External webhook |

### Logs

**Location:** `packages/core/src/database/microlight/tables/Logs.model.js`

Stores output from task execution (ml.* function calls).

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER | Primary key, auto-increment |
| `run` | INTEGER | Foreign key to Runs.id |
| `type` | TEXT | Log type (see below) |
| `content` | TEXT | Log content |
| `created_at` | DATE | Record creation timestamp |

**Log types:**

| Type | Source | Rendering |
|------|--------|-----------|
| `log` | `ml.log()` | Plain text |
| `json` | `ml.json()` | Formatted JSON viewer |
| `markdown` | `ml.markdown()` | Rendered markdown |
| `error` | `ml.error()` | Error with stack trace |
| `info` | `ml.info()` | Blue info box |
| `warn` | `ml.warn()` | Yellow warning box |
| `danger` | `ml.danger()` | Red alert box |
| `success` | `ml.success()` | Green success box |

## Relationships

```
Runs (1) ─────────── (N) Logs
         run_id FK
```

One run has many logs. Logs are ordered by `created_at` to preserve execution order.

## Queries

### Get run with logs

```javascript
const run = await Runs.findByPk(runId, {
    include: [{ model: Logs, as: 'logs' }]
});
```

### Get recent runs for a task

```javascript
const runs = await Runs.findAll({
    where: { task: 'my_task' },
    order: [['created_at', 'DESC']],
    limit: 10
});
```

### Create a log entry

```javascript
await Logs.create({
    run: runId,
    type: 'success',
    content: 'Task completed!'
});
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ML_DB_PG` | PostgreSQL connection string |

If `ML_DB_PG` is not set, SQLite is used with the database file at `.microlight/microlight.db`.

## Migrations

Sequelize handles migrations automatically via `sync()`. Tables are created on first run.

## Related Docs

- [Execution Engine](/docs/internal/execution-engine.md) - How runs are created/updated
- [Architecture](/docs/internal/architecture.md) - System overview
