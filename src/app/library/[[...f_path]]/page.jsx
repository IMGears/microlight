import ViewFolder from "./ViewFolder";

export default async function Page({ params }) {
  params = await params;
  // When accessing /library, params.f_path will be undefined
  // When accessing /library/a/b, params.f_path will be ['a', 'b']
  return <ViewFolder params={params}/>
} 