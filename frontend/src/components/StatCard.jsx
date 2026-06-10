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
    primary: 'bg-primary-500/20', secondary: 'bg-secondary-500/20', warning: 'bg-yellow-500/20',
    danger: 'bg-red-500/20', info: 'bg-blue-500/20', purple: 'bg-purple-500/20',
    orange: 'bg-orange-500/20', teal: 'bg-teal-500/20'
  };

  const iconColorMap = {
    primary: 'text-primary-400', secondary: 'text-secondary-400', warning: 'text-yellow-400',
    danger: 'text-red-400', info: 'text-blue-400', purple: 'text-purple-400',
    orange: 'text-orange-400', teal: 'text-teal-400'
  };

  return (
    <div className="relative group">
      <div className={`absolute inset-0 bg-gradient-to-br ${colorMap[color]} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`} />
      <div className="relative bg-industrial-800/80 backdrop-blur-sm border border-industrial-700/50 rounded-xl p-5 hover:border-industrial-600/60 transition-all duration-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-industrial-400 uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
            {subtitle && <p className="text-xs text-industrial-400 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-lg ${iconBgMap[color]} ${iconColorMap[color]}`}>
            {Icon && <Icon size={22} />}
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-1 mt-3 text-xs">
            {trend.direction === 'up' ? (
              <FiTrendingUp className="text-green-400" />
            ) : (
              <FiTrendingDown className="text-red-400" />
            )}
            <span className={trend.direction === 'up' ? 'text-green-400' : 'text-red-400'}>
              {trend.value}
            </span>
            <span className="text-industrial-500">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}
