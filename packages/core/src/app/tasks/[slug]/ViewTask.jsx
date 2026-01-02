'use client';
import { ExternalLink } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import MLInput from '@/components/MLInput';
import { useState } from 'react';
import { executeTask } from './action';
import { redirect } from 'next/navigation';
import StatusChip from '@/components/StatusChip';
import cronstrue from 'cronstrue';
import Link from '@/components/Link';
import { Typography } from '@/components/ui/typography';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';


function generateBreadcrumbs({task}) {
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
      text:task.slug
    })
  }

  return breadcrumbs;
}



export default function ViewTask({params, task, runs,searchParams}) {
  const breadcrumbs = generateBreadcrumbs({task});
  const [loading,setLoading]=useState(false);
  const RightButtons = function(){
    return (
      <div className="flex gap-1">
        {task?.links?.map((link, index)=>{
          return (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 text-sm border rounded-md hover:bg-accent transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              {link.title}
            </a>
          )
        })}
      </div>
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    let result = await executeTask({formData,task})
    if(result.success)
      redirect(`/tasks/${task.slug}/runs/${result.run.id}`)
  };
  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        breadcrumbs={breadcrumbs}
        header={{
          part1: 'Task:',
          part2: task.name
        }}
        RightButtons={RightButtons}
      />
      <Typography level="body-sm">{task.description}</Typography>


      <Card className="mt-4 bg-transparent max-w-[400px] p-4">
        <form onSubmit={handleSubmit}>
          {Object.keys(task.inputs).map((slug)=> <MLInput key={slug} slug={slug} def={task.inputs[slug]} searchParams={searchParams}/>)}
          <div className="flex gap-2">
            <Button loading={loading} disabled={loading} type="submit">Execute task</Button>
          </div>
        </form>
      </Card>
      <Typography level="title-lg" className="mt-6">Schedules:</Typography>

      <div className="mt-2 max-w-[800px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Schedule</TableHead>
              <TableHead className="w-[150px]">Description</TableHead>
              <TableHead className="w-[300px]">Payload</TableHead>
              <TableHead>Is Enabled?</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {task?.schedules?.map((schedule,index) => (
              <TableRow key={index}>
                <TableCell>{schedule.schedule}</TableCell>
                <TableCell>
                  {cronstrue.toString(schedule.schedule)}
                </TableCell>
                <TableCell className="overflow-auto scrollbar-hide">
                  <pre className="m-0">{schedule?.inputs ? JSON.stringify(schedule?.inputs, null, 2).slice(2, -2) : ""}</pre>
                </TableCell>
                <TableCell>
                  {schedule.is_enabled?'enabled':'disabled'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Typography level="title-lg" className="mt-6">Recent runs:</Typography>

      <div className="mt-2 max-w-[800px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Created At</TableHead>
              <TableHead className="w-[150px]">ID</TableHead>
              <TableHead className="w-[300px]">Payload</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[58px]">Duration</TableHead>
              <TableHead>By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {runs.map((run) => (
              <TableRow key={run.id}>
                <TableCell>{new Date(run.updated_at).toLocaleString()}</TableCell>
                <TableCell>
                  <Link href={`/tasks/${params.slug}/runs/${run.id}`}>
                    {task.slug} #{run.id}
                  </Link>
                </TableCell>
                <TableCell className="overflow-auto scrollbar-hide">
                  <pre className="m-0">{JSON.stringify(run?.inputs,null,1).slice(2,-2)}</pre>
                </TableCell>
                <TableCell>
                  <StatusChip status={run.status} />
                </TableCell>
                <TableCell className="text-right">{run.duration/1000||0}s</TableCell>
                <TableCell>{run.triggered_by||'user'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
