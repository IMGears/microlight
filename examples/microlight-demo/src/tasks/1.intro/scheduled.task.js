import { schedule } from "node-cron";

const task = {
  slug: 'scheduled',
  name: 'Scheduled task',
  description: 'This task runs every 2 mins',
  inputs: {}, // maybe should be called inputFields
  schedules:[
    {
      schedule:'*/2 * * * *',
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
