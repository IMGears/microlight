import ViewTask from "./ViewTask";
import { notFound } from 'next/navigation';

async function getTaskDetails({params}) {
  try {
    const fullPath = require.resolve(`@/tasks/${params.slug}.task.js`);
    
    // Extract just the part after /tasks/ and clean up the path
    const folderPath = fullPath
      .split('/tasks/')[1]                    // Get everything after /tasks/
      .split(`/${params.slug}.task.js`)[0];   // Remove the " [app-rsc] (ecmascript)" part
    
    const taskConfig = await import(`@/tasks/${params.slug}.task.js`);
    return {
      ...taskConfig.default,
      _folderPath: folderPath
    };
  } catch(e) {
    if (e.code === 'MODULE_NOT_FOUND') 
      notFound();
    throw e;
  }
}

export default async function Page({params, searchParams}){
  params = await params;
  const task = await getTaskDetails({params});
  
  return <ViewTask params={params} task={task} searchParams={searchParams}/>
}