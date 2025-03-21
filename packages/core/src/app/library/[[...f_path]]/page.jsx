import ViewFolder from "./ViewFolder";
import fs from 'fs';
import { notFound } from 'next/navigation';
import folderConfigs from '@/tasks/folders';

const project_folder = process.cwd()+'/src/tasks/';

async function getFolderDetails({params}){
  const dir = params?.f_path?.join('/')||'';
  console.log('\n\n\n\n======');
  console.log("dir - ",dir);
  let folderConfig={};
  folderConfig = folderConfigs[dir];
  console.log(folderConfig);
  // console.log('\n\n\n\n\n===========');
  // console.log(dir)
  // console.log(folderConfigs)
  // console.log(folderConfig)
  return folderConfig;
}

async function getContents({params}){
  const dir = params?.f_path?.join('/')||'';
  const fileList = fs.readdirSync(project_folder+dir); 
  let contents =[];
  for (const filename of fileList) {
    const file = project_folder+`${dir}/${filename}`
    // console.log(file);
    if (fs.statSync(file).isDirectory()) {
      if (fs.existsSync(file+'/microlight.folder.js')){
        let configPath = '';
        if (dir) {
            configPath = `${dir}/${filename}`;
        } else {
            configPath = filename;
        }
        
        try{
          // Using a more specific dynamic import pattern
          const folderConfig = await import(`@/tasks/${configPath}/microlight.folder.js`);
          // console.log(folderConfig);
          let item = {
            type: 'folder',
            slug: filename,
            ...folderConfig.default
          }
          contents.push(item);
        }catch(e){
          // dont do anything if not able to find or read the file correctly
        }
      }
    }else{
      if(filename.indexOf('.task.js') > -1){
        try{
          const taskConfig = await import('@/tasks/'+dir+'/'+filename);
          let item = {
            type:'task',
            slug:taskConfig.slug,
            ...taskConfig.default
          }
          contents.push(item);
        }catch(e){
          // dont do anything if not able to find or read the file correctly
        }
      }
    }
    // console.log(filename);
  }
  return contents;
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