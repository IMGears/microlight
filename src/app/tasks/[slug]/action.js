"use server";

import getTaskDetails from "@/lib/getTaskDetails";
import microlightDB from "@/database/microlight";
// import queue from "@/lib/betterQueue";
// const { importQueue } = await import('@/lib/queue');
import { importQueue } from "@/lib/queue";

import async from 'async'

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
    executeTask:['createRun',async function(results){
      let params = {
        slug: task.slug
      }

      let taskDef = await getTaskDetails({params})
      let ml = {
        log:function(text){
          console.log('will push this log to the db');
          microlightDB.Logs.create({
            created_at:new Date(),
            type:'log',
            content:text,
            run:results.createRun.id,
          })
        }
      };
      await taskDef.fn(ml,formData);
    }],
    updateRun:['executeTask', async function(results){
      return await microlightDB.Runs.update(
        {
          status: 'complete'
        },
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