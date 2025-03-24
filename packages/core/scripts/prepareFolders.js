import { glob } from 'glob';
import path from 'path';
// import { join, relative, dirname } from 'path';
import fs from 'fs';

const tasksDir = path.join(process.cwd(), 'src', 'tasks');
const outputFile = path.resolve(process.cwd(),'.microlight', 'folderMap.json');
const taskMapFile = path.resolve(process.cwd(),'.microlight', 'taskMap.json');


const taskMap = JSON.parse(fs.readFileSync(taskMapFile, 'utf-8'));
// const taskMap = (await import(taskMapFile))?.default;
let taskMapByFileName = {}
Object.keys(taskMap).forEach(function(slug){
  const task = taskMap[slug];
  taskMapByFileName[task.__folder+'/'+task.__file_name]=task;
})


// Create tasks directory if it doesn't exist
if (!fs.existsSync(tasksDir)) {
  fs.mkdirSync(tasksDir, { recursive: true });
}

const getFolderFiles=function(){
  
  // Find all folder files
  const folderPatterns=[
    // '__ml.js',
    // 'ml.js',
    '**/.mlrc',
    '**/.ml.json',
    '**/.mlrc.json',
    // 'ml.folder.js',
    // '**/microlight.folder.js',
    // '**/microlight.folder.json',
  ]

  const folderFiles = glob.sync(folderPatterns, {
    cwd: tasksDir,
    absolute: false
  });
  return folderFiles;
}



export async function prepareFolders(){
  console.log('Preparing folders now');
  const folderFiles = getFolderFiles();
  
  // Import all task files dynamically
  const folders = await Promise.all(
    folderFiles.map(async (file) => {
      const filePath = path.resolve(tasksDir, file);
      let folderName = file.split('/')
      folderName.pop();
      folderName=folderName.join('/');
      // console.log(folderName);
      // let folder = (await import(filePath))?.default;
      const folder = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      // let folder = (await parseJSONFromDotJSFile(filePath));


      // console.log(folder.default);
      // const taskName = path.basename(filePath, '.task.js');
      return [folderName, folder];
      // return [task?.default?.slug, {...task?.default,...{file_name:taskName}}];
    })
  );
  // console.log(folders);

  // Convert array of entries to an object
  const folderMap = Object.fromEntries(folders);
  // console.log(folderMap);

  Object.keys(folderMap).map(folderName => {
    folderMap[folderName].contents=[];
    const contentList = fs.readdirSync(path.resolve(tasksDir, folderName)); 
    // console.log(contentList);
    for (const filename of contentList) {
      const file = path.resolve(tasksDir, folderName, filename)
      // const file = project_folder+`${dir}/${filename}`
      // console.log(file);
      if (fs.statSync(file).isDirectory()) {
        // console.log('\n\n\n====');
        // console.log(file);
        const subFolderName = file.split('/src/tasks/')[1]
        // console.log(subFolderName);
        if(folderMap[subFolderName]){
          folderMap[folderName].contents.push({
            type:'folder',
            slug:subFolderName,
            ...folderMap[subFolderName]
          })
        }
      }else{
        if(filename.indexOf('.task.js') > -1){
          // console.log('\n\n\n====');
          // console.log(filename);
          const taskName = path.basename(filename, '.task.js');
          // console.log(taskMapByFileName[folderName+'/'+filename]);
          let item = {
            type:'task',
            slug:taskName,
            ...taskMapByFileName[folderName+'/'+filename]
          }
          folderMap[folderName].contents.push(item);
          
        }
      }
      // console.log(filename);
    }
  })
  // folderMap.map(folder=>{
    
  //     
  //     folder.content = [
  //       {
  //         type:'task',
  //         slug:'takes_time'
  //       },
  //       {
  //         type:'folder',
  //         slug:'1.intro'
  //       }
  //     ]
  // })



  // Write the generated code to a file
  const outputCode = JSON.stringify(folderMap,null,2);

  // Create the output directory if it doesn't exist
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write the file
  fs.writeFileSync(outputFile, outputCode, 'utf-8');
  console.log(`Generated folder index at: ${outputFile}`); 


}
