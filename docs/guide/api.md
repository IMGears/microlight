# API

Trigger tasks programmatically via HTTP API.

## Trigger a task

```
POST /api/tasks/[slug]
```

### Query parameters

Pass task inputs as query parameters:

```shell
curl -X POST "http://localhost:3000/api/tasks/my_task?date=2025-01-15&count=10"
```

### Request body

Alternatively, pass inputs in the request body:

```shell
curl -X POST "http://localhost:3000/api/tasks/my_task" \
  -H "Content-Type: application/json" \
  -d '{"date": "2025-01-15", "count": 10}'
```

### Response

```json
{
  "status": "started",
  "runId": "run_abc123"
}
```

## Examples

### Basic trigger

```shell
curl -X POST "http://localhost:3000/api/tasks/send_daily_report"
```

### With parameters

```shell
curl -X POST "http://localhost:3000/api/tasks/process_data?date=2025-01-15&environment=staging"
```

### Bulk execution

See [Bulk Execution](/docs/examples/bulk-execution.md) for running multiple tasks.

## Error responses

| Status | Description |
|--------|-------------|
| 200 | Task triggered successfully |
| 404 | Task not found |
| 400 | Invalid parameters |
| 500 | Server error |

## Authentication

TODO: Document authentication if/when implemented

## Related docs

- [Bulk Execution](/docs/examples/bulk-execution.md) - Run multiple tasks via API
- [Writing Tasks](/docs/guide/writing-tasks.md) - Task structure and configuration
- [Input Types](/docs/guide/inputs.md) - Available input types
