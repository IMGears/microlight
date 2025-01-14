import ViewTask from "./ViewTask";

export default async function Page({params,searchParams}){
  params = await params;
  return <ViewTask params={params} searchParams={searchParams}/>
}