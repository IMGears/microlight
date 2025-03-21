export default {
  "takes_time": {
    "slug": "takes_time",
    "name": "Task that takes time to run",
    "is_enabled": true,
    "description": "Simply prints Hello world",
    "inputs": {},
    "__file_name": "takes_time.task.js",
    "__folder": "1.intro"
  },
  "scheduled": {
    "slug": "scheduled",
    "name": "Scheduled task",
    "is_enabled": true,
    "description": "This task runs every 2 mins",
    "inputs": {},
    "schedules": [
      {
        "schedule": "*/2 * * * *",
        "is_enabled": true,
        "inputs": {}
      }
    ],
    "__file_name": "scheduled.task.js",
    "__folder": "1.intro"
  },
  "ml": {
    "slug": "ml",
    "name": "Microlight display functions",
    "is_enabled": true,
    "description": "Simply prints Hello world",
    "inputs": {},
    "__file_name": "ml.task.js",
    "__folder": "1.intro"
  },
  "hello_world": {
    "slug": "hello_world",
    "name": "Hello World",
    "is_enabled": true,
    "description": "Simply prints Hello world",
    "inputs": {
      "name": {
        "name": "Name",
        "description": "Name of the person",
        "default": "World",
        "placeholder": "Your name",
        "type": "string",
        "required": false
      }
    },
    "__file_name": "hello_world2.task.js",
    "__folder": "1.intro"
  },
  "takes_time2": {
    "slug": "takes_time2",
    "name": "Task that takes time to run",
    "is_enabled": true,
    "description": "Simply prints Hello world",
    "inputs": {},
    "__file_name": "takes_time2.task.js",
    "__folder": "1.intro/test"
  }
}