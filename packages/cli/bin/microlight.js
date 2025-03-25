#!/usr/bin/env node

import { Command } from "commander";
import { glob } from 'glob';
import path from 'path';
import fs from 'fs';
import {packageUp} from 'package-up';

import { createRequire } from "module";
const require = createRequire(import.meta.url); // Required for resolving CommonJS modules



const program = new Command();

let basePath = await packageUp();
basePath=basePath.split('/');
basePath.pop();
const tasksDir = path.join('/',...basePath, 'src','tasks');

// Create dirname equivalent for ES modules
const currentDir = new URL('.', import.meta.url).pathname;


program.name("microlight").description("Microlight CLI").version("1.0.0");



// Define the `new` command
const newCommand = program
  .command("new <projectName>")
  .description("Create a new project")

newCommand.action((projectName) => {
  console.log(`Creating a new project: ${projectName}`);
  
  const targetDir = path.join(process.cwd(), projectName);
  const templateDir = path.join(currentDir, './new/project');

  // Check if directory already exists
  if (fs.existsSync(targetDir)) {
    console.error(`Error: Directory ${projectName} already exists`);
    process.exit(1);
  }

  try {
    // Create the project directory
    fs.mkdirSync(targetDir, { recursive: true });

    // Copy template files recursively
    fs.cpSync(templateDir, targetDir, { 
      recursive: true,
      force: false
    });

    console.log(`Successfully created project in ${targetDir}`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('Error: Template directory not found. Please ensure ./new/project exists');
    } else {
      console.error('Error creating project:', error.message);
    }
    process.exit(1);
  }
});

// Define `tasks` subcommands
const taskCommand = program
  .command("tasks")
  .description("Manage tasks");

const listTasksCommand = taskCommand.command("ls").description("List tasks");
listTasksCommand.action(async() => {
  console.log("Listing all tasks...");
  console.log('taskDir -',tasksDir);
  // Find all task files
  const taskFiles = glob.sync('**/*.task.js', {
    cwd: tasksDir,
    absolute: false
  });
  console.log(taskFiles);
});

const newTaskCommand = taskCommand.command("new <taskName>").description("Create a task")
newTaskCommand.action(() => {
  console.log("Creating a new task...");
});

// Define `folders` subcommands
const folderCommand = program.command("folders").description("Manage folders");

const listFoldersCommand = folderCommand
  .command("ls")
  .description("List folders")
listFoldersCommand.action(() => {
  console.log("Listing all folders...");
});

const createFolderCommand = folderCommand
  .command("new <folderName>")
  .description("Create a folder")

createFolderCommand.action((folderName) => {
  console.log(`Creating a new folder: ${folderName}`);
  // Get the current working directory where the command is run
  
  const targetDir = path.join(process.cwd(), folderName);
  if (fs.existsSync(targetDir)) {
    console.log(`Folder ${folderName} already exists. Skipping folder creation`);
    process.exit(1);
  }
  // Create the project directory
  try {
    
    fs.mkdirSync(targetDir, { recursive: true });

    const coreModulePath = require.resolve("@microlight/cli/package.json"); // Find package.json
    const coreRoot = path.dirname(coreModulePath); // Get package root
    console.log(coreModulePath);
    console.log(coreRoot);
    const templateDir = path.join(coreRoot, "new", "folder"); // Resolve /new/folder
    console.log(templateDir);
    // Copy template files recursively
    fs.cpSync(templateDir, targetDir, { 
      recursive: true,
      force: false // Don't overwrite existing files
    });
    console.log(`Created new folder - ${folderName}`);
  } catch (error) {  
    console.error('Error creating folder:', error.message);
    process.exit(1);
  }
});

// Parse CLI arguments
program.parse(process.argv);