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

  // Copy server JS files
  copySync(serverSrcDir, serverDestDir, { overwrite: true });

  // Copy static assets from src/app (globals.css, favicon.ico)
  const staticAssets = ["globals.css", "favicon.ico"];
  const srcAppDir = path.join(coreRoot, "src", "app");
  const destAppDir = path.join(serverDestDir, "app");

  for (const asset of staticAssets) {
    const srcPath = path.join(srcAppDir, asset);
    const destPath = path.join(destAppDir, asset);
    if (fs.existsSync(srcPath)) {
      copySync(srcPath, destPath, { overwrite: true });
      console.log(`Copied ${asset}`);
    }
  }

  // Copy public folder assets
  const publicSrcDir = path.join(coreRoot, "public");
  const publicDestDir = path.join(processDir, ".microlight", "server", "public");

  if (fs.existsSync(publicSrcDir)) {
    copySync(publicSrcDir, publicDestDir, { overwrite: true });
    console.log("Public assets copied successfully!");
  }

  console.log("Server files copied successfully!");
}