import { notFound } from 'next/navigation';
import { importTaskModule } from '@/tasks/importTaskModule';

export default async function getTaskDetails({params}) {
  try {
    let taskConfig = await importTaskModule(params.slug)
    return {
      ...taskConfig.default,
      // _folderPath: folderPath
      _folderPath: '1.intro'
    };
  } catch(e) {
    if (e.code === 'MODULE_NOT_FOUND') 
      notFound();
    throw e;
  }
}