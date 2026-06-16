import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiActivity, FiCpu, FiBarChart2, FiClipboard, FiFileText, FiShield, FiMenu, FiX, FiSun, FiMoon, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const features = [
  { icon: FiCpu, title: 'Asset Management', desc: 'Real-time monitoring and management of all industrial assets with health scoring and status tracking.' },
  { icon: FiActivity, title: 'Predictive Maintenance', desc: 'AI-driven failure prediction with sensor data analysis to prevent costly downtime.' },
  { icon: FiBarChart2, title: 'AI Diagnostics', desc: 'Intelligent fault analysis and root cause identification using machine learning models.' },
  { icon: FiClipboard, title: 'Work Orders', desc: 'Streamlined work order management with automated assignment and priority tracking.' },
  { icon: FiShield, title: 'Analytics Dashboard', desc: 'Comprehensive analytics with real-time charts, trends, and performance metrics.' },
  { icon: FiFileText, title: 'Report Generation', desc: 'Automated report generation with PDF/Excel export for compliance and review.' },
];

const stats = [
  { value: '2,500+', label: 'Assets Managed', suffix: 'active assets' },
  { value: '40%', label: 'Maintenance Saved', suffix: 'cost reduction' },
  { value: '60%', label: 'Downtime Reduced', suffix: 'less unplanned stops' },
  { value: '95%', label: 'Health Accuracy', suffix: 'prediction precision' },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [counters, setCounters] = useState(stats.map(() => 0));

  useEffect(() => {
    const targets = [2500, 40, 60, 95];
    const intervals = targets.map((target, i) => {
      return setInterval(() => {
        setCounters(prev => {
          const next = prev[i] + (target > 100 ? 50 : 2);
          if (next >= target) {
            clearInterval(intervals[i]);
            return prev.map((v, j) => j === i ? target : v);
          }
          return prev.map((v, j) => j === i ? next : v);
        });
      }, target > 100 ? 10 : 30);
    });
    return () => intervals.forEach(clearInterval);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) navigate('/dashboard');
    else navigate('/register');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-industrial-900 dark:text-industrial-300 transition-colors duration-300 selection:bg-primary-500/20">
      {/* Radial glows */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary-500/5 via-secondary-500/2 to-transparent pointer-events-none" />
      <div className="absolute top-40 left-1/4 w-96 h-96 bg-primary-500/5 dark:bg-primary-500/2 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-60 right-1/4 w-80 h-80 bg-secondary-500/5 dark:bg-secondary-500/2 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-industrial-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-industrial-700/30 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold shadow-md shadow-primary-500/20">
                P
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                PlantPulse <span className="text-primary-600 dark:text-secondary-400">AI</span>
              </span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 dark:text-industrial-300 hover:text-primary-600 dark:hover:text-white transition-colors">Features</a>
              <a href="#stats" className="text-sm font-medium text-slate-600 dark:text-industrial-300 hover:text-primary-600 dark:hover:text-white transition-colors">Stats</a>
              <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-industrial-300 hover:text-primary-600 dark:hover:text-white transition-colors">Login</Link>
              
              {/* Theme Toggle Button */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-slate-100 dark:bg-industrial-800 text-slate-600 dark:text-industrial-300 hover:text-primary-600 dark:hover:text-white transition-all duration-200"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>

              <button 
                onClick={handleGetStarted}
                className="text-sm bg-slate-900 dark:bg-primary-600 hover:bg-slate-800 dark:hover:bg-primary-500 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-sm"
              >
                Get Started
              </button>
            </nav>

            <div className="flex items-center gap-2 md:hidden">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-slate-100 dark:bg-industrial-800 text-slate-600 dark:text-industrial-300"
              >
                {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>
              <button 
                onClick={() => setMobileMenu(!mobileMenu)} 
                className="p-2 rounded-lg text-slate-600 dark:text-industrial-400 hover:text-slate-900 dark:hover:text-white"
              >
                {mobileMenu ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="md:hidden border-t border-slate-200/50 dark:border-industrial-700/30 px-4 py-4 space-y-3 bg-white dark:bg-industrial-900">
            <a href="#features" onClick={() => setMobileMenu(false)} className="block text-sm font-medium text-slate-600 dark:text-industrial-300 py-2">Features</a>
            <a href="#stats" onClick={() => setMobileMenu(false)} className="block text-sm font-medium text-slate-600 dark:text-industrial-300 py-2">Stats</a>
            <Link to="/login" onClick={() => setMobileMenu(false)} className="block text-sm font-medium text-slate-600 dark:text-industrial-300 py-2">Login</Link>
            <button 
              onClick={() => { setMobileMenu(false); handleGetStarted(); }} 
              className="block w-full text-sm bg-slate-900 dark:bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium text-center"
            >
              Get Started
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden page-enter">
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 text-primary-600 dark:text-primary-400 text-xs font-semibold mb-6 shadow-sm">
            <span className="w-2 h-2 bg-primary-500 dark:bg-primary-400 rounded-full animate-pulse" />
            AI-Powered Industrial IoT Platform
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6 tracking-tight">
            Smart Industrial <br className="hidden sm:inline" />
            <span className="text-gradient">Monitoring Platform</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-industrial-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Harness the power of AI to predict failures, optimize maintenance workflows, and maximize uptime across your industrial operations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button 
              onClick={handleGetStarted} 
              className="w-full sm:w-auto bg-slate-900 dark:bg-primary-600 hover:bg-slate-800 dark:hover:bg-primary-500 text-white px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-slate-900/10 dark:shadow-primary-500/20"
            >
              Get Started Free <FiArrowRight size={16} />
            </button>
            <Link 
              to="/login" 
              className="w-full sm:w-auto bg-white dark:bg-industrial-800 hover:bg-slate-50 dark:hover:bg-industrial-750 text-slate-700 dark:text-white px-8 py-3.5 rounded-xl font-medium text-sm border border-slate-200 dark:border-industrial-700/50 transition-all duration-200 shadow-sm"
            >
              Sign In
            </Link>
          </div>

          {/* Interactive Modern Mockup */}
          <div className="relative mx-auto max-w-5xl rounded-2xl border border-slate-200/80 dark:border-industrial-700/50 bg-white/50 dark:bg-industrial-800/30 p-2.5 backdrop-blur-md shadow-2xl shadow-slate-200/50 dark:shadow-black/60 float-animation">
            <div className="rounded-xl border border-slate-200/60 dark:border-industrial-700/40 bg-white dark:bg-industrial-950/80 overflow-hidden shadow-inner">
              {/* Fake App Bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-industrial-800/50 bg-slate-50/50 dark:bg-industrial-900/40">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
                  <span className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>
                <div className="h-5 w-44 bg-slate-200 dark:bg-industrial-800 rounded-md animate-pulse" />
                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-industrial-800" />
              </div>
              {/* Fake Dashboard Grid */}
              <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-industrial-900/50 rounded-xl border border-slate-100 dark:border-industrial-800/30">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-industrial-500">Asset Health</span>
                  <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">94.8%</div>
                  <div className="w-full bg-slate-200 dark:bg-industrial-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-primary-500 h-full rounded-full w-[94%]" />
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-industrial-900/50 rounded-xl border border-slate-100 dark:border-industrial-800/30">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-industrial-500">Operational Uptime</span>
                  <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">99.9%</div>
                  <div className="w-full bg-slate-200 dark:bg-industrial-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-secondary-500 h-full rounded-full w-[99%]" />
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-industrial-900/50 rounded-xl border border-slate-100 dark:border-industrial-800/30">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-industrial-500">Alert Status</span>
                  <div className="text-xl font-bold text-green-600 dark:text-green-400 mt-1 flex items-center gap-1.5">
                    <FiCheck className="stroke-[3]" /> All Nominal
                  </div>
                  <div className="h-1.5 w-16 bg-green-500/20 text-green-600 rounded-full mt-3 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-200/50 dark:border-industrial-800/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Powerful Capabilities</h2>
            <p className="text-slate-600 dark:text-industrial-400 max-w-xl mx-auto">Everything you need to monitor, diagnose, and optimize your industrial ecosystem in one place.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div 
                key={i} 
                className="group relative bg-white dark:bg-industrial-800/40 border border-slate-200/60 dark:border-industrial-700/30 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-industrial-600/50 transition-all duration-300 card-lift"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <f.icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 dark:text-industrial-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-100/50 dark:bg-industrial-950/30 border-y border-slate-200/40 dark:border-industrial-800/40 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Proven Efficiency</h2>
            <p className="text-slate-600 dark:text-industrial-400 max-w-xl mx-auto">Trusted by industrial engineering teams globally to maximize operational yield.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center p-6 bg-white dark:bg-industrial-800/20 border border-slate-200/60 dark:border-industrial-750/30 rounded-2xl shadow-sm">
                <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-indigo-500 dark:from-primary-400 dark:to-secondary-400 bg-clip-text text-transparent">
                  {i === 0 ? counters[i].toLocaleString() + '+' : counters[i] + '%'}
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-2">{s.label}</p>
                <p className="text-xs text-slate-400 dark:text-industrial-500 mt-1">{s.suffix}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="border-t border-slate-200/60 dark:border-industrial-800/20 py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-industrial-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  P
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  PlantPulse <span className="text-primary-600 dark:text-secondary-400">AI</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-industrial-400 leading-relaxed max-w-xs">
                Smart industrial monitoring and diagnostics powered by state-of-the-art machine learning.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Links</h4>
              <div className="space-y-3">
                <a href="#features" className="block text-xs text-slate-600 dark:text-industrial-400 hover:text-primary-600 dark:hover:text-white transition-colors">Features</a>
                <a href="#stats" className="block text-xs text-slate-600 dark:text-industrial-400 hover:text-primary-600 dark:hover:text-white transition-colors">Statistics</a>
                <Link to="/login" className="block text-xs text-slate-600 dark:text-industrial-400 hover:text-primary-600 dark:hover:text-white transition-colors">Login</Link>
                <Link to="/register" className="block text-xs text-slate-600 dark:text-industrial-400 hover:text-primary-600 dark:hover:text-white transition-colors">Register</Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">System Contact</h4>
              <p className="text-xs text-slate-600 dark:text-industrial-400">contact@plantpulse.ai</p>
              <p className="text-[10px] text-slate-400 dark:text-industrial-500 mt-3">© 2026 PlantPulse AI. All rights reserved.</p>
            </div>
          </div>
          <div className="border-t border-slate-200/50 dark:border-industrial-800/20 pt-8 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400 dark:text-industrial-500">Engineered for absolute industrial reliability and safety.</p>
            <p className="text-xs text-slate-400 dark:text-industrial-500">v1.1.0 • Stable</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
