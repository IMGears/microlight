# Update Documentation

## Audience Separation

Documentation must serve two distinct audiences:

### 1. Task Authors (Primary Audience)
**Who:** Developers using microlight to create and run tasks
**Goal:** Quickly understand how to write tasks, use ml.* functions, trigger via API
**Focus:** Practical, example-heavy, "how do I do X?"

### 2. Core Team / Maintainers (Internal)
**Who:** Developers maintaining/extending the microlight project itself
**Goal:** Understand internals, architecture, contribution workflow
**Focus:** Architecture, database schema, CLI internals, design decisions

---

## Proposed Documentation Structure

```
/docs
├── index.md                    # Landing page with audience routing
│
├── /guide                      # TASK AUTHORS - Primary docs
│   ├── getting-started.md      # Setup and first task
│   ├── writing-tasks.md        # Task file format, structure
│   ├── inputs.md               # Input types with examples
│   ├── ml-functions.md         # ml.* reference with examples
│   ├── scheduling.md           # Cron schedules for tasks
│   ├── api.md                  # Triggering tasks via API
│   └── troubleshooting.md      # Common issues & FAQ
│
├── /examples                   # TASK AUTHORS - Practical examples
│   ├── basic-task.md           # Simple task walkthrough
│   ├── task-with-inputs.md     # Various input types
│   ├── scheduled-task.md       # Cron-based task
│   ├── bulk-execution.md       # API bulk triggering
│   └── error-handling.md       # Handling failures
│
├── /internal                   # CORE TEAM ONLY
│   ├── architecture.md         # System overview, execution flow
│   ├── database-schema.md      # Runs, Logs models
│   ├── cli-internals.md        # microlight-core prepare commands
│   ├── task-discovery.md       # getAllTasks, loadSchedules
│   ├── execution-engine.md     # executeRun internals
│   ├── monitoring.md           # Dashboard implementation
│   ├── contributing.md         # Dev setup, PR process
│   └── decisions.md            # Architectural decisions (existing)
│
└── /wip                        # Work in progress (not published)
```

---

## Current State Assessment

**Completion:** ~35-40% complete
**Total existing docs:** ~362 lines (excluding WIP stubs)

### What's Currently Documented
- Getting Started guide (basic setup)
- Task reference (task.md) - most comprehensive section
- Input types (string, number, date, file, dropdown)
- ml.* output functions (log, markdown, json, error, info, warn, danger, success)
- Bulk execution example
- Architectural decisions

### Critical Quality Issues
- Broken link to changelog in docs.md
- API and Webhooks marked as "pending" with no content
- ml.md has method list but zero code examples
- No troubleshooting or FAQ section
- No deployment guide
- **No separation between user and internal docs**

---

## Documentation Gaps by Audience

### Task Authors (User-Facing) - HIGH PRIORITY

| Doc | Status | What's Missing |
|-----|--------|----------------|
| `ml-functions.md` | Incomplete | `ml.wait()` undocumented, no code examples for any function |
| `api.md` | Missing | POST endpoint, request/response format, error handling |
| `scheduling.md` | Missing | Cron syntax, timezone handling, examples |
| `inputs.md` | Incomplete | Dropdown config, file validation, default values |
| `troubleshooting.md` | Missing | Common errors, FAQ, debugging tips |
| `writing-tasks.md` | Needs rewrite | Consolidate task.md into practical guide |

**Examples needed:**
- Basic task walkthrough (currently missing)
- Task with various input types
- Scheduled task example
- Error handling patterns

### Core Team (Internal) - MEDIUM PRIORITY

| Doc | Status | What's Missing |
|-----|--------|----------------|
| `architecture.md` | Missing | System overview, component relationships |
| `execution-engine.md` | Missing | executeRun internals, run lifecycle |
| `task-discovery.md` | Missing | getAllTasks, how .task.js files are found |
| `database-schema.md` | Missing | Runs, Logs models, status values |
| `cli-internals.md` | Missing | microlight-core prepare commands |
| `monitoring.md` | Missing | Dashboard implementation, server actions |
| `contributing.md` | Missing | Dev setup, PR process, testing |
| `decisions.md` | Exists | Move from /general to /internal |

**Source locations for internal docs:**
- `/packages/core/src/lib/executeRun.js` - Execution engine
- `/packages/core/src/lib/getAllTasks.js` - Task discovery
- `/packages/core/src/lib/loadSchedules.js` - Scheduling
- `/packages/core/src/database/microlight/tables/` - Schema
- `/packages/core/bin/microlight-core.js` - CLI commands

---

## Documentation Standards to Follow

Based on engineering standards at `/Users/alex/ec2code/alex/engineering-standards`:

### Structure
- Single concept per document (atomic notes)
- Keep notes concise (20-50 lines typical)
- Use repo-root relative paths for links
- Maintain cross-references between related docs

### Required Sections per Topic
- Description/overview
- "When to Use" section
- Usage examples with code
- Configuration/props tables where applicable
- Related documentation links

### Code Examples
- Every function/API needs at least one working example
- Show both simple and advanced usage
- Include expected output where helpful

---

## Implementation Plan

### Phase 0: Restructure ✅ COMPLETE
1. [x] Create new folder structure (`/guide`, `/examples`, `/internal`)
2. [x] Create `index.md` with audience routing
3. [x] Move existing docs to appropriate locations
4. [x] Fix broken changelog link

### Phase 1: Task Authors Docs (Priority) ✅ COMPLETE
1. [x] `guide/ml-functions.md` - Add ml.wait, add examples for ALL functions
2. [x] `guide/api.md` - Document POST endpoint, request/response format
3. [x] `guide/scheduling.md` - Cron syntax, timezone, examples
4. [x] `guide/inputs.md` - Complete dropdown, file, defaults documentation
5. [x] `guide/writing-tasks.md` - Consolidate and improve task reference
6. [x] `guide/troubleshooting.md` - Common issues, FAQ

### Phase 2: Examples (Task Authors) ✅ COMPLETE
1. [x] `examples/basic-task.md` - Complete walkthrough
2. [x] `examples/task-with-inputs.md` - All input types
3. [x] `examples/scheduled-task.md` - Cron-based automation
4. [x] `examples/error-handling.md` - Failure patterns

### Phase 3: Internal Docs (Core Team) ✅ COMPLETE
1. [x] `internal/architecture.md` - System overview
2. [x] `internal/execution-engine.md` - executeRun, run lifecycle
3. [x] `internal/task-discovery.md` - getAllTasks internals
4. [x] `internal/database-schema.md` - Runs, Logs models
5. [x] `internal/cli-internals.md` - prepare commands
6. [x] `internal/contributing.md` - Dev setup, PR process
7. [x] Move `decisions.md` to internal/

### Phase 4: Polish ✅ COMPLETE
1. [x] Review all docs for consistency
2. [x] Ensure cross-links work (22 links verified)
3. [x] Add "Related docs" sections (added to 6 files)
4. [x] Final review against engineering standards

---

## Success Criteria

### Task Authors (Primary)
A new task author should be able to:
1. Set up microlight and create their first task in under 30 minutes
2. Use all ml.* functions with confidence (examples for each)
3. Create tasks with any input type (string, number, date, file, dropdown)
4. Set up scheduled tasks with cron
5. Trigger tasks via API programmatically
6. Debug common issues using troubleshooting guide

### Core Team
A new maintainer should be able to:
1. Understand the system architecture from docs alone
2. Know where code lives for any feature (task discovery, execution, etc.)
3. Understand the database schema and run lifecycle
4. Set up local dev environment and contribute
5. Understand why architectural decisions were made
