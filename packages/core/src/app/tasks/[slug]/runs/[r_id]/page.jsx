import getTaskDetails from "@/lib/getTaskDetails2";
import ViewRun from "./ViewRun";
import async from 'async';
import microlightDB from "@/database/microlight";

export default async function Page({params, searchParams}){
  params = await params;
  searchParams = await searchParams;
  
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
      });
      return run.toJSON();
    },
    getLogs:async function(){
      let logs = await microlightDB.Logs.findAll({
        where:{
          run:params.r_id,
        },
        order:[
          ['created_at','ASC']
        ]
      });
      logs = logs.map(l => l.toJSON())
      return logs;
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