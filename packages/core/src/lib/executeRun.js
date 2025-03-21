"use server";

import getTaskDetails from "@/lib/getTaskDetails2";
import microlightDB from "@/database/microlight";
import generateDisplayfunctions from "@/lib/generateDisplayFunctions";

import async from 'async';
export default async function executeRun(run){
  const workflow = {
    startRun:async function(){
      let started_at = new Date();
      await microlightDB.Runs.update(
        {
          status: 'running',
          started_at:started_at,
          updated_at:started_at,
        },
        {
          where: { id: run.id },
          returning: true
        }
      );
      return started_at;
    },
    executeTask:['startRun',async function(results){
      let params = {
        slug: run.task
      }

      let taskDef = await getTaskDetails({params})
      const ml = generateDisplayfunctions(run.id)
      try{
        await taskDef.fn(ml,run.inputs);
        await ml.log('=== ML: run completed ===');
        return {status:'complete'};
      }catch(e){
        await ml.error(e);
        await ml.log('=== ML: run completed ===');
        return {status:'failed'};
      }
    }],
    updateRun:['executeTask', async function(results){
      let update ={
        status:results.executeTask?.status,
        completed_at:new Date(),
        updated_at:new Date(),
      }
      update.duration=update.completed_at-results.startRun;
      return await microlightDB.Runs.update(
        update,
        {
          where: { id: run.id },
          returning: true
        }
      );
    }],
    // addToQueue:['createRun',function(results,cb){
    //   // let options ={
    //   //   task_slug:run.task,
    //   // }
    //   // queue.daily_mis_report.push(options,cb)
    // }],
    // triggerRun:['createRun',async function(results){
    //   // await tasksQueue.add(run.task, { foo: 'bar' });
    //   // await importQueue.add(run.task, { foo: 'bar' });
    //   // const handle = await tasks.trigger(
    //   //   "hello-world",
    //   //   "James"
    //   // );
    //   // return { handle };
    // }]
  }
  const results = await async.auto(workflow);
  console.log(results);
  return { success: true };
}