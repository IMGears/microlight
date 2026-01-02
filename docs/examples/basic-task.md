# Basic Task Example

A complete walkthrough of creating your first Microlight task.

## Create the task file

Create `tasks/hello-world.task.js`:

```js
module.exports = {
    slug: 'hello_world',
    name: 'Hello World',
    description: 'A simple greeting task',
    is_enabled: true,

    fn: async function (ml, inputs) {
        ml.log('Starting Hello World task...');

        ml.info('This is an info message');
        ml.success('Hello, World!');

        ml.markdown(`
## Task Complete

This task demonstrates basic ml.* functions:
- \`ml.log()\` for plain messages
- \`ml.info()\` for informational messages
- \`ml.success()\` for success messages
- \`ml.markdown()\` for formatted content
        `);

        return 'completed';
    }
}
```

## Run the task

1. Start the dev server: `npm run dev`
2. Open http://localhost:3000
3. Find "Hello World" in the task list
4. Click "Run"

## What you'll see

The UI will display:
1. "Starting Hello World task..." (plain log)
2. "This is an info message" (blue info box)
3. "Hello, World!" (green success box)
4. Formatted markdown with the summary

## Next steps

- [Task with Inputs](/docs/examples/task-with-inputs.md) - Accept user input
- [Scheduled Task](/docs/examples/scheduled-task.md) - Run on a schedule
- [ML Functions](/docs/guide/ml-functions.md) - All available output methods
