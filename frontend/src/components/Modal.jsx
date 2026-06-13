import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizeClasses[size]} bg-industrial-800 border border-industrial-700/50 rounded-xl shadow-2xl shadow-black/40 animate-fade-in`}>
        <div className="flex items-center justify-between p-5 border-b border-industrial-700/40">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-gradient-to-b from-primary-400 to-secondary-400" />
            {title}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-industrial-400 hover:text-white hover:bg-industrial-750/60 transition-all duration-200">
            <FiX size={18} />
          </button>
        </div>
        <div className="p-5 max-h-[65vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
