'use client';
import PageHeader from "@/components/PageHeader";
import { Container,Table,Link,Chip,Typography,Sheet,Alert } from "@mui/joy";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import StatusChip from "@/components/StatusChip";

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
export default function ViewRun({params,task,run,logs}){
  const breadcrumbs = generateBreadcrumbs({task,params})
  const router = useRouter();
  
  useEffect(() => {

    let intervalId;
    if (run.status === 'running' || run.status === 'pending') {
      intervalId = setInterval(() => {
        // Refresh the page data using router.refresh()
        router.refresh();
      }, 500);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [run]);

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
            
            <td><StatusChip status={run.status} /></td>
            <td style={{textAlign: 'right'}}>{run.duration/1000||0}s</td>
            <td>{run.by||'user'}</td>
            {/* <td>{run.user}</td> */}
          </tr>
        </tbody>
      </Table>
      <Typography level="title-lg" sx={{mt:3,mb:1}}>Logs:</Typography>
      <Sheet sx={{bgcolor:'white'}}>
        <Table
          borderAxis="xBetween"
          size="md"
          variant="outlined"
          sx={{
            border:'1px solid #d9dada',
            '--TableCell-borderColor': '#ebebeb'
          }}
        >
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td style={{width:90, padding:7,paddingLeft:14, verticalAlign: 'top',height:'auto'}}>
                  <Typography level="body-sm" fontFamily="monospace">
                    {new Date(log.created_at).toLocaleTimeString()}
                  </Typography>
                </td>
                <td style={{ padding:7, verticalAlign: 'top',height:'auto'}}>
                  {log.type=='markdown' ? (
                    <Alert variant='soft' color="primary" sx={{
                      p:2,
                      pb:0,
                      // bgcolor:'#e3fbe3',
                      bgcolor:'#f8ffff',
                      color:'#276f85',
                      border: '1px solid #a8d4dd',
                      '& h4, & h3,':{
                        mt:0,
                      }
                    }}>
                      <div className='' dangerouslySetInnerHTML={{ __html: log.content }} />
                    </Alert>
                    
                  ) : log.type=='json' ? (
                    <pre className="json-renderer" style={{ padding: 0, margin: 0 }}>
                      {JSON.stringify(JSON.parse(log.content), null, 2)}
                    </pre>
                  ) : log.type=='error' ? (
                    <Alert variant='soft' color="danger" sx={{
                      p:2,
                      pb:0,
                      overflow:'auto',
                      '&::-webkit-scrollbar': {
                        display: 'none'
                      },
                      scrollbarWidth: 'none',  // Firefox
                      msOverflowStyle: 'none',  // IE and Edge
                      // bgcolor:'#e3fbe3',
                      // bgcolor:'#f8ffff',
                      // color:'#276f85',
                      border: '1px solid #e0b4b4',
                      '& h4, & h3,':{
                        mt:0,
                      }
                    }}>
                      <div>
                      <h4>Error : {JSON.parse(log.content)?.message}</h4>
                      {JSON.parse(log.content)?.stack}
                      
                      </div>
                    </Alert>
                  ) : (
                    <Typography level="body-sm" fontFamily="monospace">{log.content}</Typography>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
      <br/>
      {/* <pre>{JSON.stringify(task,null,2)}</pre> */}
      {/* <pre>{JSON.stringify(run,null,2)}</pre> */}
    </Container>
  </>
}