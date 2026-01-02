# Architecture Overview

This document describes the internal architecture of Microlight for core team members.

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│                    (Next.js React Frontend)                      │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API Layer                                │
│              /api/tasks/[slug] - Task Execution                  │
│              Server Actions - UI Operations                      │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Core Library                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ executeRun   │  │ getAllTasks  │  │loadSchedules │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │getTaskDetails│  │generateDisplay│ │ prepareTasks │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Database Layer                            │
│              SQLite (default) or PostgreSQL                      │
│                    Runs | Logs tables                            │
└─────────────────────────────────────────────────────────────────┘
```

## Package Structure

```
packages/
├── cli/                    # @microlight/cli - Project scaffolding
│   └── bin/               # CLI entry points
│
├── core/                   # @microlight/core - Main framework
│   ├── bin/               # microlight-core CLI
│   ├── scripts/           # Build scripts (prepareTasks, etc.)
│   └── src/
│       ├── app/           # Next.js app routes
│       │   ├── api/       # API endpoints
│       │   ├── tasks/     # Task UI pages
│       │   └── monitoring/# Dashboard
│       ├── components/    # React components
│       ├── database/      # Sequelize models
│       └── lib/           # Core library functions
│
└── local/                  # @microlight/local - Generated files
    └── .microlight/       # taskMap.json, importTaskModule.js
```

## Data Flow

### Task Registration (Build Time)

```
*.task.js files
      │
      ▼ (prepareTasks)
┌─────────────────┐
│  Babel Parser   │ ── Parse AST, extract metadata
└─────────────────┘
      │
      ▼
┌─────────────────┐     ┌─────────────────────┐
│  taskMap.json   │     │ importTaskModule.js │
└─────────────────┘     └─────────────────────┘
```

### Task Execution (Runtime)

```
Trigger (UI/API/Schedule)
      │
      ▼
┌─────────────────┐
│ Create Run (DB) │ ── status: 'pending'
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  executeRun()   │ ── status: 'running'
└─────────────────┘
      │
      ▼
┌─────────────────┐
│ getTaskDetails()│ ── Load task from taskMap + module
└─────────────────┘
      │
      ▼
┌─────────────────┐
│   task.fn(ml)   │ ── Execute with display functions
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  Update Run DB  │ ── status: 'complete' | 'failed'
└─────────────────┘
```

## Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `executeRun` | `lib/executeRun.js` | Orchestrates task execution |
| `getAllTasks` | `lib/getAllTasks.js` | Discovers task files |
| `getTaskDetails` | `lib/getTaskDetails.js` | Loads task definition |
| `loadSchedules` | `lib/loadSchedules.js` | Sets up cron jobs |
| `generateDisplayFunctions` | `lib/generateDisplayFunctions.js` | Creates ml.* methods |
| `prepareTasks` | `scripts/prepareTasks.js` | Indexes tasks at build time |

## Database

Microlight uses Sequelize ORM with support for:
- **SQLite** (default) - `.microlight/microlight.db`
- **PostgreSQL** - via `ML_DB_PG` environment variable

See [Database Schema](/docs/internal/database-schema.md) for table definitions.

## Related Docs

- [Execution Engine](/docs/internal/execution-engine.md) - How tasks run
- [Task Discovery](/docs/internal/task-discovery.md) - How tasks are found
- [CLI Internals](/docs/internal/cli-internals.md) - Build commands
- [Decisions](/docs/internal/decisions.md) - Why we built it this way
