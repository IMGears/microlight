import getTaskDetails from "@/lib/getTaskDetails";
import ViewTask from "./ViewTask";
import async from 'async';
import microlightDB from "@/database/microlight";
import { orderBy } from "lodash";

export default async function Page({params, searchParams}){
  params = await params;
  
  const workflow = {
    getTask:async function(){
      const task = await getTaskDetails({params});
      delete task.fn;
      return task
    },
    getRuns:async function(){
      return await microlightDB.Run.findAll({
        where:{task:params.slug},
        raw:true,
        order:[
          ['updated_at','DESC']
        ]
      })
    },
  }
  let results = await async.auto(workflow);

  return <ViewTask params={params} task={results.getTask} runs={results.getRuns} searchParams={searchParams}/>
}