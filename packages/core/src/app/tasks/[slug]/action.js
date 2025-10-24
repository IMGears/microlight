"use server";
import async from 'async'
import microlightDB from "@/database/microlight";
import executeRun from '@/lib/executeRun';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

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
      results.createRun.inputs = Object.fromEntries(formData?.entries());  // This is a file object and not being propelry serialized by run.toJSON()
      process.nextTick(() => executeRun(results.createRun));
      return;
    }],
  }
  try{
    const results = await async.auto(workflow);
    // console.log(results);
    revalidatePath(`/tasks/${task.slug}`);
    return {success:true,run:results.createRun};
  }catch(e){
    return {success:false,error:e}
  }
  
}