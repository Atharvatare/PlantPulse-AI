import { useState } from 'react';
import { FiCpu, FiAlertTriangle, FiActivity, FiTarget } from 'react-icons/fi';
import { analyzeSensorData } from '../../services/maintenanceService';
import { getHealthColor, getHealthBarColor, formatDate } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const sensorFields = [
  { key: 'temperature', label: 'Temperature (°C)', placeholder: '85.5', min: 0, max: 200 },
  { key: 'current', label: 'Current (A)', placeholder: '12.3', min: 0, max: 100 },
  { key: 'voltage', label: 'Voltage (V)', placeholder: '415', min: 0, max: 1000 },
  { key: 'runningHours', label: 'Running Hours', placeholder: '1250', min: 0, max: 100000 },
  { key: 'vibration', label: 'Vibration Level (mm/s)', placeholder: '2.5', min: 0, max: 50 },
];

export default function PredictiveMaintenance() {
  const [form, setForm] = useState({ temperature: '', current: '', voltage: '', runningHours: '', vibration: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    const empty = Object.entries(form).filter(([_, v]) => !v);
    if (empty.length) { toast.error('Please fill all sensor fields'); return; }
    setLoading(true);
    try {
      const res = await analyzeSensorData({
        temperature: parseFloat(form.temperature),
        current: parseFloat(form.current),
        voltage: parseFloat(form.voltage),
        runningHours: parseFloat(form.runningHours),
        vibration: parseFloat(form.vibration),
      });
      const resultData = res.data?.data?.result || res.data?.result || res.data;
      setResult(resultData);
      setHistory((prev) => [{ ...resultData, timestamp: new Date() }, ...prev].slice(0, 10));
      toast.success('Analysis complete');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed');
    } finally { setLoading(false); }
  };

  const riskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      case 'critical': return 'text-red-400 animate-pulse';
      default: return 'text-industrial-400';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Predictive Maintenance</h1>
        <p className="text-sm text-industrial-400 mt-0.5">AI-powered sensor analysis and failure prediction</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-industrial-800/80 backdrop-blur-sm border border-industrial-700/50 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><FiCpu className="text-primary-400" /> Sensor Data Input</h2>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {sensorFields.map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-industrial-300 mb-1">{f.label}</label>
                  <input type="number" step="any" value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder} className="w-full bg-industrial-900/80 border border-industrial-700/50 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all placeholder-industrial-500" />
                </div>
              ))}
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white py-3 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <LoadingSpinner size="sm" /> : <FiActivity size={16} />}
              {loading ? 'Analyzing...' : 'Analyze Sensor Data'}
            </button>
          </form>
        </div>

        <div className="bg-industrial-800/80 backdrop-blur-sm border border-industrial-700/50 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><FiTarget className="text-secondary-400" /> Analysis Results</h2>
          {result ? (
            <div className="space-y-5">
              <div className="flex items-center justify-center py-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="#1e293b" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke={result.healthScore >= 80 ? '#22c55e' : result.healthScore >= 60 ? '#f59e0b' : '#ef4444'} strokeWidth="3" strokeDasharray={`${result.healthScore * 0.973} 100`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-2xl font-bold ${getHealthColor(result.healthScore)}`}>{result.healthScore}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-industrial-900/50">
                  <p className="text-[10px] text-industrial-400 uppercase tracking-wider">Failure Probability</p>
                  <p className="text-lg font-bold text-white mt-0.5">{result.failureProbability || 0}%</p>
                </div>
                <div className="p-3 rounded-lg bg-industrial-900/50">
                  <p className="text-[10px] text-industrial-400 uppercase tracking-wider">Risk Level</p>
                  <p className={`text-lg font-bold mt-0.5 ${riskColor(result.riskLevel)}`}>{result.riskLevel || 'N/A'}</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-industrial-900/50 border border-primary-500/20">
                <p className="text-[10px] text-industrial-400 uppercase tracking-wider mb-1">Recommended Action</p>
                <p className="text-sm text-white">{result.recommendedAction || 'No specific action recommended.'}</p>
              </div>
              {result.healthScore !== undefined && (
                <div>
                  <p className="text-xs text-industrial-400 mb-1">Health Score</p>
                  <div className="h-2.5 bg-industrial-700/60 rounded-full overflow-hidden">
                    <div className={`h-full ${getHealthBarColor(result.healthScore)} rounded-full transition-all duration-1000`} style={{ width: `${result.healthScore}%` }} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-industrial-500">
              <FiCpu size={40} className="mb-3 opacity-40" />
              <p className="text-sm">Submit sensor data for analysis</p>
            </div>
          )}
        </div>
      </div>

      {history.length > 0 && (
        <div className="bg-industrial-800/80 backdrop-blur-sm border border-industrial-700/50 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Analysis History</h2>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-industrial-900/50 hover:bg-industrial-700/30 transition-colors">
                <div className="flex items-center gap-4">
                  <span className={`text-sm font-bold ${getHealthColor(h.healthScore)}`}>{h.healthScore}%</span>
                  <span className={`text-xs font-medium ${riskColor(h.riskLevel)}`}>{h.riskLevel}</span>
                  <span className="text-xs text-industrial-400">Failure: {h.failureProbability || 0}%</span>
                </div>
                <span className="text-[10px] text-industrial-500">{formatDate(h.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
