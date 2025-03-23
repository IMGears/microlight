'use client';
import {Menu,MenuItem,MenuButton,Dropdown} from '@mui/joy'

import * as React from 'react';
import Button from '@mui/joy/Button';
// import Divider from '@mui/joy/Divider';

import { deleteRun } from './action';




export default function DropdownActions({run}){
  async function onClickCreateVersion(){
		
	}	
  async function onClickCopyRerunAsCurl(){
    let href = window.location.href;
    let baseUrl = href.split('/runs/')[0].replace('/tasks/','/api/tasks/');
    
    // Convert input object to URL query parameters
    const queryParams = new URLSearchParams();
    Object.entries(run?.inputs).forEach(([key, value]) => {
      queryParams.append(key, value);
    });
    const curlCommand = `curl -X POST "${baseUrl}?${queryParams.toString()}"`;
    await navigator.clipboard.writeText(curlCommand);
  }	


	return(
		<>
      <Dropdown size='sm' >
        <MenuButton
          aria-label="master-data more options"
          variant="outlined"
          color="primary"
          size="sm"
          sx={{
            // Add these styles to match IconButton
            aspectRatio: '1',
            // borderRadius: '50%',
            p:0.5,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        ><i class="fa-solid fa-ellipsis-vertical fa-lg"></i></MenuButton>
        <Menu placement='bottom-end'>
          <MenuItem disabled onClick={onClickCreateVersion}>Rerun job</MenuItem>
          <MenuItem  onClick={onClickCopyRerunAsCurl}>Copy rerun as curl</MenuItem>
          {/* <MenuItem color='danger' onClick={()=>{setOpen(true);}}>Delete Part</MenuItem> */}
        </Menu>
      </Dropdown>
		</>
	);
}