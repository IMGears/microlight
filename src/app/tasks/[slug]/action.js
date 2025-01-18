"use server";

import getTaskDetails from "@/lib/getTaskDetails";
import microlightDB from "@/database/microlight";
// import queue from "@/lib/betterQueue";
// const { importQueue } = await import('@/lib/queue');
import { importQueue } from "@/lib/queue";

import async from 'async'


import generateDisplayfunctions from "@/lib/generateDisplayFunctions";
export async function executeTask({formData, task}) {
  

  
  
  const workflow = {
    createRun:async function(){
      let run =  await microlightDB.Runs.create({
        task:task.slug,
        logs:{},
        inputs:Object.fromEntries(formData?.entries()),
        triggered_by:'user',
        status:'pending',
      },{returning:true})
      return run.toJSON();
    },
    startRun:['createRun', async function(results){
      let started_at = new Date();
      await microlightDB.Runs.update(
        {
          status: 'running',
          started_at:started_at,
          updated_at:started_at,
        },
        {
          where: { id: results.createRun.id },
          returning: true
        }
      );
      return started_at;
    }],
    executeTask:['startRun',async function(results){
      let params = {
        slug: task.slug
      }

      let taskDef = await getTaskDetails({params})
      const ml = generateDisplayfunctions(results.createRun.id)
      await taskDef.fn(ml,formData);
    }],
    updateRun:['executeTask', async function(results){
      let update ={
        status: 'complete',
        completed_at:new Date(),
        updated_at:new Date(),
      }
      update.duration=update.completed_at-results.startRun;
      return await microlightDB.Runs.update(
        update,
        {
          where: { id: results.createRun.id },
          returning: true
        }
      );
    }],
    // addToQueue:['createRun',function(results,cb){
    //   // let options ={
    //   //   task_slug:task.slug,
    //   // }
    //   // queue.daily_mis_report.push(options,cb)
    // }],
    // triggerRun:['createRun',async function(results){
    //   // await tasksQueue.add(task.slug, { foo: 'bar' });
    //   // await importQueue.add(task.slug, { foo: 'bar' });
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