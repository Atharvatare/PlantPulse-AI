import { useState, useEffect } from 'react';
import { FiShield, FiUsers, FiActivity, FiTool, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { USER_ROLES } from '../../utils/constants';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    api.get('/users')
      .then((res) => setUsers(res.data.data || res.data.users || []))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = (user) => {
    setEditingUser(user);
    setNewRole(user.role);
  };

  const saveRole = async () => {
    try {
      await api.put(`/users/${editingUser._id || editingUser.id}/role`, { role: newRole });
      toast.success(`Role updated for ${editingUser.name}`);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete user ${user.name}?`)) return;
    try {
      await api.delete(`/users/${user._id || user.id}`);
      toast.success(`${user.name} deactivated`);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <FiShield className="text-primary-400" /> Admin Panel
        </h1>
        <p className="text-sm text-industrial-400 mt-0.5">Manage users and system settings</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={users.length} icon={FiUsers} color="primary" />
        <StatCard title="Active Users" value={users.filter((u) => u.status !== 'Inactive').length} icon={FiActivity} color="secondary" />
        <StatCard title="Admins" value={users.filter((u) => u.role === 'Admin').length} icon={FiShield} color="warning" />
        <StatCard title="Engineers" value={users.filter((u) => u.role === 'Engineer').length} icon={FiTool} color="info" />
      </div>

      <div className="bg-industrial-800/80 backdrop-blur-sm border border-industrial-700/50 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-industrial-700/30">
          <h2 className="text-sm font-semibold text-white">User Management</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-industrial-700/30">
                <th className="text-left py-3 px-4 text-industrial-400 font-medium text-xs uppercase tracking-wider">Name</th>
                <th className="text-left py-3 px-4 text-industrial-400 font-medium text-xs uppercase tracking-wider">Email</th>
                <th className="text-left py-3 px-4 text-industrial-400 font-medium text-xs uppercase tracking-wider">Role</th>
                <th className="text-left py-3 px-4 text-industrial-400 font-medium text-xs uppercase tracking-wider">Status</th>
                <th className="text-right py-3 px-4 text-industrial-400 font-medium text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id || user.id} className="border-b border-industrial-700/20 hover:bg-industrial-700/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold">
                        {(user.name || '?').charAt(0)}
                      </div>
                      <span className="text-white font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-industrial-300">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'Admin' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' :
                      user.role === 'Engineer' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                      'bg-green-500/10 text-green-400 border border-green-500/30'
                    }`}>{user.role}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs ${user.status === 'Inactive' ? 'text-industrial-400' : 'text-green-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Inactive' ? 'bg-industrial-400' : 'bg-green-400'}`} />
                      {user.status || 'Active'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleRoleChange(user)} className="p-1.5 rounded-lg text-industrial-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors"><FiEdit2 size={14} /></button>
                      <button onClick={() => handleDelete(user)} className="p-1.5 rounded-lg text-industrial-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!editingUser} onClose={() => setEditingUser(null)} title="Edit User Role">
        {editingUser && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-industrial-900/50">
              <p className="text-xs text-industrial-400">User</p>
              <p className="text-sm font-medium text-white">{editingUser.name}</p>
              <p className="text-xs text-industrial-400">{editingUser.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-industrial-300 mb-1.5">Role</label>
              <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="w-full bg-industrial-900/80 border border-industrial-700/50 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500/50 appearance-none">
                {USER_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setEditingUser(null)} className="px-4 py-2 text-sm text-industrial-300 hover:text-white bg-industrial-700/40 hover:bg-industrial-700/60 rounded-lg transition-colors">Cancel</button>
              <button onClick={saveRole} className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"><FiEdit2 size={15} /> Save</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
