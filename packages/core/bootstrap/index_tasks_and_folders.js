import 'dotenv/config';
import { readdirSync, statSync, writeFileSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const findAllTaskFiles = (basePath) => {
  const tasks = [];
  
  try {
    const files = readdirSync(basePath);
    
    for (const file of files) {
      const filePath = join(basePath, file);
      const stat = statSync(filePath);
      
      if (stat.isDirectory()) {
        // Recursively search subdirectories
        tasks.push(...findAllTaskFiles(filePath));
      } else if (file.endsWith('.task.js')) {
        tasks.push(filePath);
      }
    }
  } catch (err) {
    console.error('Error reading directory:', err);
  }
  
  return tasks;
};

const getAllTasks = async () => {
  const tasksDir = join(process.cwd(), 'src', 'tasks');
  const taskPaths = findAllTaskFiles(tasksDir);
  console.log(taskPaths);
  console.log('-------------------------\n\n\n\n');
  
  const tasks = await Promise.all(
    taskPaths.map(async (fullPath) => {
      // Using path.relative to get the correct relative path from the current file to the task file
      const relativePath = relative(
        dirname(fileURLToPath(import.meta.url)),
        fullPath
      );
      console.log(relativePath);
      
      const { default: task } = await import(relativePath);
      delete task.fn;
      task.fullPath = fullPath;
      console.log(task);
      return task;
    })
  );
  let index={
    tasks:{},
    folders:{},
  };
  tasks.forEach(function(task){
    index.tasks[task.slug]=task;
  })

  // Write tasks to a file
  const outputPath = join(process.cwd(),'.microlight', 'index.json');
  writeFileSync(outputPath, JSON.stringify(index, null, 2));
  console.log(`Tasks written to ${outputPath}`);

  return tasks;
}

getAllTasks();