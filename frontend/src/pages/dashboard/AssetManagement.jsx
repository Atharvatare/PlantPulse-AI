import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiFilter } from 'react-icons/fi';
import AssetTable from '../../components/AssetTable';
import SearchBar from '../../components/SearchBar';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getAll, delete_ } from '../../services/assetService';
import { ASSET_CATEGORIES, ASSET_STATUSES } from '../../utils/constants';
import { formatDate, getHealthBarColor } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function AssetManagement() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewAsset, setViewAsset] = useState(null);

  const fetchAssets = () => {
    setLoading(true);
    const params = { page, limit: 10 };
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    if (categoryFilter) params.category = categoryFilter;
    getAll(params)
      .then((res) => {
        setAssets(res.data.assets || res.data || []);
        setTotalPages(res.data.totalPages || 1);
        setTotal(res.data.total || res.data.length || 0);
      })
      .catch(() => toast.error('Failed to load assets'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAssets(); }, [page, statusFilter, categoryFilter]);

  useEffect(() => {
    const timer = setTimeout(() => { if (search !== undefined) { setPage(1); fetchAssets(); } }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (asset) => {
    if (!window.confirm(`Delete ${asset.assetName || asset.name}?`)) return;
    try {
      await delete_(asset._id || asset.id);
      toast.success('Asset deleted');
      fetchAssets();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Asset Management</h1>
          <p className="text-sm text-industrial-400 mt-0.5">Manage and monitor all industrial assets</p>
        </div>
        <button onClick={() => navigate('/dashboard/assets/add')} className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all shadow-lg shadow-primary-500/20">
          <FiPlus size={16} /> Add Asset
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Search assets..." /></div>
        <div className="flex gap-3">
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-industrial-400" size={14} />
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="bg-industrial-800/80 border border-industrial-700/50 text-white text-sm rounded-lg pl-9 pr-8 py-2.5 focus:outline-none focus:border-primary-500/50 appearance-none cursor-pointer">
              <option value="">All Status</option>
              {ASSET_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-industrial-400" size={14} />
            <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className="bg-industrial-800/80 border border-industrial-700/50 text-white text-sm rounded-lg pl-9 pr-8 py-2.5 focus:outline-none focus:border-primary-500/50 appearance-none cursor-pointer">
              <option value="">All Categories</option>
              {ASSET_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-industrial-800/80 backdrop-blur-sm border border-industrial-700/50 rounded-xl overflow-hidden">
        <AssetTable
          assets={assets}
          loading={loading}
          onView={setViewAsset}
          onEdit={(a) => navigate(`/dashboard/assets/edit/${a._id || a.id}`)}
          onDelete={handleDelete}
        />
        <div className="px-4 pb-4">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} total={total} />
        </div>
      </div>

      <Modal isOpen={!!viewAsset} onClose={() => setViewAsset(null)} title="Asset Details" size="lg">
        {viewAsset && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{viewAsset.assetName || viewAsset.name}</h3>
                <p className="text-sm text-industrial-400 font-mono">{viewAsset.assetId || viewAsset._id}</p>
              </div>
              <StatusBadge status={viewAsset.status} size="md" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Category', viewAsset.category], ['Location', viewAsset.location],
                ['Vendor', viewAsset.vendor], ['Capacity', viewAsset.capacity],
                ['Installation Date', formatDate(viewAsset.installationDate)],
                ['Health Score', viewAsset.healthScore + '%'],
              ].map(([l, v]) => (
                <div key={l} className="p-3 rounded-lg bg-industrial-900/50">
                  <p className="text-xs text-industrial-400">{l}</p>
                  <p className="text-sm font-medium text-white mt-0.5">{v || 'N/A'}</p>
                </div>
              ))}
            </div>
            {viewAsset.healthScore !== undefined && (
              <div>
                <p className="text-xs text-industrial-400 mb-1.5">Health Score</p>
                <div className="h-2 bg-industrial-700/60 rounded-full overflow-hidden">
                  <div className={`h-full ${getHealthBarColor(viewAsset.healthScore)} rounded-full transition-all`} style={{ width: `${viewAsset.healthScore}%` }} />
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
