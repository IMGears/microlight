import { Container, Typography, Box } from '@mui/joy';
import PageHeader from '@/components/PageHeader';
import SendIcon from '@mui/icons-material/Send';

function generateBreadcrumbs({task}) {
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
      text:task.slug
    })
  }

  return breadcrumbs;
}

export default function ViewTask({params, task, searchParams}) {
  const breadcrumbs = generateBreadcrumbs({task});

  return (
    <Container>
      <br/>
      <PageHeader 
        breadcrumbs={breadcrumbs} 
        header={{
          part1: 'Task:',
          part2: task.name
        }}
        icon={<SendIcon sx={{color: '#6435c9'}} />}
      />
      
      <Typography level="body-sm">{task.description}</Typography>

      {/* Add your task execution UI components here */}
      
      {/* Uncomment for debugging */}
      <pre>{JSON.stringify(task, null, 2)}</pre>
    </Container>
  );
}