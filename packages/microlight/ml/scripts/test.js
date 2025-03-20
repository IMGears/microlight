const pm2 = require('pm2');

// Function to connect to PM2 and fetch metrics
const getPm2Metrics = () =>
  new Promise((resolve, reject) => {
    pm2.list((err, processList) => {
      if (err) return reject(err);

      const metrics = processList.map((process) => ({
        name: process.name,
        pm_id: process.pm_id,
        cpu: process.monit.cpu,
        memory: (process.monit.memory / 1024 / 1024).toFixed(2), // Convert to MB
      }));

      resolve(metrics);
    });
  });

// Function to log PM2 metrics to file
const logPm2Metrics = async () => {
  const fs = require('fs');
  const path = require('path');
  const outputPath = path.join(__dirname, '../../temp/pm2-metrics.json');

  try {
    const metrics = await getPm2Metrics();
    fs.writeFileSync(outputPath, JSON.stringify(metrics, null, 2));
    console.log(`PM2 metrics written to: ${outputPath}`);
  } catch (error) {
    console.error('Error getting PM2 metrics:', error.message);
  } finally {
    pm2.disconnect(); // Disconnect from PM2
  }
};

// Execute the logging function
logPm2Metrics();