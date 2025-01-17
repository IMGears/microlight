import PageHeader from "@/components/PageHeader";
import { Container,Table,Link,Chip,Typography } from "@mui/joy";

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
      <Table 
        variant='outlined' 
        borderAxis="bothBetween"

        aria-label="task runs table" 
        size='md'
        sx={{
          mt: 1,
          maxWidth: 500,
          '& th': {
            height:{
              sm:"22px",
              md:"26px",
              lg:"30px"
            }
          },
          '& td': {
            height:{
              sm:"23px",
              md:"27px",
              lg:"31px"
            }
          }
        }}
      >
        <thead>
          <tr>
            {/* <th ></th> */}
            <th >Created At</th>
            <th >Started At</th>
            {/* <th >ID</th> */}
            <th>Status</th>
            <th style={{ width: '58px' }}>Duration</th>
            <th>By</th>
            {/* <th>User</th> */}
          </tr>
        </thead>
        <tbody>
          <tr key={run.id}>
            <td>{new Date(run.created_at).toLocaleString()}</td>
            <td>{run.started_at && new Date(run.started_at).toLocaleString()}</td>
            
            <td>
              <Chip
                variant="soft"
                color={run.status === 'succeeded' ? 'success' : 'danger'}
                size="sm"
              >
                {run.status||'pending'}
              </Chip>
            </td>
            <td style={{textAlign: 'right'}}>{run.duration||0}s</td>
            <td>{run.by||'user'}</td>
            {/* <td>{run.user}</td> */}
          </tr>
        </tbody>
      </Table>
      <Typography level="title-lg" sx={{mt:3}}>Logs:</Typography>
      View Run
      <pre>{JSON.stringify(task,null,2)}</pre>
      <pre>{JSON.stringify(run,null,2)}</pre>
    </Container>
  </>
}