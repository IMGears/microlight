# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Fixed

### Removed

## [0.11.0] - 2026-01-03

### Added

- New shadcn/ui component library with 13 components: `alert`, `badge`, `breadcrumb`, `button`, `card`, `dropdown-menu`, `input`, `label`, `select`, `stack`, `table`, `tabs`, `typography`
- Tailwind CSS and PostCSS configuration (`postcss.config.mjs`)
- Utility function `cn()` for className merging (`src/utils/css/cn.js`)
- Code review reports: documentation-review, storybook-review, unit-tests-review
- WIP login implementation documentation (`docs/wip/04-implement-login.md`)
- Task configuration files (`.mlrc.json`)

### Changed

- Migrated UI components from MUI to shadcn/ui
- Updated `ViewFolder`, `MonitoringDashboard`, `ViewTask`, `ViewRun` pages with new component library
- Updated `DropdownActions`, `Link`, `MLInput`, `Navbar`, `NavbarContainer`, `PageHeader`, `StatusChip` components
- Updated `globals.css` with Tailwind/shadcn design tokens
- Replaced `next.config.mjs` with `next.config.js`

### Removed

- Removed `Icon.jsx` component (replaced by Lucide icons via shadcn)
- Removed MUI dependency

## [0.10.1] - 2026-01-03

### Changed

- Reorganized documentation structure with new organized hierarchy
- Added comprehensive guide documentation (`docs/guide/`): getting-started, writing-tasks, inputs, ml-functions, scheduling, api, troubleshooting
- Added example documentation (`docs/examples/`): basic-task, task-with-inputs, scheduled-task, bulk-execution, error-handling
- Added internal documentation (`docs/internal/`): architecture, execution-engine, task-discovery, database-schema, cli-internals, monitoring, contributing, decisions
- Added main documentation index (`docs/index.md`)

### Removed

- Removed legacy documentation files: `docs/docs.md`, `docs/general/*`, `docs/reference/*`

## [0.10.0] - 2026-01-03

### Added
- Task monitoring system with dashboard, actions, and page components
- Test cases for monitoring system (monitoring-actions.test.js, monitoring.test.js)
- Test cases for view task (view-task.test.js)
- Test cases for execute task (execute-task.test.js)
- Jest configuration for core package
- GitHub Actions test workflow

### Changed
- Updated naming convention for monitoring files
- Renamed folder/files for tests to follow conventions
- Updated dev packages

### Fixed
- View task bug fixes
- Schedule inputs bug fixed
- Icons class bug fixed

### Removed
- Removed @babel/cli dependency
- Cleaned up console logs
