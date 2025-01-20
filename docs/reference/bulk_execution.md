# Bulk execution from terminal

If you want to rerun the task with multiple parameters and find it tedious to do it from the UI, you can do it from the terminal using the task run api endpoint and curl. 

Using text editor such as sublime prepare the curl commands to execute with differnt input parameters and url query parmas. The curl command should make a post request to `/api/tasks/[slug]?query_params`. Just copy paste this to the terminal and you can execute all the tasks in one shot

e.g. running load_s3_csv_to_pg for different dates and different filenames. 

```shell
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-19&filename=stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-18&filename=stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-17&filename=stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-16&filename=stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-15&filename=stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-14&filename=stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-13&filename=stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-12&filename=stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-11&filename=stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-10&filename=stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-09&filename=stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-08&filename=stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-07&filename=stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-06&filename=stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-05&filename=stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-04&filename=stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-03&filename=stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-02&filename=stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-01&filename=stock_consumption.csv"


curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-19&filename=fg_production.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-18&filename=fg_production.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-17&filename=fg_production.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-16&filename=fg_production.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-15&filename=fg_production.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-14&filename=fg_production.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-13&filename=fg_production.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-12&filename=fg_production.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-11&filename=fg_production.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-10&filename=fg_production.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-09&filename=fg_production.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-08&filename=fg_production.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-07&filename=fg_production.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-06&filename=fg_production.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-05&filename=fg_production.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-04&filename=fg_production.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-03&filename=fg_production.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-02&filename=fg_production.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-01&filename=fg_production.csv"


curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-19&filename=rm_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-18&filename=rm_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-17&filename=rm_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-16&filename=rm_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-15&filename=rm_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-14&filename=rm_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-13&filename=rm_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-12&filename=rm_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-11&filename=rm_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-10&filename=rm_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-09&filename=rm_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-08&filename=rm_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-07&filename=rm_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-06&filename=rm_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-05&filename=rm_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-04&filename=rm_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-03&filename=rm_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-02&filename=rm_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-01&filename=rm_consumption.csv"



curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-19&filename=non_stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-18&filename=non_stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-17&filename=non_stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-16&filename=non_stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-15&filename=non_stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-14&filename=non_stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-13&filename=non_stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-12&filename=non_stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-11&filename=non_stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-10&filename=non_stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-09&filename=non_stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-08&filename=non_stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-07&filename=non_stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-06&filename=non_stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-05&filename=non_stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-04&filename=non_stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-03&filename=non_stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-02&filename=non_stock_consumption.csv"
curl -X POST "http://localhost:3000/api/tasks/load_s3_csv_to_pg?date=2025-01-01&filename=non_stock_consumption.csv"

```

This makes it easy to do back fill work or rerun jobs in bulk after logic has changed. 