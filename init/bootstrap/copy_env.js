const fs = require('fs');
const path = require('path');

function copyEnvFile() {
  const sourceEnv = path.join(process.cwd(), '.env');
  const targetDir = path.join(process.cwd(), '.microlight', 'next_server');
  const targetEnv = path.join(targetDir, '.env');

  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  try {
    // Check if source .env exists
    if (fs.existsSync(sourceEnv)) {
      fs.copyFileSync(sourceEnv, targetEnv);
      console.log('Successfully copied .env file to .microlight/next_server/');
    } else {
      console.warn('No .env file found in root directory');
    }
  } catch (error) {
    console.error('Error copying .env file:', error);
  }
}

copyEnvFile();
