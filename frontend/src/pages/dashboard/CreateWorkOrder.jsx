import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { create } from '../../services/workOrderService';
import { getAll as getAssets } from '../../services/assetService';
import { PRIORITY_LEVELS, WORK_ORDER_STATUSES } from '../../utils/constants';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function CreateWorkOrder() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    assetId: '', priority: 'Medium', description: '', assignedTo: '', status: 'Open'
  });

  useEffect(() => {
    getAssets({ limit: 100 })
      .then((res) => setAssets(res.data.assets || res.data || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.assetId || !form.description) { toast.error('Asset and description are required'); return; }
    setLoading(true);
    try {
      await create(form);
      toast.success('Work order created');
      navigate('/dashboard/work-orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create work order');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/dashboard/work-orders')} className="p-2 rounded-lg text-industrial-400 hover:text-white hover:bg-industrial-700/60 transition-colors">
          <FiArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">Create Work Order</h1>
          <p className="text-sm text-industrial-400 mt-0.5">Create a new maintenance work order</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-industrial-800/80 backdrop-blur-sm border border-industrial-700/50 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-industrial-300 mb-1.5">Asset *</label>
          <select value={form.assetId} onChange={(e) => setForm({ ...form, assetId: e.target.value })} className="w-full bg-industrial-900/80 border border-industrial-700/50 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500/50 appearance-none cursor-pointer">
            <option value="">Select an asset</option>
            {assets.map((a) => (
              <option key={a._id || a.id} value={a._id || a.id}>{a.assetName || a.name} ({a.assetId || ''})</option>
            ))}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-industrial-300 mb-1.5">Priority</label>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full bg-industrial-900/80 border border-industrial-700/50 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500/50 appearance-none cursor-pointer">
              {PRIORITY_LEVELS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-industrial-300 mb-1.5">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full bg-industrial-900/80 border border-industrial-700/50 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500/50 appearance-none cursor-pointer">
              {WORK_ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-industrial-300 mb-1.5">Assigned Engineer</label>
          <input type="text" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} className="w-full bg-industrial-900/80 border border-industrial-700/50 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all placeholder-industrial-500" placeholder="Engineer name" />
        </div>

        <div>
          <label className="block text-sm font-medium text-industrial-300 mb-1.5">Description *</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full bg-industrial-900/80 border border-industrial-700/50 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all placeholder-industrial-500 resize-none" placeholder="Describe the maintenance issue..." />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-industrial-700/30">
          <button type="button" onClick={() => navigate('/dashboard/work-orders')} className="px-5 py-2.5 text-sm font-medium text-industrial-300 hover:text-white bg-industrial-700/40 hover:bg-industrial-700/60 rounded-lg transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50">
            {loading ? <LoadingSpinner size="sm" /> : <FiSave size={16} />}
            Create Work Order
          </button>
        </div>
      </form>
    </div>
  );
}
