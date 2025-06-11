Collecting workspace information

# Microlight CLI

The **Microlight CLI** is a command-line tool designed to manage projects, tasks, and folders within the Microlight ecosystem. It provides a set of commands to create new projects, list and manage tasks, and handle folder operations.

## Installation

Ensure you have Node.js installed on your system. Clone the repository and navigate to the `packages/cli` directory. Then, install the dependencies:

```bash
# install globally
npm install @microlight/cli -g
```

## Usage
Run the CLI using the following command:
```bash
# if globally installed
microlight <command>
# or using npx
npx @microlight/cli <command>
```


## Commands

- microlight
  - new <project_name>
  - tasks
    - ls
    - new
  - folders
    - ls
    - new <folder_name>
  - help
  

### New project
```bash
microlight new <projectName>
# Example: 
microlight new my-new-project
```
Creates a new project with the specified name.

Copies the project template from the new/project directory and initializes a new project in the current working directory.

### tasks
Manage tasks within the Microlight ecosystem.

### tasks ls
Lists all tasks in the src/tasks directory.

```bash
microlight tasks ls
```
Searches for all .task.js files in the src/tasks directory and displays their paths.



### tasks new
Creates a new task.
```bash
microlight tasks new
```
Copies the task template from the new/task directory and initializes a new task file (hello_world.task.js) in the current working directory.

### folders
Manage folders within the Microlight ecosystem.

### folders ls
Lists all folders.
```bash
microlight folders ls
```

### folders new
Creates a new folder with the specified name.
```bash
microlight folders new <folderName>
```
Copies the folder template from the new/folder directory and initializes a new folder in the current working directory.

