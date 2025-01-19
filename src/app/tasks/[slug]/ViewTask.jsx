'use client';
import { Container, Typography, Box, Card, ButtonGroup, Button, Table, Link, Chip } from '@mui/joy';
import PageHeader from '@/components/PageHeader';
import SendIcon from '@mui/icons-material/Send';
import MLInput from '@/components/MLInput';
import { useState } from 'react';
import { executeTask } from './action';
import { redirect } from 'next/navigation';
import StatusChip from '@/components/StatusChip';

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

export default function ViewTask({params, task, runs,searchParams}) {
  const breadcrumbs = generateBreadcrumbs({task});
  const [loading,setLoading]=useState(false);
  
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    let result = await executeTask({formData,task})
    if(result.success)
      // console.log('something went wrong');
      console.log(`/tasks/${task.slug}/runs/${result.run.id}`)
      redirect(`/tasks/${task.slug}/runs/${result.run.id}`)
  };
  return (
    <Container>
      <PageHeader 
        breadcrumbs={breadcrumbs} 
        header={{
          part1: 'Task:',
          part2: task.name
        }}
        icon={<SendIcon sx={{color: '#6435c9'}} />}
      />
      <Typography level="body-sm">{task.description}</Typography>
      <Card sx={{mt:2,backgroundColor:'transparent',maxWidth:400}}>
        {/* {Object.keys(task.inputs)} */}
        <form onSubmit={handleSubmit}>
          {Object.keys(task.inputs).map((slug)=><>
            <MLInput key={slug} slug={slug} def={task.inputs[slug]}/>
          </>)}
          <ButtonGroup spacing={1} >
            {/* <Button type="submit" fullWidth color="primary" variant="solid" startDecorator={<FilterAltIcon />}>Apply filter</Button> */}
            <Button loading={loading} disabled={loading} type="submit" color='primary'  variant="solid">Execute task</Button>
            {/* <Button loading={loading} disabled={loading} type="submit" color='primary' sx={{bgcolor:'#6435c9',borderRadius:3}} variant="solid">Execute task</Button> */}
            {/* <Button variant="outlined" onClick={handleReset}>Reset</Button> */}
            {/* <Button disabled={loading.apply} loading={loading.reset} fullWidth variant="outlined" color="primary" onClick={handleReset} >Reset</Button> */}
          </ButtonGroup>
        </form>
      </Card>
      <Typography level="title-lg" sx={{mt:3}}>Recent runs:</Typography>
      {/* <pre>{JSON.stringify(runs,null,2)}</pre> */}
      
      <Table 
        variant='outlined' 
        aria-label="task runs table" 
        size='md'
        sx={{
          mt: 1,
          maxWidth: 600,
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
            <th style={{ width: '30%' }}>Created At</th>
            <th style={{ width: '30%' }}>ID</th>
            <th>Status</th>
            <th style={{ width: '58px' }}>Duration</th>
            <th>By</th>
            {/* <th>User</th> */}
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => (
            <tr key={run.id}>
              <td>{new Date(run.updated_at).toLocaleString()}</td>
              <td>
                <Link href={`/tasks/${params.slug}/runs/${run.id}`} level="body-sm">
                  {task.slug} #{run.id}
                </Link>
              </td>
              <td>
                <StatusChip status={run.status} />
              </td>
              <td style={{textAlign: 'right'}}>{run.duration/1000||0}s</td>
              <td>{run.by||'user'}</td>
              {/* <td>{run.user}</td> */}
            </tr>
          ))}
        </tbody>
      </Table>
      {/* Add your task execution UI components here */}
      
      {/* Uncomment for debugging */}
      {/* <pre>{JSON.stringify(task, null, 2)}</pre> */}
    </Container>
  );
}