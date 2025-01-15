import PageHeader from "@/components/PageHeader";
import { Container } from "@mui/joy";

function generateBreadcrumbs({task,params}) {
  let breadcrumbs = [
    {
      text: "Library",
      href: "/library"
    }
  ];

  // Add task path segments to breadcrumbs if available
  if (task._folderPath) {
    const f_path = task._folderPath.split('/');
    let folderPath = '/library';
    
    f_path.forEach((folder, index) => {
      folderPath += '/' + folder;
      breadcrumbs.push({
        text: folder,
        href: folderPath
      });
    });
    breadcrumbs.push({
      text:task.slug,
      href: '/tasks/'+task.slug
    })
    breadcrumbs.push({
      text:params.r_id,
    })
  }

  return breadcrumbs;
}
export function ViewRun({params,task,run}){
  const breadcrumbs = generateBreadcrumbs({task,params});
  return <>
    <Container>
      <PageHeader 
        breadcrumbs={breadcrumbs} 
        header={{
          part1: 'Task Run:',
          part2: task.name
        }}
        // icon={<SendIcon sx={{color: '#6435c9'}} />}
      />
      View Run
      <pre>{JSON.stringify(task,null,2)}</pre>
      <pre>{JSON.stringify(run,null,2)}</pre>
    </Container>
  </>
}