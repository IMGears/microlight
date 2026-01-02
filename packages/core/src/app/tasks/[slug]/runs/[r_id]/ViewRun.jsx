'use client';
import PageHeader from "@/components/PageHeader";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import StatusChip from "@/components/StatusChip";
import DropdownActions from "./_components/DropdownActions/DropdownActions";
import { Typography } from '@/components/ui/typography';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function generateBreadcrumbs({task,params}) {
  let breadcrumbs = [
    {
      text: "Library",
      href: "/library"
    }
  ];
  // Add task path segments to breadcrumbs if available
  if (task.__folder) {
    const f_path = task.__folder.split('/');
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
  let RightButtons= function(){
    return (
      <DropdownActions run={run}/>
    )
  }
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

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        breadcrumbs={breadcrumbs}
        header={{
          part1: 'Task Run:',
          part2: task.name
        }}
        RightButtons={RightButtons}
      />
      <div className="mt-2 max-w-[500px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Created At</TableHead>
              <TableHead>Started At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[58px]">Duration</TableHead>
              <TableHead>By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{new Date(run.created_at).toLocaleString()}</TableCell>
              <TableCell>{run.started_at && new Date(run.started_at).toLocaleString()}</TableCell>
              <TableCell><StatusChip status={run.status} /></TableCell>
              <TableCell className="text-right">{run.duration/1000||0}s</TableCell>
              <TableCell>{run.by||'user'}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <Typography level="title-lg" className="mt-6 mb-2">Payload:</Typography>
      <pre>{JSON.stringify(run.inputs,null,2)}</pre>

      <Typography level="title-lg" className="mt-6 mb-2">Logs:</Typography>
      <div className="bg-white border rounded-md">
        <Table>
          <TableBody>
            {logs.map((log, index) => (
              <TableRow key={index}>
                <TableCell className="w-[90px] p-2 pl-4 align-top">
                  <Typography level="body-sm" className="font-mono">
                    {new Date(log.created_at).toLocaleTimeString()}
                  </Typography>
                </TableCell>
                <TableCell className="p-2 align-top">
                  {log.type=='markdown' ? (
                    <Alert className="bg-sky-50 border-sky-200 text-sky-800">
                      <AlertDescription>
                        <div dangerouslySetInnerHTML={{ __html: log.content }} />
                      </AlertDescription>
                    </Alert>
                  ) : log.type=='json' ? (
                    <div className="h-[300px] bg-purple-100 overflow-y-scroll">
                      <pre className="p-0 m-0">
                        {JSON.stringify(JSON.parse(log.content), null, 2)}
                      </pre>
                    </div>
                  ) : log.type=='error' ? (
                    <Alert variant="destructive" className="overflow-auto scrollbar-hide">
                      <AlertDescription>
                        <h4 className="font-semibold">Error: {JSON.parse(log.content)?.message}</h4>
                        <pre className="text-xs mt-2 whitespace-pre-wrap">{JSON.parse(log.content)?.stack}</pre>
                      </AlertDescription>
                    </Alert>
                  ) : log.type=='warn' ? (
                    <Alert variant="warning" className="py-2">
                      <AlertDescription>{log.content}</AlertDescription>
                    </Alert>
                  ) : log.type=='info' ? (
                    <Alert className="py-2 bg-blue-50 border-blue-200 text-blue-800">
                      <AlertDescription>{log.content}</AlertDescription>
                    </Alert>
                  ) : log.type=='danger' ? (
                    <Alert variant="destructive" className="py-2">
                      <AlertDescription>{log.content}</AlertDescription>
                    </Alert>
                  ) : log.type=='success' ? (
                    <Alert variant="success" className="py-2">
                      <AlertDescription>{log.content}</AlertDescription>
                    </Alert>
                  ) : (
                    <Typography level="body-sm" className="font-mono">{log.content}</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
