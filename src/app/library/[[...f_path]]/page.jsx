import ViewFolder from "./ViewFolder";
import fs from 'fs';
import { notFound } from 'next/navigation';
const project_folder = process.cwd()+'/src/tasks/';

async function getFolderDetails({params}){
  let folder = {}
  const dir = params?.f_path?.join('/')||'';
  let folderConfig={};
  if(dir)
    folderConfig = await import(`@/tasks/${dir}/microlight.folder.js`);
  else
    folderConfig.default={
      name:'Library',
      description:'All executable tasks'
    }
  return folderConfig.default;
}

async function getContents({params}){
  const dir = params?.f_path?.join('/')||'';
  const fileList = fs.readdirSync(project_folder+dir); 
  let contents =[];
  for (const filename of fileList) {
    const file = project_folder+`${dir}/${filename}`
    console.log(file);
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
    console.log(filename);
  }
  return contents;
}



export default async function Page({ params }) {
  params = await params;
  let folder={};
  let contents=[];
  try{
    folder = await getFolderDetails({params});
    contents = await getContents({params});
  }catch(e){
    if (e.code === 'MODULE_NOT_FOUND') 
      notFound();
  }
  
  // console.log('\n\n\n======');
  
  // When accessing /library, params.f_path will be undefined
  // When accessing /library/a/b, params.f_path will be ['a', 'b']
  return <ViewFolder params={params} folder={folder} contents={contents}/>
} 