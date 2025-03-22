import { schedule } from "node-cron";

const task = {
  slug: 'multiple_schedules',
  name: 'Multiple Scheduled task',
  is_enabled:true,
  description: 'This task runs every 2 mins with different payload',
  inputs: {}, // maybe should be called inputFields
  schedules:[
    {
      schedule:'* * * * *',
      is_enabled:true,
      inputs:{

      }
    }
  ],
  fn: async function (ml, inputs) {
    await ml.log('This is a scheduled task. Will run every 2 mins');
  }
};


export default task;
