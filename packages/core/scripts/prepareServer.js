import path from "path";
import fs from "fs";
import { copySync } from "fs-extra";
import { createRequire } from "module";
const require = createRequire(import.meta.url); // Required for resolving CommonJS modules

export async function prepareServer(){
  console.log('preparing the server');
  const coreModulePath = require.resolve("@microlight/core/package.json"); // Find package.json
  const coreRoot = path.dirname(coreModulePath); // Get package root
  console.log(coreModulePath);
  console.log(coreRoot);
  const serverSrcDir = path.join(coreRoot, "dist", "server"); // Resolve /dist/server
  console.log(serverSrcDir)

  // Destination path
  const processDir = process.cwd();
  const serverDestDir = path.join(processDir, ".microlight", "server");

  console.log("serverSrcDir:", serverSrcDir);
  console.log("serverDestDir:", serverDestDir);
  
  // Ensure destination exists
  if (!fs.existsSync(serverDestDir)) {
    fs.mkdirSync(serverDestDir, { recursive: true });
  }

  // Copy files
  copySync(serverSrcDir, serverDestDir, { overwrite: true });

  console.log("Server files copied successfully!");
}