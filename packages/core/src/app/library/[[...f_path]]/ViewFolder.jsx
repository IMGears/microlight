'use client';
import React from 'react';
import { Folder, Send } from 'lucide-react';
import Link from '@/components/Link';
import PageHeader from '@/components/PageHeader';
import { Typography } from '@/components/ui/typography';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function generateBreadcrumbs({params}){
  let breadcrumbs = []
  let b = {
    text: "Library",
  }
  if(params.f_path?.length){
    let slug='/library';
    b.href='/library';
    breadcrumbs.push(b) ;
    params.f_path.forEach(function(name,i){
      let b={
        text:name
      }
      if(i!=params.f_path.length-1){
        slug+='/'+name;
        b.href=slug;
      }
      breadcrumbs.push(b);
    })
  }
  else{
    breadcrumbs.push(b) ;
  }
  return breadcrumbs;
}

export default function ViewFolder({params,folder,contents,fileList}){
  // params.f_path will be an array containing all segments after /library/
  // e.g. for /library/level1/level2/level3
  // params.f_path = ['level1', 'level2', 'level3']
  const breadcrumbs = generateBreadcrumbs({params});

  const dir = params.f_path?'/'+params.f_path?.join('/'):'';
  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader breadcrumbs={breadcrumbs} header={{
        part1: 'Folder:',
        part2: folder.name
      }}/>
      <Typography level='body-sm'>{folder.description}</Typography>
      <div className="mt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Tasks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contents.map((content)=>{
              return (
                <TableRow key={`${content.type}__${content.slug}`}>
                  <TableCell>
                    {content.type=='folder' && (
                      <div className="flex items-center gap-2">
                        <Folder className="h-5 w-5 text-muted-foreground" />
                        <Link href={'/library'+'/'+content.slug}>{content.name}</Link>
                      </div>
                    )}
                    {content.type=='task' && (
                      <div className="flex items-center gap-2">
                        <Send className="h-5 w-5 text-[#6435c9]" />
                        <Link href={'/tasks/'+content.slug}>{content.name}</Link>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{content.description}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
