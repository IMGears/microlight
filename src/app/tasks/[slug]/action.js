"use server";

import getTaskDetails from "@/lib/getTaskDetails";
import microlightDB from "@/database/microlight";
import async from 'async'

export async function executeTask({formData, task}) {
  

  let params = {
    slug: task.slug
  }
  
  let taskDef = await getTaskDetails({params})
  let ml = {
    log:function(){
      console.log('ml log here');
    }
  };
  // await taskDef.fn(ml,formData);
  const workflow = {
    createRun:async function(){
      await microlightDB.Run.create({
        task:task.slug,
        logs:{},
        inputs:Object.fromEntries(formData?.entries()),
        triggered_by:'user',
      })
    }
  }
  const results = await async.auto(workflow);
  // console.log(task);
  return { success: true };
}