import { useState } from 'react';
import { FiUser, FiMail, FiLock, FiBell, FiMoon, FiSun, FiSave } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { updateProfile } from '../../services/authService';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, setUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });
  const [notifications, setNotifications] = useState({
    emailAlerts: true, pushAlerts: true, maintenanceReminders: true, reportDigest: false
  });
  const [saving, setSaving] = useState(false);

  const handleProfileSave = async () => {
    if (!profile.name || !profile.email) {
      toast.error('Name and email required');
      return;
    }
    setSaving(true);
    try {
      const res = await updateProfile(profile);
      setUser(res.data.data || res.data.user || res.data);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 page-enter">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-industrial-400 mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white dark:bg-industrial-800 border border-slate-200/80 dark:border-industrial-700/50 rounded-2xl p-6 space-y-5 shadow-sm card-stagger card-lift">
        <h2 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <FiUser className="text-primary-500" size={16} /> Profile Settings
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-industrial-300 uppercase tracking-wider mb-1.5">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-industrial-500" size={15} />
              <input 
                type="text" 
                value={profile.name} 
                onChange={(e) => setProfile({ ...profile, name: e.target.value })} 
                className="w-full bg-slate-50 dark:bg-industrial-900 border border-slate-200 dark:border-industrial-700/50 text-slate-800 dark:text-white text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium" 
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-industrial-300 uppercase tracking-wider mb-1.5">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-industrial-500" size={15} />
              <input 
                type="email" 
                value={profile.email} 
                onChange={(e) => setProfile({ ...profile, email: e.target.value })} 
                className="w-full bg-slate-50 dark:bg-industrial-900 border border-slate-200 dark:border-industrial-700/50 text-slate-800 dark:text-white text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium" 
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <button 
            onClick={handleProfileSave} 
            disabled={saving} 
            className="inline-flex items-center gap-2 bg-slate-900 dark:bg-primary-600 hover:bg-slate-800 dark:hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md disabled:opacity-50"
          >
            {saving ? <LoadingSpinner size="sm" /> : <FiSave size={15} />} Save Changes
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white dark:bg-industrial-800 border border-slate-200/80 dark:border-industrial-700/50 rounded-2xl p-6 space-y-5 shadow-sm card-stagger card-lift">
        <h2 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <FiLock className="text-amber-500" size={16} /> Change Password
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-industrial-300 uppercase tracking-wider mb-1.5">Current Password</label>
            <input 
              type="password" 
              value={password.current} 
              onChange={(e) => setPassword({ ...password, current: e.target.value })} 
              className="w-full bg-slate-50 dark:bg-industrial-900 border border-slate-200 dark:border-industrial-700/50 text-slate-800 dark:text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-industrial-300 uppercase tracking-wider mb-1.5">New Password</label>
            <input 
              type="password" 
              value={password.new} 
              onChange={(e) => setPassword({ ...password, new: e.target.value })} 
              className="w-full bg-slate-50 dark:bg-industrial-900 border border-slate-200 dark:border-industrial-700/50 text-slate-800 dark:text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-industrial-300 uppercase tracking-wider mb-1.5">Confirm New</label>
            <input 
              type="password" 
              value={password.confirm} 
              onChange={(e) => setPassword({ ...password, confirm: e.target.value })} 
              className="w-full bg-slate-50 dark:bg-industrial-900 border border-slate-200 dark:border-industrial-700/50 text-slate-800 dark:text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium" 
            />
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <button className="inline-flex items-center gap-2 bg-slate-100 dark:bg-industrial-700 hover:bg-slate-200 dark:hover:bg-industrial-600 text-slate-700 dark:text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all border border-slate-200 dark:border-transparent">
            Update Password
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white dark:bg-industrial-800 border border-slate-200/80 dark:border-industrial-700/50 rounded-2xl p-6 space-y-5 shadow-sm card-stagger card-lift">
        <h2 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <FiBell className="text-blue-500" size={16} /> Notification Preferences
        </h2>
        <div className="space-y-3">
          {[
            ['emailAlerts', 'Email Alerts', 'Receive alert notifications via email'],
            ['pushAlerts', 'Push Notifications', 'Receive push notifications for critical alerts'],
            ['maintenanceReminders', 'Maintenance Reminders', 'Get reminders for scheduled maintenance'],
            ['reportDigest', 'Weekly Report Digest', 'Receive weekly summary report via email'],
          ].map(([key, label, desc]) => (
            <div 
              key={key} 
              className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-industrial-900/50 hover:bg-slate-100/60 dark:hover:bg-industrial-750/30 border border-slate-100 dark:border-industrial-800/30 transition-all duration-200 cursor-pointer"
              onClick={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))}
            >
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{label}</p>
                <p className="text-xs text-slate-500 dark:text-industrial-400 mt-0.5">{desc}</p>
              </div>
              <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${notifications[key] ? 'bg-primary-600' : 'bg-slate-300 dark:bg-industrial-700'}`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 shadow-sm ${notifications[key] ? 'translate-x-5' : ''}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Theme Choice */}
      <div className="bg-white dark:bg-industrial-800 border border-slate-200/80 dark:border-industrial-700/50 rounded-2xl p-6 space-y-4 shadow-sm card-stagger card-lift">
        <h2 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
          {theme === 'dark' ? <FiMoon className="text-primary-500" /> : <FiSun className="text-amber-500" />} System Theme
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setTheme('light')} 
            className={`flex items-center justify-center gap-2.5 p-4 rounded-xl text-sm font-bold transition-all border ${theme === 'light' ? 'bg-primary-50 border-primary-200 text-primary-600 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
          >
            <FiSun size={16} /> Light Theme
          </button>
          <button 
            onClick={() => setTheme('dark')} 
            className={`flex items-center justify-center gap-2.5 p-4 rounded-xl text-sm font-bold transition-all border ${theme === 'dark' ? 'bg-primary-600/20 border-primary-500/40 text-primary-400' : 'bg-slate-50 dark:bg-industrial-900 border-slate-200 dark:border-industrial-700/30 text-slate-600 dark:text-industrial-400 hover:bg-slate-100 dark:hover:bg-industrial-750/30'}`}
          >
            <FiMoon size={16} /> Dark Theme
          </button>
        </div>
      </div>
    </div>
  );
}
