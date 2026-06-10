import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { create, update, getById } from '../../services/assetService';
import { ASSET_CATEGORIES, ASSET_STATUSES } from '../../utils/constants';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AddAsset() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [form, setForm] = useState({
    assetId: '', assetName: '', category: 'Motor', location: '', vendor: '',
    capacity: '', installationDate: '', status: 'Running', healthScore: 100
  });

  useEffect(() => {
    if (isEdit) {
      getById(id)
        .then((res) => {
          const a = res.data.asset || res.data;
          setForm({
            assetId: a.assetId || '', assetName: a.assetName || a.name || '', category: a.category || 'Motor',
            location: a.location || '', vendor: a.vendor || '', capacity: a.capacity || '',
            installationDate: a.installationDate ? a.installationDate.split('T')[0] : '',
            status: a.status || 'Running', healthScore: a.healthScore || 100
          });
        })
        .catch(() => toast.error('Failed to load asset'))
        .finally(() => setFetching(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.assetName || !form.category) { toast.error('Name and category are required'); return; }
    setLoading(true);
    try {
      if (isEdit) {
        await update(id, form);
        toast.success('Asset updated');
      } else {
        await create(form);
        toast.success('Asset created');
      }
      navigate('/dashboard/assets');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save asset');
    } finally { setLoading(false); }
  };

  if (fetching) {
    return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/dashboard/assets')} className="p-2 rounded-lg text-industrial-400 hover:text-white hover:bg-industrial-700/60 transition-colors">
          <FiArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">{isEdit ? 'Edit Asset' : 'Add New Asset'}</h1>
          <p className="text-sm text-industrial-400 mt-0.5">{isEdit ? 'Update asset details' : 'Register a new industrial asset'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-industrial-800/80 backdrop-blur-sm border border-industrial-700/50 rounded-xl p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-industrial-300 mb-1.5">Asset ID</label>
            <input type="text" value={form.assetId} onChange={(e) => setForm({ ...form, assetId: e.target.value })} className="w-full bg-industrial-900/80 border border-industrial-700/50 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all placeholder-industrial-500" placeholder="Auto-generated" />
          </div>
          <div>
            <label className="block text-sm font-medium text-industrial-300 mb-1.5">Asset Name *</label>
            <input type="text" value={form.assetName} onChange={(e) => setForm({ ...form, assetName: e.target.value })} className="w-full bg-industrial-900/80 border border-industrial-700/50 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all placeholder-industrial-500" placeholder="Motor MTR-101" />
          </div>
          <div>
            <label className="block text-sm font-medium text-industrial-300 mb-1.5">Category *</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-industrial-900/80 border border-industrial-700/50 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500/50 appearance-none cursor-pointer">
              {ASSET_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-industrial-300 mb-1.5">Location</label>
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full bg-industrial-900/80 border border-industrial-700/50 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all placeholder-industrial-500" placeholder="Building A, Floor 2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-industrial-300 mb-1.5">Vendor</label>
            <input type="text" value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} className="w-full bg-industrial-900/80 border border-industrial-700/50 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all placeholder-industrial-500" placeholder="Siemens" />
          </div>
          <div>
            <label className="block text-sm font-medium text-industrial-300 mb-1.5">Capacity</label>
            <input type="text" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="w-full bg-industrial-900/80 border border-industrial-700/50 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all placeholder-industrial-500" placeholder="500 kW" />
          </div>
          <div>
            <label className="block text-sm font-medium text-industrial-300 mb-1.5">Installation Date</label>
            <input type="date" value={form.installationDate} onChange={(e) => setForm({ ...form, installationDate: e.target.value })} className="w-full bg-industrial-900/80 border border-industrial-700/50 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-industrial-300 mb-1.5">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full bg-industrial-900/80 border border-industrial-700/50 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500/50 appearance-none cursor-pointer">
              {ASSET_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-industrial-300 mb-1.5">Health Score</label>
          <div className="flex items-center gap-3">
            <input type="range" min="0" max="100" value={form.healthScore} onChange={(e) => setForm({ ...form, healthScore: parseInt(e.target.value) })} className="flex-1 accent-primary-500" />
            <span className="text-sm font-mono text-white w-10 text-right">{form.healthScore}%</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-industrial-700/30">
          <button type="button" onClick={() => navigate('/dashboard/assets')} className="px-5 py-2.5 text-sm font-medium text-industrial-300 hover:text-white bg-industrial-700/40 hover:bg-industrial-700/60 rounded-lg transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50">
            {loading ? <LoadingSpinner size="sm" /> : <FiSave size={16} />}
            {isEdit ? 'Update Asset' : 'Create Asset'}
          </button>
        </div>
      </form>
    </div>
  );
}
