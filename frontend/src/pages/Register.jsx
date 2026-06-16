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
    if (!form.name || !form.email || !form.password || !form.confirmPassword) { setError('Please fill in all fields'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, role: form.role });
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      toast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-industrial-900 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary-900 via-industrial-900 to-primary-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-40 h-40 bg-secondary-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-60 h-60 bg-primary-500 rounded-full blur-3xl" />
        </div>
        <div className="relative text-center px-12">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-secondary-500 to-primary-500 flex items-center justify-center text-white font-bold text-2xl">P</div>
          <h2 className="text-3xl font-bold text-white mb-3">Join PlantPulse AI</h2>
          <p className="text-industrial-300">Start monitoring your industrial assets with powerful AI-driven insights.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 text-industrial-400 hover:text-white transition-colors mb-8 text-sm">
            <FiArrowRight className="rotate-180" size={16} /> Back to Home
          </Link>

          <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
          <p className="text-sm text-industrial-400 mb-8">Register for your PlantPulse AI account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}

            <div>
              <label className="block text-sm font-medium text-industrial-300 mb-1.5">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-industrial-400" size={16} />
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-industrial-800/80 border border-industrial-700/50 text-white text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all placeholder-industrial-500" placeholder="John Doe" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-industrial-300 mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-industrial-400" size={16} />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-industrial-800/80 border border-industrial-700/50 text-white text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all placeholder-industrial-500" placeholder="you@company.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-industrial-300 mb-1.5">Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full bg-industrial-800/80 border border-industrial-700/50 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all">
                {USER_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-industrial-300 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-industrial-400" size={16} />
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full bg-industrial-800/80 border border-industrial-700/50 text-white text-sm rounded-lg pl-10 pr-10 py-3 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all placeholder-industrial-500" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-industrial-400 hover:text-white transition-colors">
                  {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-industrial-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-industrial-400" size={16} />
                <input type={showPw ? 'text' : 'password'} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="w-full bg-industrial-800/80 border border-industrial-700/50 text-white text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all placeholder-industrial-500" placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white py-3 rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create Account <FiArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-industrial-400 mt-8">
            Already have an account? <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
