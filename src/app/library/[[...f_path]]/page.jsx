import ViewFolder from "./ViewFolder";
import fs from 'fs';

export default async function Page({ params }) {
  params = await params;
  const fileList = fs.readdirSync(process.cwd()+'/src/tasks/'+params?.f_path?.join('/')); 
  let content =[];
  let folder = {};
  // fileList.forEach(function())
  // When accessing /library, params.f_path will be undefined
  // When accessing /library/a/b, params.f_path will be ['a', 'b']
  return <ViewFolder params={params} folder={folder} fileList={fileList}/>
} 