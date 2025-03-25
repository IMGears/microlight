import { notFound } from 'next/navigation';
import { importTaskModule } from "@microlight/local/importTaskModule";
import taskMap from '@microlight/local/taskMap';

export default async function getTaskDetails({params}) {
  try {
    let taskConfig = await importTaskModule(params.slug)

    return {
      ...taskMap[params.slug], // get folders path etc from here
      ...taskConfig.default, // get function to be executed from here. 
    };
  } catch(e) {
    if (e.code === 'MODULE_NOT_FOUND') 
      notFound();
    throw e;
  }
}