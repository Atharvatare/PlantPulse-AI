import { getStatusColor } from '../utils/helpers';

export default function StatusBadge({ status, size = 'sm' }) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${getStatusColor(status)} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'Running' ? 'bg-green-400' : status === 'Stopped' ? 'bg-red-400' : status === 'Maintenance' ? 'bg-yellow-400' : 'bg-orange-400'}`} />
      {status}
    </span>
  );
}
