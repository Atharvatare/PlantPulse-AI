import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export default function StatCard({ title, value, icon: Icon, trend, color = 'primary', subtitle }) {
  const iconBgMap = {
    primary: 'bg-green-100 dark:bg-primary-500/10',
    secondary: 'bg-emerald-100 dark:bg-secondary-500/10',
    warning: 'bg-amber-100 dark:bg-yellow-500/10',
    danger: 'bg-red-100 dark:bg-red-500/10',
    info: 'bg-blue-100 dark:bg-blue-500/10',
    purple: 'bg-purple-100 dark:bg-purple-500/10',
    orange: 'bg-orange-100 dark:bg-orange-500/10',
    teal: 'bg-teal-100 dark:bg-teal-500/10'
  };

  const iconColorMap = {
    primary: 'text-green-800 dark:text-primary-400',
    secondary: 'text-emerald-800 dark:text-secondary-400',
    warning: 'text-amber-800 dark:text-yellow-400',
    danger: 'text-red-800 dark:text-red-400',
    info: 'text-blue-800 dark:text-blue-400',
    purple: 'text-purple-800 dark:text-purple-400',
    orange: 'text-orange-800 dark:text-orange-400',
    teal: 'text-teal-800 dark:text-teal-400'
  };

  return (
    <div className="relative group card-stagger card-lift bg-white dark:bg-industrial-800 border border-stone-200 dark:border-industrial-700/50 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-stone-500 dark:text-industrial-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-extrabold text-stone-900 dark:text-white mt-1.5 truncate">{value}</p>
          {subtitle && <p className="text-xs text-stone-600 dark:text-industrial-400 mt-1 font-semibold">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${iconBgMap[color]} ${iconColorMap[color]} ring-4 ring-stone-50 dark:ring-white/5 transition-transform duration-300 group-hover:scale-110`}>
          {Icon && <Icon size={20} />}
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1.5 mt-4 pt-3.5 border-t border-stone-100 dark:border-industrial-700/30">
          {trend.direction === 'up' ? (
            <FiTrendingUp className="text-emerald-700 dark:text-emerald-400" size={14} />
          ) : (
            <FiTrendingDown className="text-rose-700 dark:text-rose-400" size={14} />
          )}
          <span className={`text-xs font-bold ${trend.direction === 'up' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
            {trend.value}
          </span>
          <span className="text-xs text-stone-500 dark:text-industrial-500 font-bold">vs last month</span>
        </div>
      )}
    </div>
  );
}
