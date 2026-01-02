# CLI Internals

The `microlight-core` CLI handles build-time preparation tasks.

## Location

`packages/core/bin/microlight-core.js`

Uses Commander.js for CLI structure.

## Commands

### microlight-core prepare all

Runs all preparation steps in sequence:

```shell
microlight-core prepare all
```

Executes:
1. `prepareTasks()` - Index task files
2. `prepareFolders()` - Index folder structure
3. `prepareServer()` - Setup server files
4. `prepareEnvVars()` - Initialize environment

### microlight-core prepare tasks

Indexes all task files and generates the task registry:

```shell
microlight-core prepare tasks
```

**What it does:**
1. Scans `src/tasks/**/*.task.js`
2. Parses each file with Babel AST
3. Extracts metadata (slug, name, inputs, schedules)
4. Generates `.microlight/taskMap.json`
5. Generates `.microlight/importTaskModule.js`

**When to run:**
- After adding/removing task files
- After changing task metadata
- Runs automatically during `npm run dev`

### microlight-core prepare folders

Indexes the folder structure for UI navigation:

```shell
microlight-core prepare folders
```

**What it does:**
- Scans task directory structure
- Creates folder index for sidebar navigation
- Groups tasks by their parent folders

### microlight-core prepare server

Sets up server infrastructure files:

```shell
microlight-core prepare server
```

**What it does:**
- Copies server files from `dist/server` to `.microlight/server`
- Initializes server configuration

### microlight-core prepare env

Initializes environment variables:

```shell
microlight-core prepare env
```

**What it does:**
- Creates default environment configuration
- Sets up required env vars if missing

## Output Directory

All generated files go to `.microlight/`:

```
.microlight/
├── taskMap.json          # Task metadata index
├── importTaskModule.js   # Dynamic task loader
├── microlight.db         # SQLite database (if used)
└── server/               # Server infrastructure
```

## Integration with npm scripts

Typical `package.json` setup:

```json
{
    "scripts": {
        "dev": "microlight-core prepare all && next dev",
        "build": "microlight-core prepare all && next build"
    }
}
```

## Programmatic Usage

```javascript
import { prepareTasks, prepareFolders } from '@microlight/core/scripts';

await prepareTasks();
await prepareFolders();
```

## Related Docs

- [Task Discovery](/docs/internal/task-discovery.md) - How tasks are indexed
- [Architecture](/docs/internal/architecture.md) - System overview
