import { NavLink } from 'react-router-dom';
import { FiLayout, FiServer, FiCpu, FiClipboard, FiBarChart2, FiTerminal, FiFileText, FiBell, FiShield, FiSettings, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', icon: FiLayout, label: 'Dashboard', exact: true },
  { to: '/dashboard/assets', icon: FiServer, label: 'Assets' },
  { to: '/dashboard/predictive', icon: FiCpu, label: 'Predictive Maintenance' },
  { to: '/dashboard/work-orders', icon: FiClipboard, label: 'Work Orders' },
  { to: '/dashboard/analytics', icon: FiBarChart2, label: 'Analytics' },
  { to: '/dashboard/ai-assistant', icon: FiTerminal, label: 'AI Assistant' },
  { to: '/dashboard/reports', icon: FiFileText, label: 'Reports' },
  { to: '/dashboard/alerts', icon: FiBell, label: 'Alerts' },
];

const bottomLinks = [
  { to: '/dashboard/settings', icon: FiSettings, label: 'Settings' },
];

export default function Sidebar({ open, onClose }) {
  const { isAdmin } = useAuth();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border relative ${
      isActive
        ? 'bg-primary-100 dark:bg-primary-500/10 text-primary-800 dark:text-primary-400 border-primary-200 dark:border-primary-500/20 shadow-sm'
        : 'text-stone-600 hover:text-stone-900 dark:text-industrial-400 dark:hover:text-white hover:bg-stone-100/80 dark:hover:bg-industrial-750/50 border-transparent'
    }`;

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 z-30 h-full w-64 bg-white dark:bg-industrial-800 border-r border-stone-200 dark:border-industrial-700/40 transform transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:z-auto ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-stone-200 dark:border-industrial-700/40 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center text-white font-bold text-sm">P</div>
            <span className="text-sm font-bold text-stone-850 dark:text-white">PlantPulse <span className="text-primary-700 dark:text-secondary-400">AI</span></span>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-stone-500 dark:text-industrial-400 hover:bg-stone-100 dark:hover:bg-industrial-750/60 transition-colors">
            <FiX size={18} />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-4rem)] lg:h-full py-4 px-3">
          <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                onClick={onClose}
                className={linkClass}
              >
                <link.icon size={18} />
                {link.label}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink to="/dashboard/admin" onClick={onClose} className={linkClass}>
                <FiShield size={18} />
                Admin Panel
              </NavLink>
            )}
          </nav>

          <div className="pt-4 mt-4 border-t border-stone-200 dark:border-industrial-700/40 space-y-1">
            {bottomLinks.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={onClose} className={linkClass}>
                <link.icon size={18} />
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="pt-4 mt-4 border-t border-stone-200 dark:border-industrial-700/40">
            <div className="px-4 py-3.5 rounded-xl bg-stone-50 dark:bg-industrial-900/50 border border-stone-200 dark:border-industrial-800/30 shadow-inner">
              <p className="text-xs font-bold text-gradient uppercase tracking-wider">PlantPulse AI</p>
              <p className="text-[10px] text-stone-500 dark:text-industrial-500 mt-1 font-bold">v1.2.0 • Industrial IoT</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
