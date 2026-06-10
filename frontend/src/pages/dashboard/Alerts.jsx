import { useState, useEffect } from 'react';
import { FiBell, FiCheck, FiTrash2, FiAlertTriangle, FiInfo, FiActivity } from 'react-icons/fi';
import { getAll, getBySeverity, acknowledge, acknowledgeAll, delete_ } from '../../services/alertService';
import AlertBadge from '../../components/AlertBadge';
import { formatDate } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import toast from 'react-hot-toast';

const filters = ['All', 'Critical', 'Warning', 'Info'];

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  const fetchAlerts = () => {
    setLoading(true);
    const fetcher = activeFilter === 'All' ? getAll() : getBySeverity(activeFilter);
    fetcher
      .then((res) => setAlerts(res.data.alerts || []))
      .catch(() => toast.error('Failed to load alerts'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAlerts(); }, [activeFilter]);

  const handleAcknowledge = async (id) => {
    try {
      await acknowledge(id);
      toast.success('Alert acknowledged');
      fetchAlerts();
    } catch { toast.error('Failed to acknowledge'); }
  };

  const handleAcknowledgeAll = async () => {
    try {
      await acknowledgeAll();
      toast.success('All alerts acknowledged');
      fetchAlerts();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    try {
      await delete_(id);
      toast.success('Alert deleted');
      fetchAlerts();
    } catch { toast.error('Delete failed'); }
  };

  const getAlertIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'temperature': return <FiActivity size={16} />;
      case 'vibration': return <FiActivity size={16} />;
      case 'critical': return <FiAlertTriangle size={16} />;
      default: return <FiInfo size={16} />;
    }
  };

  const hasAlerts = alerts.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Alerts</h1>
          <p className="text-sm text-industrial-400 mt-0.5">Monitor and manage system alerts</p>
        </div>
        {hasAlerts && (
          <button onClick={handleAcknowledgeAll} className="flex items-center gap-2 text-sm text-industrial-400 hover:text-white bg-industrial-700/40 hover:bg-industrial-700/60 px-4 py-2 rounded-lg transition-colors">
            <FiCheck size={14} /> Acknowledge All
          </button>
        )}
      </div>

      <div className="flex gap-1 bg-industrial-800/40 rounded-lg p-1 w-fit">
        {filters.map((f) => (
          <button key={f} onClick={() => setActiveFilter(f)} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeFilter === f ? 'bg-primary-600 text-white' : 'text-industrial-400 hover:text-white'}`}>{f}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : !hasAlerts ? (
        <EmptyState icon={FiBell} title="No alerts" message="All clear! No alerts to display." />
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert._id || alert.id} className="bg-industrial-800/80 backdrop-blur-sm border border-industrial-700/50 rounded-xl p-5 hover:border-industrial-600/60 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-lg mt-0.5 ${
                    alert.severity === 'Critical' ? 'bg-red-500/10 text-red-400' :
                    alert.severity === 'Warning' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>
                    {getAlertIcon(alert.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <AlertBadge severity={alert.severity} />
                      <span className="text-xs font-mono text-industrial-400">{alert.assetId || alert.asset || alert.type}</span>
                      <span className="text-[10px] text-industrial-500">{formatDate(alert.timestamp || alert.createdAt)}</span>
                    </div>
                    <p className="text-sm text-white">{alert.message || alert.description || `${alert.type} alert for ${alert.assetId || 'asset'}`}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!alert.isAcknowledged && (
                    <button onClick={() => handleAcknowledge(alert._id || alert.id)} className="p-1.5 rounded-lg text-industrial-400 hover:text-green-400 hover:bg-green-400/10 transition-colors" title="Acknowledge">
                      <FiCheck size={15} />
                    </button>
                  )}
                  <button onClick={() => handleDelete(alert._id || alert.id)} className="p-1.5 rounded-lg text-industrial-400 hover:text-red-400 hover:bg-red-400/10 transition-colors" title="Delete">
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
