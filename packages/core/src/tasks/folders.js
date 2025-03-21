export default {
  "": {
    "name": "Library",
    "is_enabled": true,
    "description": "All executable tasks",
    "contents": [
      {
        "type": "folder",
        "slug": "1.intro",
        "name": "Introduction to Microlight",
        "is_enabled": true,
        "description": "Demo jobs that microlight can do"
      }
    ]
  },
  "1.intro": {
    "name": "Introduction to Microlight",
    "is_enabled": true,
    "description": "Demo jobs that microlight can do",
    "contents": [
      {
        "type": "task",
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
      {
        "type": "task",
        "slug": "ml",
        "name": "Microlight display functions",
        "is_enabled": true,
        "description": "Simply prints Hello world",
        "inputs": {},
        "__file_name": "ml.task.js",
        "__folder": "1.intro"
      },
      {
        "type": "task",
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
      {
        "type": "task",
        "slug": "takes_time",
        "name": "Task that takes time to run",
        "is_enabled": true,
        "description": "Simply prints Hello world",
        "inputs": {},
        "__file_name": "takes_time.task.js",
        "__folder": "1.intro"
      },
      {
        "type": "folder",
        "slug": "1.intro/test",
        "name": "Test folder",
        "is_enabled": true,
        "description": "Microlight supports nested folders"
      }
    ]
  },
  "1.intro/test": {
    "name": "Test folder",
    "is_enabled": true,
    "description": "Microlight supports nested folders",
    "contents": [
      {
        "type": "task",
        "slug": "takes_time2",
        "name": "Task that takes time to run",
        "is_enabled": true,
        "description": "Simply prints Hello world",
        "inputs": {},
        "__file_name": "takes_time2.task.js",
        "__folder": "1.intro/test"
      }
    ]
  }
}