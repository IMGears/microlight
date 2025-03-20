require('dotenv').config();
const fs = require('fs');
const path = require('path');

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

async function getAllTasks() {
  const tasksDir = path.join(process.cwd(), 'src', 'tasks');
  const taskPaths = findAllTaskFiles(tasksDir);
  console.log(taskPaths);
  console.log('-------------------------\n\n\n\n')
  
  const tasks = await Promise.all(
    taskPaths.map(async (fullPath) => {
      // Using path.relative to get the correct relative path from the current file to the task file
      const relativePath = path.relative(
        path.dirname(__filename),
        fullPath
      );
      console.log(relativePath);
      
      const task = require(relativePath).default;
      delete task.fn;
      task.fullPath=fullPath;
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
  const outputPath = path.join(process.cwd(),'.microlight', 'index.json');
  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2));
  console.log(`Tasks written to ${outputPath}`);

  return tasks;
}

getAllTasks();