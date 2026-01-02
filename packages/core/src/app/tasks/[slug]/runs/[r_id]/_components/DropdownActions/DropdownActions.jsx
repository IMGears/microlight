'use client';
import { EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          aria-label="more options"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled onClick={onClickCreateVersion}>
          Rerun job
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onClickCopyRerunAsCurl}>
          Copy rerun as curl
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}