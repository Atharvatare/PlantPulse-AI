import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import StatusBadge from './StatusBadge';
import { getHealthBarColor } from '../utils/helpers';

export default function AssetTable({ assets, onView, onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1,2,3,4,5].map((i) => (
          <div key={i} className="h-16 bg-industrial-800/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!assets || assets.length === 0) {
    return (
      <div className="text-center py-12 text-industrial-400">
        <p>No assets found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-industrial-700/50">
            <th className="text-left py-3 px-4 text-industrial-400 font-medium text-xs uppercase tracking-wider">Asset ID</th>
            <th className="text-left py-3 px-4 text-industrial-400 font-medium text-xs uppercase tracking-wider">Name</th>
            <th className="text-left py-3 px-4 text-industrial-400 font-medium text-xs uppercase tracking-wider">Category</th>
            <th className="text-left py-3 px-4 text-industrial-400 font-medium text-xs uppercase tracking-wider">Health Score</th>
            <th className="text-left py-3 px-4 text-industrial-400 font-medium text-xs uppercase tracking-wider">Status</th>
            <th className="text-right py-3 px-4 text-industrial-400 font-medium text-xs uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset._id || asset.id} className="border-b border-industrial-700/30 hover:bg-industrial-700/20 transition-colors">
              <td className="py-3 px-4 text-industrial-300 font-mono text-xs">{asset.assetId || asset._id?.slice(-6).toUpperCase()}</td>
              <td className="py-3 px-4 text-white font-medium">{asset.assetName || asset.name}</td>
              <td className="py-3 px-4"><span className="text-industrial-300">{asset.category}</span></td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-industrial-700/60 rounded-full overflow-hidden">
                    <div className={`h-full ${getHealthBarColor(asset.healthScore)} rounded-full transition-all duration-500`} style={{ width: `${asset.healthScore || 0}%` }} />
                  </div>
                  <span className="text-xs font-medium text-industrial-300 w-8 text-right">{asset.healthScore || 0}%</span>
                </div>
              </td>
              <td className="py-3 px-4"><StatusBadge status={asset.status} /></td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-end gap-1">
                  <button onClick={() => onView?.(asset)} className="p-1.5 rounded-lg text-industrial-400 hover:text-blue-400 hover:bg-blue-400/10 transition-all" title="View"><FiEye size={15} /></button>
                  <button onClick={() => onEdit?.(asset)} className="p-1.5 rounded-lg text-industrial-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all" title="Edit"><FiEdit2 size={15} /></button>
                  <button onClick={() => onDelete?.(asset)} className="p-1.5 rounded-lg text-industrial-400 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Delete"><FiTrash2 size={15} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
