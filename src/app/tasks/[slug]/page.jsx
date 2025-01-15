import getTaskDetails from "@/lib/getTaskDetails";
import ViewTask from "./ViewTask";

export default async function Page({params, searchParams}){
  params = await params;
  const task = await getTaskDetails({params});
  delete task.fn;
  
  return <ViewTask params={params} task={task} searchParams={searchParams}/>
}