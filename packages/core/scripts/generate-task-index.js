#!/usr/bin/env node
import { glob } from 'glob';
import path from 'path';
// import { join, relative, dirname } from 'path';
import fs from 'fs';

// Ensure we're looking in the right directory relative to the script
const tasksDir = path.join(process.cwd(), 'src', 'tasks');
const outputFile = path.resolve(process.cwd(),'.microlight', 'taskMap.js');

// Create tasks directory if it doesn't exist
if (!fs.existsSync(tasksDir)) {
  fs.mkdirSync(tasksDir, { recursive: true });
}

// Find all task files
const taskFiles = glob.sync('**/*.task.js', {
  cwd: tasksDir,
  absolute: false
});

console.log(taskFiles);

// Import all task files dynamically
const tasks = await Promise.all(
  taskFiles.map(async (file) => {
    const filePath = path.resolve(tasksDir, file);
    const task = await import(filePath);
    const taskName = path.basename(filePath);
    let folderName = file.split('/')
    folderName.pop();
    folderName=folderName.join('/');
    // return [taskName, task.default];
    return [task?.default?.slug, {...task?.default,...{__file_name:taskName,__folder:folderName}}];
  })
);
// console.log(tasks);

// Convert array of entries to an object
const taskMap = Object.fromEntries(tasks);

console.log(taskMap);



// Write the generated code to a file
const outputCode = 'export default '+JSON.stringify(taskMap,null,2);

// Create the output directory if it doesn't exist
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the file
fs.writeFileSync(outputFile, outputCode, 'utf-8');
console.log(`Generated tasks index at: ${outputFile}`); 
