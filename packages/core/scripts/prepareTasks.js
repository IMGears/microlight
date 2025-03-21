import { glob } from 'glob';
import path from 'path';
// import { join, relative, dirname } from 'path';
import fs from 'fs';

const tasksDir = path.join(process.cwd(), 'src', 'tasks');

// Create tasks directory if it doesn't exist
if (!fs.existsSync(tasksDir)) {
  fs.mkdirSync(tasksDir, { recursive: true });
}

const getTaskFiles=function(){
  // Find all task files
  const taskFiles = glob.sync('**/*.task.js', {
    cwd: tasksDir,
    absolute: false
  });

  // console.log(taskFiles);
  return taskFiles;
}

// Generate the import switch statement
const generateImportSwitch = async (tasks) => {
  let cases = await Promise.all(
    tasks.map(async (file) => {
      const filePath = path.resolve(tasksDir, file);
      const task = await import(filePath);
      // console.log(task);
      const taskName = path.basename(file, '.task.js');
      const taskSlug=task?.default?.slug;
      // const taskName = path.basename(filePath, '.task.js');
      // return [taskName, task.default];
      // return [task?.default?.slug, {...task?.default,...{file_name:taskName}}];
      
      return `    case "${taskSlug||taskName}":\n      return await import("../src/tasks/${file}");`;
    })
  )
  cases=cases.join('\n');
  // console.log(cases);

  return `
export const importTaskModule = async (task_slug) => {
  switch (task_slug) {
${cases}
    default:
      return { default: { name: "Library", description: "All executable tasks" } };
  }
};`.trim();
};



export async function prepareTasks(){
  console.log('Preparing tasks now');
  await prepareTasksIndex();
  await prepareTasksImports();
}

export async function prepareTasksIndex(){
  const taskFiles = getTaskFiles();
  
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
  
  // console.log(taskMap);

  // Write the generated code to a file
  const outputCode = 'export default '+JSON.stringify(taskMap,null,2);
  const outputFile = path.resolve(process.cwd(),'.microlight', 'taskMap.js');
  // Create the output directory if it doesn't exist
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write the file
  fs.writeFileSync(outputFile, outputCode, 'utf-8');
  console.log(`Generated tasks index at: ${outputFile}`); 

}

export async function prepareTasksImports(){
  const taskFiles = getTaskFiles();

  // Write the generated code to a file
  const outputCode = await generateImportSwitch(taskFiles);
  const outputFile = path.resolve(process.cwd(),'.microlight', 'importTaskModule.js');
  // Create the output directory if it doesn't exist
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write the file
  fs.writeFileSync(outputFile, outputCode, 'utf-8');
  console.log(`Generated importTaskModule at: ${outputFile}`); 
}