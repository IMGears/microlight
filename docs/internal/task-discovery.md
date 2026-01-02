# Task Discovery

How Microlight finds and indexes task files.

## Overview

Task discovery happens in two phases:

1. **Build time**: `prepareTasks` scans and indexes all tasks
2. **Runtime**: `getTaskDetails` loads tasks on demand

## Build Time: prepareTasks

**Location:** `packages/core/scripts/prepareTasks.js`

### Phase 1: prepareTasksIndex

Scans all `*.task.js` files and extracts metadata:

```javascript
// Find all task files
const taskFiles = glob.sync('src/tasks/**/*.task.js');

// Parse each file with Babel
for (const file of taskFiles) {
    const ast = parser.parse(fileContent);
    const metadata = extractMetadata(ast);
    taskMap[metadata.slug] = metadata;
}

// Write index
fs.writeFileSync('.microlight/taskMap.json', JSON.stringify(taskMap));
```

**Key behavior:**
- Uses Babel AST parser to safely extract metadata
- Does NOT execute task code during indexing
- Removes function bodies (sets to `null`) in the index
- Extracts: slug, name, description, inputs, schedules, folder

### Phase 2: prepareTasksImports

Generates dynamic import module:

```javascript
// .microlight/importTaskModule.js
export default function importTaskModule(slug) {
    switch (slug) {
        case 'my_task':
            return import('../../src/tasks/my_task.task.js');
        case 'another_task':
            return import('../../src/tasks/folder/another_task.task.js');
        // ... all tasks
    }
}
```

### Output Files

| File | Purpose |
|------|---------|
| `.microlight/taskMap.json` | Task metadata index |
| `.microlight/importTaskModule.js` | Dynamic task loader |

## Runtime: getTaskDetails

**Location:** `packages/core/src/lib/getTaskDetails.js`

Loads a complete task definition by merging:

```javascript
export default async function getTaskDetails({ slug }) {
    // Get metadata from index
    const metadata = taskMap[slug];

    // Load actual module with function
    const taskModule = await importTaskModule(slug);

    // Merge metadata + executable code
    return {
        ...metadata,
        ...taskModule.default
    };
}
```

## getAllTasks

**Location:** `packages/core/src/lib/getAllTasks.js`

Returns all tasks for listing in UI:

```javascript
export default async function getAllTasks() {
    const tasksDir = path.join(process.cwd(), 'src', 'tasks');
    const taskPaths = findAllTaskFiles(tasksDir);

    return Promise.all(
        taskPaths.map(p => import(p).then(m => m.default))
    );
}
```

## Task File Structure

```
src/tasks/
├── simple.task.js
├── reports/
│   ├── daily.task.js
│   └── weekly.task.js
└── integrations/
    └── sync.task.js
```

**Naming:** Files must end with `.task.js`

**Folders:** Nested folders are supported and create folder groupings in the UI.

## taskMap.json Structure

```json
{
    "my_task": {
        "slug": "my_task",
        "name": "My Task",
        "description": "Does something",
        "is_enabled": true,
        "folder": "reports",
        "inputs": { ... },
        "schedules": [ ... ],
        "fn": null  // Removed for indexing
    }
}
```

## When to Run prepareTasks

- After adding/removing task files
- After changing task metadata (slug, name, schedules)
- During `npm run dev` (runs automatically)
- Via `microlight-core prepare tasks`

## Related Docs

- [CLI Internals](/docs/internal/cli-internals.md) - prepare commands
- [Execution Engine](/docs/internal/execution-engine.md) - how tasks run
