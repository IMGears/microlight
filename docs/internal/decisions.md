# Architectural Decisions

## Why degit?

So that it can setup scaffolding. Storybook also runs a server without using degit. Maybe simple stuff like that is good enough.

## Why not an npm package that can run a server?

Yes possible. Don't know how to do it. So not done.

## Why does microlight have a database?

So that it can store the history of execution.

## Should microlight have login?

TODO: Document decision

## Database support?

TODO: Document decision

## Switch to Next.js

Unlike Sails.js, Next.js has specific benefits:

1. **Hot reload for tasks** - Changes made to task files reflect in the dev server without restarting. Sails.js by default needs a server restart, which slows down development.

2. **Easier testing** - Since the server doesn't need a restart, it's easier to run/test scripts from the dev server UI than to execute from the terminal.

3. **Streaming HTML** - It's easier to implement streaming HTML in Next.js. The old Sails.js app didn't give user feedback when tasks were running. If a task took 60 seconds, all output was served after 60 seconds. With streaming, output is presented as it's generated, making it feel faster.

4. **Exit Sails.js** - As a team we have stopped using Sails.js for other projects. Makes sense to exit Sails from this project as well.
