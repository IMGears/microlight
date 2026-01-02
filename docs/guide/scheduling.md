# Scheduling Tasks

Run tasks automatically on a schedule using cron expressions.

## Basic configuration

```js
module.exports = {
    slug: 'daily_report',
    name: 'Daily Report',
    is_enabled: true,
    schedule: {
        schedule: '0 9 * * *',    // Run at 9:00 AM
        is_enabled: true,
        timezone: 'Asia/Kolkata',
        inputs: {
            // default inputs for scheduled runs
        }
    },
    fn: async function (ml, inputs) {
        // task logic
    }
}
```

## Schedule properties

| Property | Description | Required | Default |
|----------|-------------|----------|---------|
| `schedule` | Cron expression | Yes | - |
| `is_enabled` | Enable/disable the schedule | No | `false` |
| `timezone` | Timezone for cron interpretation | No | `utc` |
| `inputs` | Default input values for scheduled runs | No | `{}` |

## Cron syntax

```
┌───────────── minute (0-59)
│ ┌───────────── hour (0-23)
│ │ ┌───────────── day of month (1-31)
│ │ │ ┌───────────── month (1-12)
│ │ │ │ ┌───────────── day of week (0-6, Sunday=0)
│ │ │ │ │
* * * * *
```

## Examples

| Expression | Description |
|------------|-------------|
| `0 9 * * *` | Every day at 9:00 AM |
| `30 6,12 * * *` | Every day at 6:30 AM and 12:30 PM |
| `0 0 * * 1` | Every Monday at midnight |
| `*/15 * * * *` | Every 15 minutes |
| `0 9 1 * *` | First day of every month at 9:00 AM |

## Timezone

Set `ML_CRON_TIMEZONE` environment variable or specify per-task:

```js
schedule: {
    schedule: '0 9 * * *',
    timezone: 'Asia/Kolkata',  // IST
    is_enabled: true
}
```

Common timezones:
- `Asia/Kolkata` - India Standard Time
- `America/New_York` - US Eastern
- `Europe/London` - UK
- `UTC` - Coordinated Universal Time

## Related docs

- [Writing Tasks](/docs/guide/writing-tasks.md) - Full task configuration
- [Scheduled Task Example](/docs/examples/scheduled-task.md) - Practical example
- [Troubleshooting](/docs/guide/troubleshooting.md) - Schedule not running?
