import fs from 'fs';
import path from 'path';

function findAllTaskFiles(basePath) {
  const tasks = [];
  
  try {
    const files = fs.readdirSync(basePath);
    
    for (const file of files) {
      const filePath = path.join(basePath, file);
      const stat = fs.statSync(filePath);
      
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
}

export default async function getAllTasks() {
  const tasksDir = path.join(process.cwd(), 'src', 'tasks');
  const taskPaths = findAllTaskFiles(tasksDir);
  
  const tasks = await Promise.all(
    taskPaths.map(async (fullPath) => {
      // Convert the full filesystem path to a module path
      const modulePath = fullPath.split('/tasks/')[1];
      const task = (await import(`@/tasks/${modulePath}`)).default;
      return task;
    })
  );
  
  return tasks;
}