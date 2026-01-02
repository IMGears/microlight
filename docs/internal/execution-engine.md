# Execution Engine

The execution engine handles running tasks and managing their lifecycle.

## Location

`packages/core/src/lib/executeRun.js`

## Execution Pipeline

Uses `async.auto` for dependency management:

```
startRun
    │
    ▼ (dependency)
executeTask
    │
    ▼ (dependency)
updateRun
```

## Pipeline Steps

### 1. startRun

Updates the run status in the database:

```javascript
// Update run to 'running' state
await Runs.update({
    status: 'running',
    started_at: new Date()
}, { where: { id: run.id } });
```

### 2. executeTask

Loads and executes the task function:

```javascript
// Get full task definition (metadata + function)
const taskDef = await getTaskDetails({ slug: run.task });

// Generate ml.* display functions for this run
const ml = generateDisplayFunctions(run.id);

// Execute the task
try {
    await taskDef.fn(ml, run.inputs);
    return 'complete';
} catch (error) {
    ml.error(error);
    return 'failed';
}
```

### 3. updateRun

Records completion status and duration:

```javascript
await Runs.update({
    status: taskResult,  // 'complete' or 'failed'
    completed_at: new Date(),
    duration: Date.now() - startTime
}, { where: { id: run.id } });
```

## Run Lifecycle

```
pending → running → complete
                 ↘ failed
                 ↘ timeout
```

| Status | Description |
|--------|-------------|
| `pending` | Run created, waiting to start |
| `running` | Task function is executing |
| `complete` | Task finished successfully |
| `failed` | Task threw an error |
| `timeout` | Task exceeded time limit |

## Triggered By

Runs track how they were initiated:

| Value | Source |
|-------|--------|
| `user` | UI button click |
| `api` | POST /api/tasks/[slug] |
| `schedule` | Cron job |
| `webhook` | External webhook (future) |

## Display Functions (ml object)

Generated per-run by `generateDisplayFunctions.js`:

```javascript
const ml = {
    log: (text) => createLog(run_id, 'log', text),
    json: (data) => createLog(run_id, 'json', JSON.stringify(data)),
    markdown: (text) => createLog(run_id, 'markdown', text),
    error: (err) => createLog(run_id, 'error', err.stack || err.message),
    info: (text) => createLog(run_id, 'info', text),
    warn: (text) => createLog(run_id, 'warn', text),
    danger: (text) => createLog(run_id, 'danger', text),
    success: (text) => createLog(run_id, 'success', text),
    wait: (ms) => new Promise(resolve => setTimeout(resolve, ms))
};
```

Each method writes to the `Logs` table with the appropriate type.

## Error Handling

Errors in task functions are caught and logged:

```javascript
try {
    await taskDef.fn(ml, run.inputs);
} catch (error) {
    ml.error(error);  // Logs stack trace
    return 'failed';
}
```

The run is marked as `failed` but the system continues operating.

## Related Docs

- [Task Discovery](/docs/internal/task-discovery.md)
- [Database Schema](/docs/internal/database-schema.md)
- [ML Functions](/docs/guide/ml-functions.md) (user-facing)
