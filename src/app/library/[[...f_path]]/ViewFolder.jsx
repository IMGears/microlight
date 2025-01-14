export default function ViewFolder({params,folder,fileList}){
  // params.f_path will be an array containing all segments after /library/
  // e.g. for /library/level1/level2/level3
  // params.f_path = ['level1', 'level2', 'level3']
  return <>
    <div>
      <p>Folder path: /{params?.f_path?.join('/')||''}</p>
      <pre>{JSON.stringify(fileList,null,2)}</pre>
    </div>
  </>
}