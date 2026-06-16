import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiMenu, FiX, FiLogOut, FiUser, FiSettings, FiChevronDown, FiSun, FiMoon } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/90 dark:bg-industrial-800/85 backdrop-blur-xl border-b border-stone-200 dark:border-industrial-700/40 transition-all duration-300">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-stone-500 dark:text-industrial-400 hover:text-stone-850 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-industrial-750/60 transition-all duration-200 lg:hidden"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-primary-500/10 group-hover:shadow-primary-500/30 transition-all duration-200">
              P
            </div>
            <span className="hidden sm:block text-sm font-bold text-stone-850 dark:text-white">
              PlantPulse <span className="text-primary-700 dark:text-secondary-400">AI</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-stone-500 dark:text-industrial-400 hover:text-stone-850 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-industrial-750/60 transition-all duration-200"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          {/* Notification Button */}
          <button className="relative p-2 rounded-lg text-stone-500 dark:text-industrial-400 hover:text-stone-850 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-industrial-750/60 transition-all duration-200 group">
            <FiBell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-br from-red-550 to-rose-600 rounded-full shadow-sm animate-pulse" />
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-industrial-750/60 transition-all duration-200 group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="hidden md:block text-sm font-bold text-stone-750 dark:text-white max-w-[120px] truncate">
                {user?.name || 'User'}
              </span>
              <FiChevronDown size={14} className={`text-stone-400 dark:text-industrial-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-industrial-800 border border-stone-200 dark:border-industrial-700/50 rounded-xl shadow-xl shadow-stone-250/20 dark:shadow-black/60 z-20 py-1 animate-fade-in-up">
                  <div className="px-4 py-3 border-b border-stone-100 dark:border-industrial-700/30">
                    <p className="text-sm font-bold text-stone-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-stone-500 dark:text-industrial-400 mt-0.5">{user?.email}</p>
                    <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-500/10 text-primary-750 dark:text-primary-400 border border-primary-200 dark:border-primary-500/20">{user?.role || 'User'}</span>
                  </div>
                  <Link to="/dashboard/settings" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-600 dark:text-industrial-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-industrial-750/60 transition-colors font-semibold">
                    <FiUser size={15} /><span>Profile Settings</span>
                  </Link>
                  <hr className="border-stone-100 dark:border-industrial-700/30 my-1" />
                  <button onClick={() => { setShowDropdown(false); logout(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-400/10 transition-colors font-bold">
                    <FiLogOut size={15} /><span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
