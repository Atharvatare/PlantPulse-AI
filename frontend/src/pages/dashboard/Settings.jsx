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
    if (!profile.name || !profile.email) { toast.error('Name and email required'); return; }
    setSaving(true);
    try {
      const res = await updateProfile(profile);
      setUser(res.data.data || res.data.user || res.data);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="text-sm text-industrial-400 mt-0.5">Manage your account and preferences</p>
      </div>

      <div className="bg-industrial-800/80 backdrop-blur-sm border border-industrial-700/50 rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2"><FiUser className="text-primary-400" /> Profile Settings</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-industrial-300 mb-1.5">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-industrial-400" size={15} />
              <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full bg-industrial-900/80 border border-industrial-700/50 text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-industrial-300 mb-1.5">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-industrial-400" size={15} />
              <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full bg-industrial-900/80 border border-industrial-700/50 text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all" />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button onClick={handleProfileSave} disabled={saving} className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50">
            {saving ? <LoadingSpinner size="sm" /> : <FiSave size={15} />} Save Changes
          </button>
        </div>
      </div>

      <div className="bg-industrial-800/80 backdrop-blur-sm border border-industrial-700/50 rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2"><FiLock className="text-yellow-400" /> Change Password</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-industrial-300 mb-1.5">Current Password</label>
            <input type="password" value={password.current} onChange={(e) => setPassword({ ...password, current: e.target.value })} className="w-full bg-industrial-900/80 border border-industrial-700/50 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500/50 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-industrial-300 mb-1.5">New Password</label>
            <input type="password" value={password.new} onChange={(e) => setPassword({ ...password, new: e.target.value })} className="w-full bg-industrial-900/80 border border-industrial-700/50 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500/50 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-industrial-300 mb-1.5">Confirm New</label>
            <input type="password" value={password.confirm} onChange={(e) => setPassword({ ...password, confirm: e.target.value })} className="w-full bg-industrial-900/80 border border-industrial-700/50 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500/50 transition-all" />
          </div>
        </div>
        <div className="flex justify-end">
          <button className="inline-flex items-center gap-2 bg-industrial-700/40 hover:bg-industrial-700/60 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all">Update Password</button>
        </div>
      </div>

      <div className="bg-industrial-800/80 backdrop-blur-sm border border-industrial-700/50 rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2"><FiBell className="text-blue-400" /> Notification Preferences</h2>
        <div className="space-y-3">
          {[
            ['emailAlerts', 'Email Alerts', 'Receive alert notifications via email'],
            ['pushAlerts', 'Push Notifications', 'Receive push notifications for critical alerts'],
            ['maintenanceReminders', 'Maintenance Reminders', 'Get reminders for scheduled maintenance'],
            ['reportDigest', 'Weekly Report Digest', 'Receive weekly summary report via email'],
          ].map(([key, label, desc]) => (
            <label key={key} className="flex items-center justify-between p-3 rounded-lg bg-industrial-900/50 hover:bg-industrial-700/30 transition-colors cursor-pointer">
              <div>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-industrial-400">{desc}</p>
              </div>
              <div className={`relative w-10 h-5 rounded-full transition-colors ${notifications[key] ? 'bg-primary-600' : 'bg-industrial-600'}`} onClick={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))}>
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${notifications[key] ? 'translate-x-5' : ''}`} />
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-industrial-800/80 backdrop-blur-sm border border-industrial-700/50 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">{theme === 'dark' ? <FiMoon className="text-primary-400" /> : <FiSun className="text-yellow-400" />} Theme</h2>
        <div className="flex items-center gap-4">
          <button onClick={() => setTheme('dark')} className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-all border ${theme === 'dark' ? 'bg-primary-600/20 border-primary-500/40 text-primary-400' : 'bg-industrial-900/50 border-industrial-700/30 text-industrial-400 hover:text-white'}`}>
            <FiMoon size={16} /> Dark Mode
          </button>
          <button onClick={() => setTheme('light')} className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-all border ${theme === 'light' ? 'bg-primary-600/20 border-primary-500/40 text-primary-400' : 'bg-industrial-900/50 border-industrial-700/30 text-industrial-400 hover:text-white'}`}>
            <FiSun size={16} /> Light Mode
          </button>
        </div>
      </div>
    </div>
  );
}
