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
      let run = await microlightDB.Runs.findOne({
        where:{
          task:params.slug,
          id:params.r_id,
        },
        raw:true,
      });
      run.inputs=JSON.parse(run.inputs);
      return run
    },
    getLogs:async function(){
      let logs = await microlightDB.Logs.findAll({
        where:{
          run:params.r_id,
        },
        raw:true,
        order:[
          ['created_at','ASC']
        ]
      });
      return logs
    },
  }
  let results = await async.auto(workflow);
  return <ViewRun 
    params={params} 
    searchParams={searchParams}
    task={results.getTask} 
    run={results.getRun} 
    logs={results.getLogs} 
  />
}