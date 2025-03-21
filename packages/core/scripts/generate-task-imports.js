import { glob } from 'glob';
import path from 'path';
// import { join, relative, dirname } from 'path';
import fs from 'fs';

// Ensure we're looking in the right directory relative to the script
const tasksDir = path.join(process.cwd(), 'src', 'tasks');
const outputFile = path.resolve(tasksDir, 'importTaskModule.js');

// Create tasks directory if it doesn't exist
if (!fs.existsSync(tasksDir)) {
  fs.mkdirSync(tasksDir, { recursive: true });
}

// Find all task files
const taskFiles = glob.sync('**/*.task.js', {
  cwd: tasksDir,
  absolute: false
});

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
      
      return `    case "${taskSlug||taskName}":\n      return await import("@/tasks/${file}");`;
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

// Write the generated code to a file
const outputCode = await generateImportSwitch(taskFiles);

// Create the output directory if it doesn't exist
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the file
fs.writeFileSync(outputFile, outputCode, 'utf-8');
console.log(`Generated import switch at: ${outputFile}`); 