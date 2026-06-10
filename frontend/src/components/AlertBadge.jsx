import { getSeverityColor } from '../utils/helpers';

export default function AlertBadge({ severity }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(severity)}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${severity === 'Critical' ? 'bg-red-400 animate-pulse' : severity === 'Warning' ? 'bg-yellow-400' : 'bg-blue-400'}`} />
      {severity}
    </span>
  );
}
