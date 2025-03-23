import { Chip } from '@mui/joy';

function chipStatusColor(status) {
  if (status === 'complete')
    return 'success'
  else if (status === 'pending')
    return 'warning'
  else if (status === 'running')
    return 'primary'
  else 
    return 'danger'
}

export default function StatusChip({ status }) {
  return (
    <Chip
      variant="soft"
      color={chipStatusColor(status)}
      size="sm"
    >
      {status || 'pending'}
    </Chip>
  );
} 