# Contributing

Guide for contributing to the Microlight project.

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Clone and install

```shell
git clone git@github.com:IMGears/microlight.git
cd microlight

# Install dependencies for all packages
npm install
```

### Package structure

```
packages/
├── cli/      # @microlight/cli - Scaffolding tool
├── core/     # @microlight/core - Main framework
└── local/    # @microlight/local - Generated files
```

### Running locally

```shell
# From packages/core
npm run dev

# Or from root with workspaces
npm run dev -w @microlight/core
```

## Making Changes

### Core library changes

1. Make changes in `packages/core/src/lib/`
2. Test with the demo project in `examples/microlight-demo/`
3. Run `npm run build` to verify

### CLI changes

1. Make changes in `packages/cli/`
2. Test locally: `node packages/cli/bin/microlight.js new test-project`
3. Clean up test project after

### UI changes

1. Make changes in `packages/core/src/app/` or `packages/core/src/components/`
2. Run `npm run dev` and verify in browser
3. Test with different task configurations

## Code Style

- Use ES modules (`import`/`export`)
- Prefer `async`/`await` over raw promises
- Keep functions small and focused
- Add JSDoc comments for public APIs

## Testing

```shell
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## Pull Request Process

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Test locally
4. Commit with clear message
5. Push and create PR against `main`

### PR checklist

- [ ] Changes work locally
- [ ] No console errors
- [ ] Code follows existing patterns
- [ ] Updated relevant documentation

## Documentation

Documentation lives in `/docs/`:

- `/docs/guide/` - User-facing docs for task authors
- `/docs/examples/` - Practical examples
- `/docs/internal/` - Core team docs (you're reading one!)

Update docs when:
- Adding new features
- Changing APIs
- Fixing bugs that users might encounter

## Release Process

1. Update version in `packages/*/package.json`
2. Update CHANGELOG.md
3. Create git tag: `git tag v1.2.3`
4. Push: `git push origin main --tags`
5. Publish: `npm publish` (from each package)

## Getting Help

- Check existing issues on GitHub
- Ask in team chat
- Review similar code in the codebase

## Related Docs

- [Architecture](/docs/internal/architecture.md) - How the system works
- [Decisions](/docs/internal/decisions.md) - Why we made certain choices
