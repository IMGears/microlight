'use client';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Container } from "@/components/ui/container";

import {Link} from 'switchless'
import PageHeader from '@/components/PageHeader';

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
  return <>
    <Container>
      <PageHeader breadcrumbs={breadcrumbs} header={{
        part1: 'Folder:',
        part2: folder.name
      }}/>
      <p className="text-sm text-muted-foreground mb-4">{folder.description}</p>
      <div className="mt-4">
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
              return <TableRow key={`${content.type}__${content.slug}`}>
                <TableCell>
                  {content.type=='folder' && (
                    <div className="flex items-center gap-3">
                      <i className="fa-regular fa-folder fa-xl"></i>
                      <Link href={'/library'+'/'+content.slug}>{content.name}</Link>
                    </div>
                  )}
                  {content.type=='task' && (
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-paper-plane fa-xl" style={{color:'#6435c9'}}></i>
                      <Link href={'/tasks/'+content.slug}>{content.name}</Link>
                    </div>
                  )}
                </TableCell>
                <TableCell>{content.description}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            })}
          </TableBody>
        </Table>
      </div>

      {/* <pre>{JSON.stringify(folder,null,2)}</pre> */}
      {/* <pre>{JSON.stringify(contents,null,2)}</pre> */}
    </Container>
  </>
}