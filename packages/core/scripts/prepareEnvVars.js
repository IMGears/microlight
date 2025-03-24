import path from "path";
import fs from "fs";
import { copySync } from "fs-extra";

export async function prepareEnvVars(){
  console.log('preparing environment variables');
  
  // Destination path
  const serverDestDir = path.join(process.cwd(), ".microlight", "server");


  // Copy .env file if it exists
  const envFilePath = path.join(process.cwd(), '.env');
  const envFileDestPath = path.join(serverDestDir, '.env');
  
  if (fs.existsSync(envFilePath)) {
    copySync(envFilePath, envFileDestPath, { overwrite: true });
    console.log(".env file copied successfully!");
  }

  
}