import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';

function findTaskFile(basePath, filename) {
  try {
    const files = fs.readdirSync(basePath);
    
    for (const file of files) {
      const filePath = path.join(basePath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // Recursively search subdirectories
        const found = findTaskFile(filePath, filename);
        if (found) return found;
      } else if (file === filename) {
        return filePath;
      }
    }
  } catch (err) {
    return null;
  }
  return null;
}

export default async function getTaskDetails({params}) {
  try {
    const tasksDir = path.join(process.cwd(), 'src', 'tasks');
    const filename = `${params.slug}.task.js`;
    const fullPath = findTaskFile(tasksDir, filename);
    
    if (!fullPath) {
      notFound();
    }
    // Convert the full filesystem path to a module path
    const modulePath = fullPath
      .split('/tasks/')[1]
      // .replace(/^\/src/, '@');     // Replace /src with @ alias

  // Extract just the part after /tasks/
    const folderPath = modulePath
      .split(`/${params.slug}.task.js`)[0];
    
    let taskConfig = await import(`@/tasks/${modulePath}`);
    return {
      ...taskConfig.default,
      _folderPath: folderPath
    };
  } catch(e) {
    if (e.code === 'MODULE_NOT_FOUND') 
      notFound();
    throw e;
  }
}