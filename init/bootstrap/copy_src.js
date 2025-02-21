const fs = require('fs');
const path = require('path');

// Function to recursively copy directory
function copyDir(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Move files before initializing Next.js
const srcDir = './src';
const destDir = './.microlight/microlight/src';

if (fs.existsSync(srcDir)) {
  copyDir(srcDir, destDir);
  console.log('Successfully moved files from /src to .microlight/microlight/src');
}