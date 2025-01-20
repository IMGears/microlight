import cron from "node-cron";
import getAllTasks from "./getAllTasks";


export default async function loadSchedules() {
  const tasks = await getAllTasks();
  let schedules=[];
  tasks.forEach(function(task){
    // Check if task has schedules
    if (task.schedules && Array.isArray(task.schedules)) {
      task.schedules.forEach(scheduleConfig => {
        if (scheduleConfig.is_enabled && scheduleConfig.schedule) {
          // Create cron job
          const job = cron.schedule(scheduleConfig.schedule, async () => {
            try {
              // Execute task with schedule-specific inputs
              await task.fn({ log: console.log }, scheduleConfig.inputs || {});
            } catch (error) {
              console.error(`Error executing scheduled task ${task.slug}:`, error);
            }
          },{
            timezone:scheduleConfig.timezone || process.env.CRON_TIMEZONE
          });
          schedules.push({
            task,
            schedule: scheduleConfig,
            job
          });
        }
      });
    }
  })
  console.log('Count of schedules :'+schedules.length);
  console.log(schedules);
  return schedules;
}