
export const register = async () => {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Dynamically import loadSchedules only when we're in Node.js runtime
    const { default: loadSchedules } = await import('./lib/loadSchedules');
    await loadSchedules();
    // const interval = setInterval(async () => {
    //   await executeRuns();
    //   console.log('Instrumentation check running...');
    // }, 5000);

    // Clean up interval on process exit
    process.on('SIGTERM', () => {
      clearInterval(interval);
    });


    
  }
}
