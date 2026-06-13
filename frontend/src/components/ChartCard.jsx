import { useState } from 'react';

export default function ChartCard({ title, children, timeframes, onTimeframeChange }) {
  const [active, setActive] = useState('7d');

  const handleClick = (tf) => {
    setActive(tf);
    onTimeframeChange?.(tf);
  };

  return (
    <div className="glass-panel-hover p-5 card-stagger">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-primary-400 to-secondary-400" />
          {title}
        </h3>
        {timeframes && (
          <div className="flex gap-1 bg-industrial-800/80 rounded-lg p-0.5 ring-1 ring-white/5">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => handleClick(tf)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                  active === tf
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-industrial-400 hover:text-white hover:bg-industrial-750/40'
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
