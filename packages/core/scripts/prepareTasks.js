import { glob } from 'glob';
import path from 'path';
// import { join, relative, dirname } from 'path';
import fs from 'fs';
import { parse } from '@babel/parser';
// import generate from '@babel/generator';
import generator from '@babel/generator';



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
      // const task = await import(filePath);
      const task = await parseTaskFile(filePath);
      // console.log(task);
      const taskName = path.basename(file, '.task.js');
      const taskSlug=task?.slug;
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

const parseTaskFile = (filePath) => {
  // Read the contents of the file as UTF-8 text
  const content = fs.readFileSync(filePath, 'utf-8');
  // console.log(filePath);
  // console.log(content);
  try {
    // Parse the file content into an Abstract Syntax Tree (AST)
    // sourceType: 'module' allows ES6 import/export syntax
    // plugins enable parsing of JSX and TypeScript syntax
    const ast = parse(content, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
    });

    // Search through the top-level statements (ast.program.body)
    // to find the 'export default' statement
    // Find the export default declaration
    const exportDecl = ast.program.body.find(node => 
      node.type === 'ExportDefaultDeclaration'
    );
    // console.log(exportDecl);
    // If no export default is found, return null
    if (!exportDecl) return null;

    // Get the exported object, either direct or via identifier
    // Get what's being exported (the declaration)
    let objectAst = exportDecl.declaration;
    // If the export is a variable (e.g., export default taskConfig)
    if (objectAst.type === 'Identifier') {
      // Find the variable declaration in the file
      // (e.g., const taskConfig = { ... })
      const varDecl = ast.program.body.find(node => 
        node.type === 'VariableDeclaration' && 
        node.declarations.some(d => d.id.name === objectAst.name)
      );
      if (varDecl) {
        // Get the actual object from the variable declaration
        objectAst = varDecl.declarations[0].init;
      }
    }

    // console.log(objectAst);
    // fs.writeFileSync('./temp/objectAst.json', JSON.stringify(objectAst,null,2), 'utf-8');

    // Convert AST to string, replacing function values with null
    // Convert the AST object to a string, with a custom replacer function
    const cleanObject = JSON.stringify(objectAst, (key, value) => {
      // If the value is a function (any type of function), replace it with null
      if (value?.type === 'FunctionExpression' || 
          value?.type === 'ArrowFunctionExpression' ||
          value?.type === 'FunctionDeclaration') {
        return null;
        // return function(){};
      }
      // Keep all other values as is
      return value;
    },2);
    // fs.writeFileSync('./temp/cleanObject.json', cleanObject, 'utf-8');

    
    // Parse the cleaned object to get the final result
    // Parse the string back to an object
    // Replace AST-specific property names with prefixed versions
    // This prevents these technical properties from conflicting with task properties
    // let task = {}
    // cleanObject.properties.forEach(function(node){
    //   task[node.key.name]='something';
    // })
    // const output = generate(JSON.parse(cleanObject), { /* options */ });
    const output = generator.default(JSON.parse(cleanObject), {
      jsonCompatible: true,
      // quotes: 'double',
      // compact: false
    });
    
    // Parse and stringify to remove null values and ensure proper JSON formatting
    // const jsonOutput = JSON.stringify(
    //   JSON.parse(output.code, (key, value) => value === null ? undefined : value),
    //   null,
    //   2
    // );
    output.code = output.code.replace('fn:\n','');

    // let task = JSON.parse(output.code);
    const task = eval(`(${output.code})`);
    const jsonString = JSON.stringify(eval(`(${output.code})`), null, 2);
    // console.log(jsonString);

    // fs.writeFileSync('./temp/output.json', output.code, 'utf-8');
    // fs.writeFileSync('./temp/jsonString.json', jsonString, 'utf-8');
    // fs.writeFileSync('./temp/output.json', JSON.stringify(output.code,null,2), 'utf-8');

    const taskConfig = JSON.parse(cleanObject.replace(/"type":|"start":|"end":|"loc":|"range":/g, '"_$1":'));
    // fs.writeFileSync('./temp/taskConfig.json', JSON.stringify(taskConfig,null,2), 'utf-8');
    
    // fs.writeFileSync('./temp/taskConfig.json', JSON.stringify(taskConfig,null,2), 'utf-8');
    // Extract only the properties we care about
    // Remove all the AST-specific properties using destructuring
    // ...finalConfig contains all the remaining properties we want to keep
    
    
    // Return the clean task configuration object
    return task;

  } catch (err) {
    // If any error occurs during parsing, log it and return null
    console.error(`Error parsing task file ${filePath}:`, err);
    return null;
  }
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
      const task = await parseTaskFile(filePath);
      const taskName = path.basename(filePath);
      let folderName = file.split('/')
      folderName.pop();
      folderName=folderName.join('/');
      // return [taskName, task.default];
      return [task?.slug, {...task,...{__file_name:taskName,__folder:folderName}}];
    })
  );
  // console.log(tasks);

  // Convert array of entries to an object
  const taskMap = Object.fromEntries(tasks);
  
  // console.log(taskMap);

  // Write the generated code to a file
  const outputCode = JSON.stringify(taskMap,null,2);
  const outputFile = path.resolve(process.cwd(),'.microlight', 'taskMap.json');
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