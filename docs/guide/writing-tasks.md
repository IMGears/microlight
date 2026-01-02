# Writing Tasks

A task is a JavaScript file that exports a configuration object. Task files must be named `*.task.js`.

## Basic structure

```js
module.exports = {
    slug: 'check_duplicate_por_numbers',
    name: 'Check duplicate POR numbers',
    description: 'Check duplicate and missing POR numbers',
    is_enabled: true,
    inputs: {},
    schedule: {
        crontime: '15 08 * * *',
        timezone: 'Asia/Kolkata',
    },
    fn: async function (ml, inputs) {
        // your task logic here
        ml.success('Task completed!');
        return 'all done';
    }
}
```

## Task keys

| Key | Description | Required | Default |
|-----|-------------|----------|---------|
| `slug` | Unique identifier for the task (must be unique across all tasks) | Yes | - |
| `name` | Human readable name displayed in the UI | Yes | - |
| `description` | Brief description shown inline with the task name | No | - |
| `is_enabled` | Enable or disable the task | No | `false` |
| `docs` | Detailed documentation shown in the right sidebar | No | - |
| `inputs` | Input configuration object. See [Input Types](/docs/guide/inputs.md) | No | `{}` |
| `schedule` | Cron schedule configuration. See [Scheduling](/docs/guide/scheduling.md) | No | `{}` |
| `links` | Array of link objects: `{title: 'Docs', href: 'https://...'}` | No | `[]` |
| `fn` | The function executed when the task runs | Yes | - |

## The task function

The `fn` function receives two arguments:

- `ml` - The microlight object for outputting feedback to the UI. See [ML Functions](/docs/guide/ml-functions.md)
- `inputs` - Object containing all user-provided input values

```js
fn: async function (ml, inputs) {
    ml.log(`Processing for date: ${inputs.date}`);

    // your logic here

    ml.success('Done!');
    return 'completed';
}
```

## Inputs

Define inputs to accept user data:

```js
inputs: {
    database: {
        name: 'Database',
        description: 'Database to take dump of',
        type: 'string',
        required: true
    },
    date: {
        name: 'Date',
        type: 'date',
        default: '2025-01-08',
        required: true
    }
}
```

See [Input Types](/docs/guide/inputs.md) for all supported input types.

## Schedule

Run tasks automatically on a schedule:

```js
schedule: {
    schedule: '30 6,12 * * *',
    is_enabled: true,
    timezone: 'Asia/Kolkata',
}
```

| Key | Description | Required | Default |
|-----|-------------|----------|---------|
| `schedule` | Cron expression | Yes | - |
| `is_enabled` | Enable/disable the schedule | No | `false` |
| `inputs` | Default input values for scheduled runs | No | `{}` |
| `timezone` | Timezone for cron interpretation | No | `utc` |

See [Scheduling](/docs/guide/scheduling.md) for more details.

## Links

Add reference links to your task:

```js
links: [
    { title: 'Docs', href: 'https://docs.example.com' },
    { title: 'Dashboard', href: 'https://dashboard.example.com' }
]
```

Links open in a new tab.

## Related docs

- [Input Types](/docs/guide/inputs.md) - All supported input types
- [ML Functions](/docs/guide/ml-functions.md) - Output feedback to users
- [Scheduling](/docs/guide/scheduling.md) - Run tasks on a schedule
- [Basic Task Example](/docs/examples/basic-task.md) - Complete walkthrough
