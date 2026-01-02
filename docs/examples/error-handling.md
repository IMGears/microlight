# Error Handling Example

Handle errors gracefully in your tasks.

## Task file

Create `tasks/safe-process.task.js`:

```js
module.exports = {
    slug: 'safe_process',
    name: 'Safe Process',
    description: 'Demonstrates error handling patterns',
    is_enabled: true,

    inputs: {
        should_fail: {
            name: 'Simulate Failure',
            description: 'Set to true to simulate an error',
            type: 'dropdown',
            options: [
                { label: 'No', value: 'false' },
                { label: 'Yes', value: 'true' }
            ],
            default: 'false'
        }
    },

    fn: async function (ml, inputs) {
        ml.info('Starting safe process...');

        try {
            ml.log('Step 1: Validating input...');
            await ml.wait(500);
            ml.success('Input validated');

            ml.log('Step 2: Processing data...');
            await ml.wait(500);

            if (inputs.should_fail === 'true') {
                throw new Error('Simulated processing error');
            }

            ml.success('Data processed');

            ml.log('Step 3: Saving results...');
            await ml.wait(500);
            ml.success('Results saved');

            ml.success('All steps completed successfully!');
            return { status: 'success' };

        } catch (error) {
            ml.error(error);
            ml.danger('Task failed! See error above.');

            // You can still return useful info
            return {
                status: 'failed',
                error: error.message
            };
        }
    }
}
```

## Error handling patterns

### Basic try-catch

```js
try {
    // risky operation
} catch (error) {
    ml.error(error);
    ml.danger('Operation failed');
}
```

### With cleanup

```js
fn: async function (ml, inputs) {
    let connection;

    try {
        connection = await connect();
        // do work
        ml.success('Done');
    } catch (error) {
        ml.error(error);
    } finally {
        if (connection) {
            await connection.close();
            ml.log('Connection closed');
        }
    }
}
```

### Partial success

```js
fn: async function (ml, inputs) {
    const results = { success: 0, failed: 0 };

    for (const item of items) {
        try {
            await processItem(item);
            results.success++;
        } catch (error) {
            ml.warn(`Failed to process: ${item.id}`);
            results.failed++;
        }
    }

    if (results.failed > 0) {
        ml.warn(`Completed with ${results.failed} failures`);
    } else {
        ml.success('All items processed');
    }

    return results;
}
```

## Output methods for errors

| Method | Use case |
|--------|----------|
| `ml.error(err)` | Display error object/message |
| `ml.danger(msg)` | Alert-style error message |
| `ml.warn(msg)` | Non-fatal warning |

## See also

- [ML Functions](/docs/guide/ml-functions.md) - All output methods
- [Troubleshooting](/docs/guide/troubleshooting.md) - Common issues
