# Bulk Execution from Terminal

If you want to rerun a task with multiple parameters and find it tedious to do from the UI, you can do it from the terminal using the task API endpoint and curl.

## API endpoint

```
POST /api/tasks/[slug]?query_params
```

## Example

Running `load_s3_csv_to_pg` for different dates and filenames:

```shell
# Prepare multiple curl commands in a text editor
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-19&filename=stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-18&filename=stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-17&filename=stock_consumption.csv"
```

Copy and paste these commands to the terminal to execute all tasks in one shot.

## Use cases

- **Backfill work** - Process historical data for multiple dates
- **Rerun after logic changes** - Re-execute tasks after updating the task code
- **Batch processing** - Run the same task with different parameters

## Tips

1. Use a text editor to prepare your curl commands
2. Use shell loops for sequential dates:
   ```shell
   for date in 2025-01-{01..19}; do
       curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=$date&filename=stock_consumption.csv"
   done
   ```
3. Add `&` at the end to run commands in parallel (use with caution)

## Related docs

- [API](/docs/guide/api.md) - Full API endpoint reference
- [Writing Tasks](/docs/guide/writing-tasks.md) - Task structure
- [Scheduled Task](/docs/examples/scheduled-task.md) - Automated execution
