import { NavLink } from 'react-router-dom';
import { FiLayout, FiServer, FiCpu, FiClipboard, FiBarChart2, FiTerminal, FiFileText, FiBell, FiShield, FiSettings, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', icon: FiLayout, label: 'Dashboard', exact: true },
  { to: '/dashboard/assets', icon: FiServer, label: 'Assets' },
  { to: '/dashboard/predictive', icon: FiCpu, label: 'Predictive Maintenance' },
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
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
        : 'text-industrial-300 hover:text-white hover:bg-industrial-700/40 border border-transparent'
    }`;

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 z-30 h-full w-64 bg-industrial-800 border-r border-industrial-700/50 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-industrial-700/50 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm">P</div>
            <span className="text-sm font-bold text-white">PlantPulse <span className="text-secondary-400">AI</span></span>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-industrial-400 hover:text-white hover:bg-industrial-700/60 transition-colors">
            <FiX size={18} />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-4rem)] lg:h-full py-4 px-3">
          <nav className="flex-1 space-y-1 overflow-y-auto">
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

          <div className="pt-4 mt-4 border-t border-industrial-700/50 space-y-1">
            {bottomLinks.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={onClose} className={linkClass}>
                <link.icon size={18} />
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="pt-4 mt-4 border-t border-industrial-700/50">
            <div className="px-3 py-3 rounded-lg bg-gradient-to-br from-primary-500/5 to-secondary-500/5 border border-primary-500/10">
              <p className="text-xs font-medium text-primary-400">PlantPulse AI</p>
              <p className="text-[10px] text-industrial-500 mt-0.5">v1.0.0 • Industrial IoT</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
