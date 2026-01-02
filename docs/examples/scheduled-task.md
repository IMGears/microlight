# Scheduled Task Example

Run a task automatically on a schedule.

## Task file

Create `tasks/daily-cleanup.task.js`:

```js
module.exports = {
    slug: 'daily_cleanup',
    name: 'Daily Cleanup',
    description: 'Cleans up temporary files daily',
    is_enabled: true,

    schedule: {
        schedule: '0 2 * * *',      // Run at 2:00 AM
        is_enabled: true,
        timezone: 'Asia/Kolkata',
        inputs: {
            days_to_keep: 7          // Default input for scheduled runs
        }
    },

    inputs: {
        days_to_keep: {
            name: 'Days to Keep',
            description: 'Files older than this will be deleted',
            type: 'number',
            default: 7,
            required: true
        }
    },

    fn: async function (ml, inputs) {
        ml.info(`Cleaning up files older than ${inputs.days_to_keep} days...`);

        // Simulated cleanup logic
        const filesDeleted = Math.floor(Math.random() * 50);

        ml.log(`Found ${filesDeleted} files to delete`);
        await ml.wait(1000);

        ml.markdown(`
## Cleanup Summary

| Metric | Value |
|--------|-------|
| Days threshold | ${inputs.days_to_keep} |
| Files deleted | ${filesDeleted} |
| Status | Complete |
        `);

        ml.success('Cleanup complete!');

        return { deleted: filesDeleted };
    }
}
```

## Schedule configuration

```js
schedule: {
    schedule: '0 2 * * *',      // Cron expression
    is_enabled: true,           // Must be true to run
    timezone: 'Asia/Kolkata',   // Timezone for cron
    inputs: {                   // Default inputs for scheduled runs
        days_to_keep: 7
    }
}
```

## Common cron expressions

| Expression | Description |
|------------|-------------|
| `0 2 * * *` | Daily at 2:00 AM |
| `0 9 * * 1-5` | Weekdays at 9:00 AM |
| `0 0 1 * *` | First of each month at midnight |
| `*/30 * * * *` | Every 30 minutes |
| `0 6,18 * * *` | At 6 AM and 6 PM |

## Manual vs scheduled runs

- **Manual runs:** User provides inputs via UI
- **Scheduled runs:** Uses `schedule.inputs` as defaults

You can still run a scheduled task manually with different inputs.

## See also

- [Scheduling](/docs/guide/scheduling.md) - Full scheduling reference
- [Cron syntax](/docs/guide/scheduling.md#cron-syntax) - Cron expression guide
