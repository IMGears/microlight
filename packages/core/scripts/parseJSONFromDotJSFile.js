import fs from 'fs';
import { parse } from '@babel/parser';
export const parseJSONFromDotJSFile = (filePath) => {
  console.log(filePath);
  // Read the contents of the file as UTF-8 text
  const content = fs.readFileSync(filePath, 'utf-8');
  
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

    // Convert AST to string, replacing function values with null
    // Convert the AST object to a string, with a custom replacer function
    const cleanObject = JSON.stringify(objectAst, (key, value) => {
      // If the value is a function (any type of function), replace it with null
      if (value?.type === 'FunctionExpression' || 
          value?.type === 'ArrowFunctionExpression' ||
          value?.type === 'FunctionDeclaration') {
        return null;
      }
      // Keep all other values as is
      return value;
    });

    // Parse the cleaned object to get the final result
    // Parse the string back to an object
    // Replace AST-specific property names with prefixed versions
    // This prevents these technical properties from conflicting with task properties
    const taskConfig = JSON.parse(cleanObject.replace(/"type":|"start":|"end":|"loc":|"range":/g, '"_$1":'));
    
    // Extract only the properties we care about
    // Remove all the AST-specific properties using destructuring
    // ...finalConfig contains all the remaining properties we want to keep
    const { _type, _start, _end, _loc, _range, ...finalConfig } = taskConfig;
    
    // Return the clean task configuration object
    return finalConfig;

  } catch (err) {
    // If any error occurs during parsing, log it and return null
    console.error(`Error parsing task file ${filePath}:`, err);
    return null;
  }
};