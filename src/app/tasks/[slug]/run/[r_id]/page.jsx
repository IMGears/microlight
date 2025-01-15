import getTaskDetails from "@/lib/getTaskDetails";
import { ViewRun } from "./ViewRun";


export default async function Page({params, searchParams}){
  params = await params;
  const task = await getTaskDetails({params});
  const run = {};
  delete task.fn;
  
  return <ViewRun params={params} task={task} run={run} searchParams={searchParams}/>
}