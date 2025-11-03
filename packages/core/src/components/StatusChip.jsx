import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

function getBadgeVariant(status) {
  if (status === 'complete')
    return 'success'
  else if (status === 'pending')
    return 'warning'
  else if (status === 'running')
    return 'default'
  else
    return 'destructive'
}

function getBadgeClassName(status) {
  if (status === 'complete')
    return 'bg-green-100 text-green-800 hover:bg-green-100'
  else if (status === 'pending')
    return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
  else if (status === 'running')
    return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
  else
    return 'bg-red-100 text-red-800 hover:bg-red-100'
}

export default function StatusChip({ status }) {
  return (
    <Badge
      variant={getBadgeVariant(status)}
      className={cn("text-xs", getBadgeClassName(status))}
    >
      {status || 'pending'}
    </Badge>
  );
} 