import { FiInbox } from 'react-icons/fi';

export default function EmptyState({ icon: Icon, title, message, action }) {
  const IconComponent = Icon || FiInbox;
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="p-4 rounded-full bg-industrial-800/80 text-industrial-400 mb-4">
        <IconComponent size={40} />
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{title || 'Nothing here'}</h3>
      <p className="text-sm text-industrial-400 text-center max-w-sm">{message || 'No data to display.'}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
