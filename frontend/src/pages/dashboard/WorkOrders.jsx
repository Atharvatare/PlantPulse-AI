import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { getAll, update } from '../../services/workOrderService';
import { getPriorityColor, formatDate } from '../../utils/helpers';
import SearchBar from '../../components/SearchBar';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const tabs = ['All', 'Open', 'In Progress', 'Completed'];

export default function WorkOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewOrder, setViewOrder] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    const params = { page, limit: 10, search };
    if (activeTab !== 'All') params.status = activeTab;
    getAll(params)
      .then((res) => {
        setOrders(res.data.workOrders || res.data || []);
        setTotalPages(res.data.totalPages || 1);
        setTotal(res.data.total || 0);
      })
      .catch(() => toast.error('Failed to load work orders'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [page, activeTab]);
  useEffect(() => { const t = setTimeout(() => { setPage(1); fetchOrders(); }, 300); return () => clearTimeout(t); }, [search]);

  const handleStatusUpdate = async (order, newStatus) => {
    try {
      await update(order._id || order.id, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      fetchOrders();
    } catch { toast.error('Update failed'); }
  };

  const statusIcon = (status) => {
    switch (status) {
      case 'Open': return <FiClock className="text-yellow-400" size={14} />;
      case 'In Progress': return <FiClock className="text-blue-400" size={14} />;
      case 'Completed': return <FiCheckCircle className="text-green-400" size={14} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Work Orders</h1>
          <p className="text-sm text-industrial-400 mt-0.5">Manage maintenance work orders</p>
        </div>
        <button onClick={() => navigate('/dashboard/work-orders/create')} className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all shadow-lg shadow-primary-500/20">
          <FiPlus size={16} /> Create Work Order
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Search work orders..." /></div>
      </div>

      <div className="flex gap-1 bg-industrial-800/40 rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === tab ? 'bg-primary-600 text-white' : 'text-industrial-400 hover:text-white'}`}>{tab}</button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12"><LoadingSpinner size="lg" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-industrial-400">
            <FiXCircle size={40} className="mx-auto mb-3 opacity-40" />
            <p>No work orders found</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id || order.id} className="bg-industrial-800/80 backdrop-blur-sm border border-industrial-700/50 rounded-xl p-5 hover:border-industrial-600/60 transition-all cursor-pointer" onClick={() => setViewOrder(order)}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-industrial-900/60">{statusIcon(order.status)}</div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-industrial-400">#{order.ticketNumber || order.ticketId || order._id?.slice(-6).toUpperCase()}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getPriorityColor(order.priority)}`}>{order.priority}</span>
                    </div>
                    <p className="text-sm font-medium text-white mt-0.5">{order.asset?.name || order.assetId || 'N/A'}</p>
                    <p className="text-xs text-industrial-400 mt-0.5 line-clamp-1">{order.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:text-right">
                  <div className="text-xs text-industrial-400">
                    <p>Assigned: <span className="text-white">{order.assignedTo || 'Unassigned'}</span></p>
                    <p className="mt-0.5">{formatDate(order.date || order.createdAt)}</p>
                  </div>
                  <div className="flex gap-1">
                    {order.status === 'Open' && <button onClick={(e) => { e.stopPropagation(); handleStatusUpdate(order, 'In Progress'); }} className="p-1.5 rounded text-industrial-400 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"><FiClock size={14} /></button>}
                    {order.status === 'In Progress' && <button onClick={(e) => { e.stopPropagation(); handleStatusUpdate(order, 'Completed'); }} className="p-1.5 rounded text-industrial-400 hover:text-green-400 hover:bg-green-400/10 transition-colors"><FiCheckCircle size={14} /></button>}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} total={total} />

      <Modal isOpen={!!viewOrder} onClose={() => setViewOrder(null)} title="Work Order Details" size="lg">
        {viewOrder && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-industrial-400">#{viewOrder.ticketNumber || viewOrder.ticketId || viewOrder._id?.slice(-6).toUpperCase()}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(viewOrder.priority)}`}>{viewOrder.priority}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Asset', viewOrder.asset?.name || viewOrder.assetId], ['Status', viewOrder.status],
                ['Assigned To', viewOrder.assignedTo || 'Unassigned'], ['Date', formatDate(viewOrder.date || viewOrder.createdAt)],
              ].map(([l, v]) => (
                <div key={l} className="p-3 rounded-lg bg-industrial-900/50">
                  <p className="text-xs text-industrial-400">{l}</p>
                  <p className="text-sm font-medium text-white mt-0.5">{v}</p>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-lg bg-industrial-900/50">
              <p className="text-xs text-industrial-400 mb-1">Description</p>
              <p className="text-sm text-white">{viewOrder.description || 'No description'}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
