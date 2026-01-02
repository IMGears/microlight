# ML Functions

The `ml` object is passed to your task function and provides methods to output feedback to the UI.

## Quick reference

| Method | Purpose |
|--------|---------|
| `ml.log(message)` | General log message |
| `ml.markdown(content)` | Formatted markdown content |
| `ml.json(object)` | Display JSON data |
| `ml.info(message)` | Informational message (blue) |
| `ml.success(message)` | Success message (green) |
| `ml.warn(message)` | Warning message (yellow) |
| `ml.danger(message)` | Danger message (red) |
| `ml.error(error)` | Error message/object |
| `ml.wait(ms)` | Pause execution |

## ml.log

Send a plain log message to the UI.

```js
fn: async function (ml, inputs) {
    ml.log('Starting task...');
    ml.log(`Processing ${inputs.count} items`);
}
```

## ml.markdown

Send formatted markdown content to the UI.

```js
fn: async function (ml, inputs) {
    ml.markdown(`
## Results

| Name | Status |
|------|--------|
| Item 1 | Done |
| Item 2 | Pending |
    `);
}
```

## ml.json

Display a JSON object in the UI (formatted and collapsible).

```js
fn: async function (ml, inputs) {
    const result = { count: 10, status: 'complete' };
    ml.json(result);
}
```

## ml.info

Display an informational message (blue styling).

```js
fn: async function (ml, inputs) {
    ml.info('Task is running in dry-run mode');
}
```

## ml.success

Display a success message (green styling).

```js
fn: async function (ml, inputs) {
    ml.success('All 50 records processed successfully!');
}
```

## ml.warn

Display a warning message (yellow styling).

```js
fn: async function (ml, inputs) {
    ml.warn('3 records were skipped due to missing data');
}
```

## ml.danger

Display a danger/alert message (red styling).

```js
fn: async function (ml, inputs) {
    ml.danger('Critical: Database connection lost');
}
```

## ml.error

Display an error message or error object.

```js
fn: async function (ml, inputs) {
    try {
        // some operation
    } catch (err) {
        ml.error(err);
        ml.error('Failed to process the file');
    }
}
```

## ml.wait

Pause task execution for specified milliseconds.

```js
fn: async function (ml, inputs) {
    ml.log('Starting...');
    await ml.wait(2000); // wait 2 seconds
    ml.log('Continuing after pause');
}
```

## Full example

```js
module.exports = {
    slug: 'process_data',
    name: 'Process Data',
    is_enabled: true,
    inputs: {
        count: { name: 'Count', type: 'number', default: 10 }
    },
    fn: async function (ml, inputs) {
        ml.info(`Processing ${inputs.count} items...`);

        for (let i = 0; i < inputs.count; i++) {
            ml.log(`Processing item ${i + 1}`);
            await ml.wait(100);
        }

        ml.markdown(`
## Summary
- Processed: **${inputs.count}** items
- Status: Complete
        `);

        ml.success('All done!');
        return { processed: inputs.count };
    }
}
```

## Related docs

- [Writing Tasks](/docs/guide/writing-tasks.md) - Task structure and configuration
- [Basic Task](/docs/examples/basic-task.md) - Simple example using ml functions
- [Error Handling](/docs/examples/error-handling.md) - Using ml.error and ml.danger
