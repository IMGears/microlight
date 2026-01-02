# Input Types

Microlight supports the following input types:

- `string` - Text input
- `number` - Numeric input
- `date` - Date picker
- `file` - File upload
- `dropdown` - Select from options

## Common properties

| Property | Description | Required | Default |
|----------|-------------|----------|---------|
| `name` | Human readable label | Yes | - |
| `description` | Help text for the user | No | - |
| `type` | Input type (see above) | Yes | - |
| `required` | Force user to provide value | No | `false` |
| `default` | Default value | No | - |
| `placeholder` | Placeholder text | No | - |

## String

```js
inputs: {
    name: {
        name: 'Name',
        description: 'Name of the person',
        default: 'World',
        placeholder: 'Your name',
        type: 'string',
        required: false
    }
}
```

## Number

```js
inputs: {
    count: {
        name: 'Count',
        description: 'Number of items to process',
        type: 'number',
        default: 10,
        required: true
    }
}
```

## Date

```js
inputs: {
    date: {
        name: 'Date',
        description: 'Date to process',
        default: '2025-01-08',
        placeholder: 'Select a date',
        type: 'date',
        required: true
    }
}
```

## File

```js
inputs: {
    csv_file: {
        name: 'CSV File',
        description: 'Upload the data file',
        type: 'file',
        required: true
    }
}
```

## Dropdown

```js
inputs: {
    environment: {
        name: 'Environment',
        description: 'Select target environment',
        type: 'dropdown',
        options: [
            { label: 'Development', value: 'dev' },
            { label: 'Staging', value: 'staging' },
            { label: 'Production', value: 'prod' }
        ],
        default: 'dev',
        required: true
    }
}
```

## Related docs

- [Writing Tasks](/docs/guide/writing-tasks.md) - Full task configuration
- [Task with Inputs](/docs/examples/task-with-inputs.md) - Practical example
- [ML Functions](/docs/guide/ml-functions.md) - Output feedback to users
