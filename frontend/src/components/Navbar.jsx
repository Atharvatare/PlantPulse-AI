import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiMenu, FiX, FiLogOut, FiUser, FiSettings, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-industrial-800/80 backdrop-blur-xl border-b border-industrial-700/40">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-industrial-400 hover:text-white hover:bg-industrial-750/60 transition-all duration-200 lg:hidden"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow duration-200">P</div>
            <span className="hidden sm:block text-sm font-bold text-white">PlantPulse <span className="text-secondary-400">AI</span></span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-lg text-industrial-400 hover:text-white hover:bg-industrial-750/60 transition-all duration-200 group">
            <FiBell size={18} />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-red-500 to-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">3</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-industrial-750/60 transition-all duration-200 group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="hidden md:block text-sm text-white max-w-[120px] truncate">{user?.name || 'User'}</span>
              <FiChevronDown size={14} className={`text-industrial-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-industrial-800 border border-industrial-700/50 rounded-xl shadow-2xl shadow-black/30 z-20 py-1 animate-fade-in">
                  <div className="px-4 py-3 border-b border-industrial-700/30">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-industrial-400 mt-0.5">{user?.email}</p>
                    <span className="inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">{user?.role || 'User'}</span>
                  </div>
                  <Link to="/dashboard/settings" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-industrial-300 hover:text-white hover:bg-industrial-750/60 transition-colors">
                    <FiUser size={15} /><span>Profile Settings</span>
                  </Link>
                  <hr className="border-industrial-700/30 my-1" />
                  <button onClick={() => { setShowDropdown(false); logout(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/10 transition-colors">
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
