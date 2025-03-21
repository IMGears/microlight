import { glob } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__filename)
console.log(__dirname)

// Find all task files and folder files
const taskFiles = glob.sync(['**/*.task.js', '**/microlight.folder.js'], {
  cwd: __dirname,
  absolute: true
});

console.log(taskFiles);

// Import all task files dynamically
const tasks = await Promise.all(
  taskFiles.map(async (filePath) => {
    const task = await import(filePath);
    const taskName = path.basename(filePath, '.task.js');
    // return [taskName, task.default];
    return [task?.default?.slug, {...task?.default,...{file_name:taskName}}];
  })
);
console.log(tasks);

// Convert array of entries to an object
const taskMap = Object.fromEntries(tasks);

console.log(taskMap);

export default taskMap;