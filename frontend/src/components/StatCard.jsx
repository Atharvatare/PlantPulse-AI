import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export default function StatCard({ title, value, icon: Icon, trend, color = 'primary', subtitle }) {
  const colorMap = {
    primary: 'from-primary-500 to-primary-600',
    secondary: 'from-secondary-500 to-secondary-600',
    warning: 'from-yellow-500 to-yellow-600',
    danger: 'from-red-500 to-red-600',
    info: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    teal: 'from-teal-500 to-teal-600'
  };

  const iconBgMap = {
    primary: 'bg-primary-500/10', secondary: 'bg-secondary-500/10', warning: 'bg-yellow-500/10',
    danger: 'bg-red-500/10', info: 'bg-blue-500/10', purple: 'bg-purple-500/10',
    orange: 'bg-orange-500/10', teal: 'bg-teal-500/10'
  };

  const iconColorMap = {
    primary: 'text-primary-400', secondary: 'text-secondary-400', warning: 'text-yellow-400',
    danger: 'text-red-400', info: 'text-blue-400', purple: 'text-purple-400',
    orange: 'text-orange-400', teal: 'text-teal-400'
  };

  const borderMap = {
    primary: 'border-primary-500/20 group-hover:border-primary-500/40',
    secondary: 'border-secondary-500/20 group-hover:border-secondary-500/40',
    warning: 'border-yellow-500/20 group-hover:border-yellow-500/40',
    danger: 'border-red-500/20 group-hover:border-red-500/40',
    info: 'border-blue-500/20 group-hover:border-blue-500/40',
    purple: 'border-purple-500/20 group-hover:border-purple-500/40',
    orange: 'border-orange-500/20 group-hover:border-orange-500/40',
    teal: 'border-teal-500/20 group-hover:border-teal-500/40'
  };

  return (
    <div className="relative group card-stagger">
      <div className={`absolute -inset-px bg-gradient-to-br ${colorMap[color]} opacity-0 group-hover:opacity-10 rounded-xl blur-sm transition-all duration-300`} />
      <div className={`relative bg-industrial-800/70 backdrop-blur-sm border ${borderMap[color]} rounded-xl p-5 transition-all duration-200`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-industrial-400 uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-bold text-white mt-1.5 truncate">{value}</p>
            {subtitle && <p className="text-xs text-industrial-400 mt-1.5">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-xl ${iconBgMap[color]} ${iconColorMap[color]} ring-1 ring-white/5`}>
            {Icon && <Icon size={22} />}
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-industrial-700/30">
            {trend.direction === 'up' ? (
              <FiTrendingUp className="text-accent-400" size={14} />
            ) : (
              <FiTrendingDown className="text-red-400" size={14} />
            )}
            <span className={`text-xs font-medium ${trend.direction === 'up' ? 'text-accent-400' : 'text-red-400'}`}>
              {trend.value}
            </span>
            <span className="text-xs text-industrial-500">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}
