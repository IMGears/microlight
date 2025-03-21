export default {
  "": {
    "name": "Library",
    "description": "All executable jobs",
    "contents": [
      {
        "type": "folder",
        "slug": "1.intro",
        "name": "Introduction to Microlight",
        "description": "Demo jobs that microlight can do"
      }
    ]
  },
  "1.intro": {
    "name": "Introduction to Microlight",
    "description": "Demo jobs that microlight can do",
    "contents": [
      {
        "type": "task",
        "slug": "hello_world",
        "name": "Hello World",
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
        "__file_name": "hello_world.task.js",
        "__folder": "1.intro"
      },
      {
        "type": "task",
        "slug": "ml",
        "name": "Microlight display functions",
        "description": "Simply prints Hello world",
        "inputs": {},
        "__file_name": "ml.task.js",
        "__folder": "1.intro"
      },
      {
        "type": "task",
        "slug": "multiple_schedules",
        "name": "Multiple Scheduled task",
        "description": "This task runs every 2 mins with different payload",
        "inputs": {},
        "schedules": [
          {
            "schedule": "* * * * *",
            "is_enabled": true,
            "inputs": {}
          }
        ],
        "__file_name": "multiple_schedules.task.js",
        "__folder": "1.intro"
      },
      {
        "type": "task",
        "slug": "scheduled",
        "name": "Scheduled task",
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
      {
        "type": "task",
        "slug": "takes_time",
        "name": "Task that takes time to run",
        "description": "Simply prints Hello world",
        "inputs": {},
        "__file_name": "takes_time.task.js",
        "__folder": "1.intro"
      }
    ]
  }
}