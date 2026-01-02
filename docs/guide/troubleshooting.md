# Troubleshooting

Common issues and solutions when working with Microlight.

## Task not appearing in UI

**Symptoms:** Your task file exists but doesn't show up in the task list.

**Solutions:**
1. Ensure the file is named `*.task.js`
2. Check `is_enabled: true` is set
3. Verify the file exports the task object correctly
4. Restart the dev server
5. Check for JavaScript syntax errors in your task file

## Task runs but shows no output

**Symptoms:** Task completes but UI shows nothing.

**Solutions:**
1. Ensure you're using `ml.*` functions to output content:
   ```js
   ml.log('Processing...');
   ml.success('Done!');
   ```
2. Check that `ml` is the first argument in your `fn` function
3. Use `await` with `ml.wait()` if using it

## Scheduled task not running

**Symptoms:** Task has a schedule but doesn't run automatically.

**Solutions:**
1. Check `schedule.is_enabled: true`
2. Verify cron syntax is correct
3. Check timezone is set correctly
4. Ensure the main task has `is_enabled: true`
5. Check server logs for scheduling errors

## Input values not passed to function

**Symptoms:** `inputs` object is empty or missing values.

**Solutions:**
1. Verify input key in `inputs` config matches what you're accessing
2. Check `required: true` if value must be provided
3. Ensure correct `type` is specified

## API returns 404

**Symptoms:** POST to `/api/tasks/[slug]` returns 404.

**Solutions:**
1. Verify the `slug` matches exactly (case-sensitive)
2. Ensure task exists and is enabled
3. Check the URL path is correct

## Error: Cannot find module

**Symptoms:** Task fails with module not found error.

**Solutions:**
1. Run `npm install` to ensure dependencies are installed
2. Check the import path is correct
3. Verify the module is listed in `package.json`

## Need more help?

- Check the [examples](/docs/examples/) for working code
- Review your task against [Writing Tasks](/docs/guide/writing-tasks.md)

## Related docs

- [Writing Tasks](/docs/guide/writing-tasks.md) - Task structure reference
- [ML Functions](/docs/guide/ml-functions.md) - Output methods
- [Scheduling](/docs/guide/scheduling.md) - Cron configuration
- [API](/docs/guide/api.md) - API endpoint reference
