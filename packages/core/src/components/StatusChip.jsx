import { Badge } from '@/components/ui/badge';

function chipStatusVariant(status) {
  if (status === 'complete')
    return 'success'
  else if (status === 'pending')
    return 'warning'
  else if (status === 'running')
    return 'default'
  else
    return 'destructive'
}

export default function StatusChip({ status }) {
  return (
    <Badge variant={chipStatusVariant(status)}>
      {status || 'pending'}
    </Badge>
  );
} 