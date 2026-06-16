import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
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
    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-industrial-900 transition-colors duration-300 flex page-enter">
      {/* Visual Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-50/50 via-stone-100/40 to-green-50/50 dark:from-primary-950/20 dark:via-industrial-950 dark:to-secondary-950/20 border-r border-stone-200 dark:border-industrial-800/30 relative overflow-hidden items-center justify-center">
        {/* Glow circles */}
        <div className="absolute top-20 left-20 w-60 h-60 bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-secondary-500/10 dark:bg-secondary-500/5 rounded-full blur-3xl" />
        
        <div className="relative text-center px-12 max-w-lg float-animation">
          <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-primary-500/20">
            P
          </div>
          <h2 className="text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight mb-4">Welcome back to PlantPulse</h2>
          <p className="text-stone-600 dark:text-industrial-400 leading-relaxed text-sm font-semibold">
            Monitor and optimize industrial asset health with real-time AI analytics and telemetry diagnosis.
          </p>
          
          {/* Subtle Visual Mockup */}
          <div className="mt-10 p-5 rounded-2xl bg-white dark:bg-industrial-800 border border-stone-200 dark:border-industrial-700/30 shadow-md text-left max-w-sm mx-auto">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wide">System Diagnostic</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-lg font-bold text-stone-850 dark:text-white">All systems nominal</div>
            <div className="text-xs text-stone-450 dark:text-industrial-500 mt-1 font-semibold">Telemetry synchronized</div>
          </div>
        </div>
      </div>

      {/* Form Right Panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white dark:bg-industrial-800 sm:border border-stone-200 dark:border-industrial-700/50 rounded-2xl p-6 sm:p-10 sm:shadow-xl sm:shadow-stone-100/40 dark:sm:shadow-none">
          <Link to="/" className="flex items-center gap-2 text-stone-400 hover:text-stone-800 dark:text-industrial-400 dark:hover:text-white transition-colors mb-6 text-sm font-bold">
            <FiArrowRight className="rotate-180" size={16} /> Back to Home
          </Link>

          <h1 className="text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight mb-1">Sign In</h1>
          <p className="text-sm text-stone-500 dark:text-industrial-400 mb-6 font-semibold">Access your AI platform dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-650 dark:text-red-450 text-xs font-bold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-industrial-300 uppercase tracking-wider mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-450 dark:text-industrial-500" size={16} />
                <input 
                  type="email" 
                  value={form.email} 
                  onChange={(e) => setForm({ ...form, email: e.target.value })} 
                  className="w-full bg-stone-50 dark:bg-industrial-900 border border-stone-200 dark:border-industrial-700/50 text-stone-900 dark:text-white text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all placeholder-stone-400 dark:placeholder-industrial-600 font-bold" 
                  placeholder="you@company.com" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-industrial-300 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-450 dark:text-industrial-500" size={16} />
                <input 
                  type={showPw ? 'text' : 'password'} 
                  value={form.password} 
                  onChange={(e) => setForm({ ...form, password: e.target.value })} 
                  className="w-full bg-stone-50 dark:bg-industrial-900 border border-stone-200 dark:border-industrial-700/50 text-stone-900 dark:text-white text-sm rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all placeholder-stone-400 dark:placeholder-industrial-600 font-bold" 
                  placeholder="••••••••" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPw(!showPw)} 
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-450 hover:text-stone-700 dark:text-industrial-400 dark:hover:text-white transition-colors"
                >
                  {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-primary-750 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-500 text-white py-3.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-md shadow-primary-900/10 dark:shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Sign In <FiArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500 dark:text-industrial-400 mt-8 font-bold">
            Don't have an account? <Link to="/register" className="text-primary-700 dark:text-primary-400 hover:underline font-extrabold">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
