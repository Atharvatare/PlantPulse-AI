import { useState } from 'react';

export default function ChartCard({ title, children, timeframes, onTimeframeChange }) {
  const [active, setActive] = useState('7d');

  const handleClick = (tf) => {
    setActive(tf);
    onTimeframeChange?.(tf);
  };

  return (
    <div className="bg-industrial-800/80 backdrop-blur-sm border border-industrial-700/50 rounded-xl p-5 hover:border-industrial-600/60 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {timeframes && (
          <div className="flex gap-1 bg-industrial-900/60 rounded-lg p-1">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => handleClick(tf)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-150 ${
                  active === tf ? 'bg-primary-600 text-white' : 'text-industrial-400 hover:text-white'
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
