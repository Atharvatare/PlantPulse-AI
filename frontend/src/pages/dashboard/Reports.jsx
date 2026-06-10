import { useState, useEffect } from 'react';
import { FiFileText, FiBarChart2, FiAlertTriangle, FiCalendar, FiDownload, FiTrash2, FiFile } from 'react-icons/fi';
import { getAll, generate, delete_ } from '../../services/reportService';
import { formatDate } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import toast from 'react-hot-toast';

const reportTypes = [
  { key: 'asset', label: 'Asset Reports', desc: 'Detailed reports on asset health, status, and performance metrics', icon: FiBarChart2, color: 'primary' },
  { key: 'maintenance', label: 'Maintenance Reports', desc: 'Maintenance history, costs, and scheduling reports', icon: FiFileText, color: 'secondary' },
  { key: 'failure', label: 'Failure Reports', desc: 'Failure analysis, root cause, and trend reports', icon: FiAlertTriangle, color: 'danger' },
  { key: 'monthly', label: 'Monthly Reports', desc: 'Comprehensive monthly operations and performance summary', icon: FiCalendar, color: 'info' },
];

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(null);

  const fetchReports = () => {
    setLoading(true);
    getAll()
      .then((res) => setReports(res.data.reports || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReports(); }, []);

  const handleGenerate = async (type) => {
    setGenerating(type);
    try {
      const res = await generate({ type, format: 'pdf' });
      setReports((prev) => [res.data.data || res.data.report || res.data, ...prev]);
      toast.success(`${type} report generated`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    } finally { setGenerating(null); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this report?')) return;
    try {
      await delete_(id);
      setReports((prev) => prev.filter((r) => (r._id || r.id) !== id));
      toast.success('Report deleted');
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Reports</h1>
        <p className="text-sm text-industrial-400 mt-0.5">Generate and manage reports</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((rt) => (
          <div key={rt.key} className="bg-industrial-800/80 backdrop-blur-sm border border-industrial-700/50 rounded-xl p-5 hover:border-industrial-600/60 transition-all">
            <div className={`w-10 h-10 rounded-lg bg-${rt.color}-500/10 text-${rt.color}-400 flex items-center justify-center mb-3`}>
              <rt.icon size={20} />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">{rt.label}</h3>
            <p className="text-xs text-industrial-400 mb-4 leading-relaxed">{rt.desc}</p>
            <button
              onClick={() => handleGenerate(rt.key)}
              disabled={generating === rt.key}
              className="w-full flex items-center justify-center gap-2 bg-industrial-700/40 hover:bg-industrial-700/60 text-white text-xs font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {generating === rt.key ? <LoadingSpinner size="sm" /> : <FiDownload size={14} />}
              {generating === rt.key ? 'Generating...' : 'Generate'}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-industrial-800/80 backdrop-blur-sm border border-industrial-700/50 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Past Reports</h2>
        {loading ? (
          <div className="flex justify-center py-8"><LoadingSpinner size="md" /></div>
        ) : reports.length === 0 ? (
          <EmptyState icon={FiFile} title="No reports yet" message="Generate your first report to see it here." />
        ) : (
          <div className="space-y-2">
            {reports.map((r) => (
              <div key={r._id || r.id} className="flex items-center justify-between p-3 rounded-lg bg-industrial-900/50 hover:bg-industrial-700/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-500/10 text-primary-400"><FiFileText size={16} /></div>
                  <div>
                    <p className="text-sm font-medium text-white">{r.name || r.type || 'Report'}</p>
                    <p className="text-xs text-industrial-400">{r.type} • {formatDate(r.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded text-industrial-400 hover:text-primary-400 hover:bg-primary-400/10 transition-colors"><FiDownload size={14} /></button>
                  <button onClick={() => handleDelete(r._id || r.id)} className="p-1.5 rounded text-industrial-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"><FiTrash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
