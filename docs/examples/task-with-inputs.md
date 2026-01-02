# Task with Inputs Example

Accept user input in your task.

## Task file

Create `tasks/greet-user.task.js`:

```js
module.exports = {
    slug: 'greet_user',
    name: 'Greet User',
    description: 'Greets a user by name',
    is_enabled: true,

    inputs: {
        name: {
            name: 'Your Name',
            description: 'Enter your name',
            type: 'string',
            default: 'World',
            placeholder: 'e.g., John',
            required: true
        },
        greeting_count: {
            name: 'Number of Greetings',
            description: 'How many times to greet',
            type: 'number',
            default: 3,
            required: false
        },
        date: {
            name: 'Date',
            description: 'Date for the greeting',
            type: 'date',
            required: false
        }
    },

    fn: async function (ml, inputs) {
        ml.info(`Greeting ${inputs.name}...`);

        const count = inputs.greeting_count || 1;

        for (let i = 0; i < count; i++) {
            ml.log(`Hello, ${inputs.name}! (${i + 1}/${count})`);
            await ml.wait(500);
        }

        if (inputs.date) {
            ml.log(`Date selected: ${inputs.date}`);
        }

        ml.success(`Greeted ${inputs.name} ${count} times!`);

        return { name: inputs.name, count };
    }
}
```

## Input types demonstrated

| Input | Type | Features |
|-------|------|----------|
| `name` | string | Required, has default and placeholder |
| `greeting_count` | number | Optional with default |
| `date` | date | Optional date picker |

## UI behavior

- Required fields show validation if empty
- Default values pre-populate the form
- Placeholder text guides the user

## Accessing inputs

Inputs are available in `fn` via the `inputs` object:

```js
inputs.name           // string value
inputs.greeting_count // number value
inputs.date           // date string (YYYY-MM-DD)
```

## See also

- [Input Types](/docs/guide/inputs.md) - All input types and options
- [Scheduled Task](/docs/examples/scheduled-task.md) - Provide default inputs for schedules
