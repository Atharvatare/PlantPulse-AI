import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../utils/constants';
import toast from 'react-hot-toast';

export default function Register() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'Engineer' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, role: form.role });
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-industrial-900 transition-colors duration-300 flex page-enter">
      {/* Visual Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cyan-50/50 via-slate-100/40 to-indigo-50/50 dark:from-secondary-950/20 dark:via-industrial-950 dark:to-primary-950/20 border-r border-slate-200/50 dark:border-industrial-800/30 relative overflow-hidden items-center justify-center">
        {/* Glow circles */}
        <div className="absolute top-20 right-20 w-60 h-60 bg-secondary-500/10 dark:bg-secondary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-3xl" />
        
        <div className="relative text-center px-12 max-w-lg float-animation">
          <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-secondary-500 to-primary-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-secondary-500/20">
            P
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">Join PlantPulse AI</h2>
          <p className="text-slate-600 dark:text-industrial-400 leading-relaxed text-sm">
            Sign up to gain full administrative, monitoring, and AI predictive maintenance control over your factory assets.
          </p>
          
          {/* Subtle Visual Mockup */}
          <div className="mt-10 p-5 rounded-2xl bg-white dark:bg-industrial-800 border border-slate-200/60 dark:border-industrial-700/30 shadow-md text-left max-w-sm mx-auto">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Predictive Engine</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 font-bold border border-primary-100 dark:border-primary-500/20">Active</span>
            </div>
            <div className="text-lg font-bold text-slate-800 dark:text-white">AI health prediction ready</div>
            <div className="text-xs text-slate-400 dark:text-industrial-500 mt-1">Accuracy scored at 94.8%</div>
          </div>
        </div>
      </div>

      {/* Form Right Panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
        <div className="w-full max-w-md bg-white dark:bg-industrial-800 sm:border border-slate-200/60 dark:border-industrial-700/50 rounded-2xl p-6 sm:p-10 sm:shadow-xl sm:shadow-slate-100 dark:sm:shadow-none">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-slate-700 dark:text-industrial-400 dark:hover:text-white transition-colors mb-6 text-sm font-medium">
            <FiArrowRight className="rotate-180" size={16} /> Back to Home
          </Link>

          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">Create Account</h1>
          <p className="text-sm text-slate-500 dark:text-industrial-400 mb-6 font-medium">Register for your PlantPulse AI access</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-industrial-300 uppercase tracking-wider mb-1.5">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-industrial-500" size={16} />
                <input 
                  type="text" 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  className="w-full bg-slate-50 dark:bg-industrial-900 border border-slate-200 dark:border-industrial-700/50 text-slate-800 dark:text-white text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all placeholder-slate-400 dark:placeholder-industrial-600 font-medium" 
                  placeholder="John Doe" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-industrial-300 uppercase tracking-wider mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-industrial-500" size={16} />
                <input 
                  type="email" 
                  value={form.email} 
                  onChange={(e) => setForm({ ...form, email: e.target.value })} 
                  className="w-full bg-slate-50 dark:bg-industrial-900 border border-slate-200 dark:border-industrial-700/50 text-slate-800 dark:text-white text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all placeholder-slate-400 dark:placeholder-industrial-600 font-medium" 
                  placeholder="you@company.com" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-industrial-300 uppercase tracking-wider mb-1.5">Role</label>
              <select 
                value={form.role} 
                onChange={(e) => setForm({ ...form, role: e.target.value })} 
                className="w-full bg-slate-50 dark:bg-industrial-900 border border-slate-200 dark:border-industrial-700/50 text-slate-800 dark:text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium"
              >
                {USER_ROLES.map((r) => <option key={r} value={r} className="bg-white dark:bg-industrial-800 text-slate-800 dark:text-white">{r}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-industrial-300 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-industrial-500" size={16} />
                <input 
                  type={showPw ? 'text' : 'password'} 
                  value={form.password} 
                  onChange={(e) => setForm({ ...form, password: e.target.value })} 
                  className="w-full bg-slate-50 dark:bg-industrial-900 border border-slate-200 dark:border-industrial-700/50 text-slate-800 dark:text-white text-sm rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all placeholder-slate-400 dark:placeholder-industrial-600 font-medium" 
                  placeholder="••••••••" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPw(!showPw)} 
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-industrial-400 dark:hover:text-white transition-colors"
                >
                  {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-industrial-300 uppercase tracking-wider mb-1.5">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-industrial-500" size={16} />
                <input 
                  type={showPw ? 'text' : 'password'} 
                  value={form.confirmPassword} 
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} 
                  className="w-full bg-slate-50 dark:bg-industrial-900 border border-slate-200 dark:border-industrial-700/50 text-slate-800 dark:text-white text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all placeholder-slate-400 dark:placeholder-industrial-600 font-medium" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-slate-900 dark:bg-primary-600 hover:bg-slate-800 dark:hover:bg-primary-500 text-white py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-md shadow-slate-900/10 dark:shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create Account <FiArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-industrial-400 mt-8 font-medium">
            Already have an account? <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-bold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
