'use client';
import { Table,Box,Container, Typography } from '@mui/joy';
import React from 'react';



import Icon from '@/components/Icon';

// import Link from '@/components/Link';

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
      <Typography level='body-sm'>{folder.description}</Typography>
      <Table sx={{
        pt:1,
        "--Table-headerUnderlineThickness": "2px",
        "--TableCell-height": "25px"
      }}>
        <thead>
          <tr >
            <th>Name</th>
            <th>Description</th>
            <th>Tasks</th>
          </tr>
        </thead>
        <tbody>
          {contents.map((content)=>{
            return <React.Fragment key={`${content.type}__${content.slug}`}>
              <tr >
                <td>
                  {content.type=='folder' && <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* <Icon icon='folder' color='#444444'/> */}
                    <i class="fa-regular fa-folder fa-xl"></i>
                    <Link href={'/library'+'/'+content.slug}>{content.name}</Link>
                    </Box>
                  </>}
                  {content.type=='task' && <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {/* <Icon icon='send' color='#6435c9'/> */}
                      <i class="fa-solid fa-paper-plane fa-xl" style={{color:'#6435c9'}}></i>
                      <Link href={'/tasks/'+content.slug}>{content.name}</Link>
                    </Box>
                  </>}
                </td>
                <td>{content.description}</td>
                <td></td>
              </tr>
            </React.Fragment>
          })}
          
          
        </tbody>
      </Table>

      {/* <pre>{JSON.stringify(folder,null,2)}</pre> */}
      {/* <pre>{JSON.stringify(contents,null,2)}</pre> */}
    </Container>
  </>
}