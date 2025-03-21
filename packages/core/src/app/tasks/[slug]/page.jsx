import getTaskDetails from "@/lib/getTaskDetails2";
import ViewTask from "./ViewTask";
import async from 'async';
import microlightDB from "@/database/microlight";
import { orderBy } from "lodash";

export default async function Page({params, searchParams}){
  params = await params;
  searchParams = await searchParams;
  
  const workflow = {
    getTask:async function(){
      const task = await getTaskDetails({params});
      delete task.fn;
      return task
    },
    getRuns:async function(){
      let runs = await microlightDB.Runs.findAll({
        where: {task: params.slug},
        order: [
          ['updated_at','DESC']
        ]
      })
      runs = runs.map(r => r.toJSON());
      return runs;
    },
  }
  let results = await async.auto(workflow);

  return <ViewTask params={params} task={results.getTask} runs={results.getRuns} searchParams={searchParams}/>
}