import ViewFolder from "./ViewFolder";
import fs from 'fs';
import { notFound } from 'next/navigation';
import folderMap from '@microlight/local/folderMap';

const project_folder = process.cwd()+'/src/tasks/';

async function getFolderDetails({params}){
  const dir = params?.f_path?.join('/')||'';
  // console.log('\n\n\n\n======');
  // console.log("dir - ",dir);
  let folderConfig={};
  folderConfig = folderMap[dir];
  // console.log(folderConfig);
  // console.log('\n\n\n\n\n===========');
  // console.log(dir)
  // console.log(folderMap)
  // console.log(folderConfig)
  return folderConfig;
}



export default async function Page({ params }) {
  params = await params;
  let folder={
    contents:[]
  };
  let contents=[];
  try{
    folder = await getFolderDetails({params});
  }catch(e){
    if (e.code === 'MODULE_NOT_FOUND') 
      notFound();
  }
  
  // console.log('\n\n\n======');
  
  // When accessing /library, params.f_path will be undefined
  // When accessing /library/a/b, params.f_path will be ['a', 'b']
  return <ViewFolder params={params} folder={folder} contents={folder.contents}/>
} 