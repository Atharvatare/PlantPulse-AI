import { useState } from 'react';

export default function ChartCard({ title, children, timeframes, onTimeframeChange }) {
  const [active, setActive] = useState('7d');

  const handleClick = (tf) => {
    setActive(tf);
    onTimeframeChange?.(tf);
  };

  return (
    <div className="bg-white dark:bg-industrial-800 border border-stone-200 dark:border-industrial-700/50 rounded-2xl p-5 shadow-sm card-stagger card-lift">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-primary-600 to-secondary-500" />
          {title}
        </h3>
        {timeframes && (
          <div className="flex gap-1 bg-stone-100 dark:bg-industrial-900 rounded-xl p-0.5 border border-stone-200/40 dark:border-industrial-700/30">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => handleClick(tf)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all duration-200 ${
                  active === tf
                    ? 'bg-white dark:bg-industrial-800 text-stone-900 dark:text-white shadow-sm'
                    : 'text-stone-600 dark:text-industrial-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
