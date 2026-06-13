import { FiInbox } from 'react-icons/fi';

export default function EmptyState({ icon: Icon, title, message, action }) {
  const IconComponent = Icon || FiInbox;
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <div className="p-5 rounded-2xl bg-industrial-800/60 ring-1 ring-white/5 text-industrial-400 mb-5">
        <IconComponent size={44} />
      </div>
      <h3 className="text-lg font-semibold text-white mb-1.5">{title || 'Nothing here'}</h3>
      <p className="text-sm text-industrial-400 text-center max-w-sm leading-relaxed">{message || 'No data to display.'}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
