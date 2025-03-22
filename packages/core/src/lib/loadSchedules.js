import cron from "node-cron";
import taskMap from "@microlight/local/taskMap";
import async from 'async';
import executeRun from "./executeRun";
import microlightDB from "@/database/microlight";

async function executeTask({inputs, task}) {
  
  const workflow = {
    createRun:async function(){
      let run =  await microlightDB.Runs.create({
        task:task.slug,
        logs:{},
        inputs:inputs,
        triggered_by:'schedule',
        status:'pending',
      },{returning:true})
      return run.toJSON();
    },
    startRun:['createRun', async function(results){
      process.nextTick(() => executeRun(results.createRun));
      return;
    }],
  }
  try{
    const results = await async.auto(workflow);
    return {success:true,run:results.createRun};
  }catch(e){
    return {success:false,error:e}
  }
}


export default async function loadSchedules() {
  let schedules=[];
  Object.keys(taskMap).forEach(function(task_slug){
    const task = taskMap[task_slug];
    // Check if task has schedules
    if (task.is_enabled && task.schedules && Array.isArray(task.schedules)) {
      task.schedules.forEach(scheduleConfig => {
        if (scheduleConfig.is_enabled && scheduleConfig.schedule) {
          // Create cron job
          const job = cron.schedule(
            scheduleConfig.schedule, 
            async () => {
              try {
                console.log('trigger the task')
                // Execute task with schedule-specific inputs
                await executeTask({inputs:scheduleConfig.inputs || {},task})
              } catch (error) {
                console.error(`Error executing scheduled task ${task.slug}:`, error);
              }
            },
            {
              timezone:scheduleConfig.timezone || process.env.ML_CRON_TIMEZONE
            }
          );
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