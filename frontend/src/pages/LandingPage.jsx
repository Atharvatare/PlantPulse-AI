import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiActivity, FiCpu, FiBarChart2, FiClipboard, FiFileText, FiShield, FiChevronRight, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: FiCpu, title: 'Asset Management', desc: 'Real-time monitoring and management of all industrial assets with health scoring and status tracking.' },
  { icon: FiActivity, title: 'Predictive Maintenance', desc: 'AI-driven failure prediction with sensor data analysis to prevent costly downtime.' },
  { icon: FiBarChart2, title: 'AI Diagnostics', desc: 'Intelligent fault analysis and root cause identification using machine learning models.' },
  { icon: FiClipboard, title: 'Work Orders', desc: 'Streamlined work order management with automated assignment and priority tracking.' },
  { icon: FiShield, title: 'Analytics Dashboard', desc: 'Comprehensive analytics with real-time charts, trends, and performance metrics.' },
  { icon: FiFileText, title: 'Report Generation', desc: 'Automated report generation with PDF/Excel export for compliance and review.' },
];

const stats = [
  { value: '2,500+', label: 'Assets Managed', suffix: 'industrial assets' },
  { value: '40%', label: 'Maintenance Saved', suffix: 'cost reduction' },
  { value: '60%', label: 'Downtime Reduced', suffix: 'less unplanned stops' },
  { value: '95%', label: 'Health Accuracy', suffix: 'prediction precision' },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [counters, setCounters] = useState(stats.map(() => 0));

  useEffect(() => {
    const targets = [2500, 40, 60, 95];
    const intervals = targets.map((target, i) => {
      return setInterval(() => {
        setCounters(prev => {
          const next = prev[i] + (target > 100 ? 25 : 1);
          if (next >= target) { clearInterval(intervals[i]); return prev.map((v, j) => j === i ? target : v); }
          return prev.map((v, j) => j === i ? next : v);
        });
      }, target > 100 ? 5 : 40);
    });
    return () => intervals.forEach(clearInterval);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) navigate('/dashboard');
    else navigate('/register');
  };

  return (
    <div className="min-h-screen bg-industrial-900 bg-[radial-gradient(ellipse_at_top_left,_rgba(99,102,241,0.05)_0%,_transparent_60%),radial-gradient(ellipse_at_bottom_right,_rgba(6,182,212,0.05)_0%,_transparent_60%)]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-industrial-900/80 backdrop-blur-xl border-b border-industrial-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">P</div>
              <span className="text-lg font-bold text-white">PlantPulse <span className="text-secondary-400">AI</span></span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-industrial-300 hover:text-white transition-colors">Features</a>
              <a href="#stats" className="text-sm text-industrial-300 hover:text-white transition-colors">Stats</a>
              <Link to="/login" className="text-sm text-industrial-300 hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="text-sm bg-primary-600 hover:bg-primary-500 text-white px-5 py-2 rounded-lg font-medium transition-colors">Get Started</Link>
            </nav>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 rounded-lg text-industrial-400 hover:text-white transition-colors">
              {mobileMenu ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className="md:hidden border-t border-industrial-700/30 px-4 py-4 space-y-3">
            <a href="#features" onClick={() => setMobileMenu(false)} className="block text-sm text-industrial-300 hover:text-white py-2">Features</a>
            <a href="#stats" onClick={() => setMobileMenu(false)} className="block text-sm text-industrial-300 hover:text-white py-2">Stats</a>
            <Link to="/login" onClick={() => setMobileMenu(false)} className="block text-sm text-industrial-300 hover:text-white py-2">Login</Link>
            <Link to="/register" onClick={() => setMobileMenu(false)} className="block text-sm bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium text-center">Get Started</Link>
          </div>
        )}
      </header>

      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-60 right-1/4 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-medium mb-6">
            <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
            AI-Powered Industrial IoT Platform
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            Smart Industrial<br />
            <span className="bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 bg-clip-text text-transparent">Monitoring Platform</span>
          </h1>
          <p className="text-lg text-industrial-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Harness the power of AI to predict failures, optimize maintenance, and maximize uptime across your industrial operations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={handleGetStarted} className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-primary-500/20">
              Get Started Free <FiArrowRight size={16} />
            </button>
            <Link to="/login" className="w-full sm:w-auto bg-industrial-800 hover:bg-industrial-700 text-white px-8 py-3.5 rounded-xl font-medium text-sm border border-industrial-700/50 transition-all duration-200">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-industrial-400 max-w-xl mx-auto">Everything you need to monitor, predict, and optimize your industrial operations.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group relative bg-industrial-800/60 backdrop-blur-sm border border-industrial-700/40 rounded-xl p-6 hover:border-industrial-600/60 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:to-secondary-500/5 rounded-xl transition-all duration-300" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-lg bg-primary-500/10 text-primary-400 flex items-center justify-center mb-4 group-hover:bg-primary-500/20 transition-colors">
                    <f.icon size={22} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-industrial-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="stats" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Proven Results</h2>
            <p className="text-industrial-400 max-w-xl mx-auto">Trusted by industrial teams worldwide to improve reliability and efficiency.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-industrial-800/40 border border-industrial-700/30">
                <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                  {i === 0 ? counters[i].toLocaleString() + '+' : counters[i] + '%'}
                </p>
                <p className="text-sm font-semibold text-white mt-2">{s.label}</p>
                <p className="text-xs text-industrial-500 mt-1">{s.suffix}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-industrial-700/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-xs">P</div>
                <span className="text-sm font-bold text-white">PlantPulse <span className="text-secondary-400">AI</span></span>
              </div>
              <p className="text-xs text-industrial-500 leading-relaxed">Smart industrial monitoring powered by artificial intelligence.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Quick Links</h4>
              <div className="space-y-2">
                <a href="#features" className="block text-xs text-industrial-400 hover:text-white transition-colors">Features</a>
                <a href="#stats" className="block text-xs text-industrial-400 hover:text-white transition-colors">Statistics</a>
                <Link to="/login" className="block text-xs text-industrial-400 hover:text-white transition-colors">Login</Link>
                <Link to="/register" className="block text-xs text-industrial-400 hover:text-white transition-colors">Register</Link>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Contact</h4>
              <p className="text-xs text-industrial-500">contact@plantpulse.ai</p>
              <p className="text-xs text-industrial-500 mt-1">© 2026 PlantPulse AI. All rights reserved.</p>
            </div>
          </div>
          <div className="border-t border-industrial-700/20 pt-6 text-center">
            <p className="text-xs text-industrial-600">Built with AI for industrial excellence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
