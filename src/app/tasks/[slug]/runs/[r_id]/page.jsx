import getTaskDetails from "@/lib/getTaskDetails";
import { ViewRun } from "./ViewRun";
import async from 'async';
import microlightDB from "@/database/microlight";

export default async function Page({params, searchParams}){
  params = await params;
  
  const workflow = {
    getTask:async function(){
      const task = await getTaskDetails({params});
      delete task.fn;
      return task
    },
    getRun:async function(){
      let run = await microlightDB.Run.findOne({
        where:{
          task:params.slug,
          id:params.r_id,
        },
        raw:true,
        order:[
          ['updated_at','DESC']
        ]
      });
      run.logs=JSON.parse(run.logs);
      run.inputs=JSON.parse(run.inputs);
      return run
    },
  }
  let results = await async.auto(workflow);
  return <ViewRun params={params} task={results.getTask} run={results.getRun} searchParams={searchParams}/>
}