'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';

export default function UsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'VIEWER' });
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null); // id of user being updated

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [user, router]);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('users');
      setUsers(data.data);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setUpdating('creating');
    try {
      await api.post('users', formData);
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', role: 'VIEWER' });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create user');
    } finally {
      setUpdating(null);
    }
  };

  const updateRole = async (id, role) => {
    setUpdating(id);
    try {
      await api.put(`users/${id}/role`, { role });
      fetchUsers();
    } catch {
      alert('Failed to update role.');
    } finally {
      setUpdating(null);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setUpdating(id);
    try {
      await api.put(`users/${id}/status`, { status: newStatus });
      fetchUsers();
    } catch {
      alert('Failed to update status.');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-gray-400 mt-1">{users.length} users in the system</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Create User
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-md animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-white mb-4">Add New User</h2>
            <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
              {error && <p className="text-sm text-red-500 bg-red-500/10 p-2 rounded">{error}</p>}
              <div className="flex flex-col gap-1">
                <label className="label">Full Name</label>
                <input 
                  className="input" 
                  value={formData.name} 
                  required
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="label">Email Address</label>
                <input 
                  type="email" 
                  className="input" 
                  value={formData.email} 
                  required
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="label">Temporary Password</label>
                <input 
                  type="password" 
                  className="input" 
                  value={formData.password} 
                  required
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="label">Initial Role</label>
                <select 
                  className="input" 
                  value={formData.role} 
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="VIEWER">VIEWER</option>
                  <option value="ANALYST">ANALYST</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div className="flex gap-3 mt-2">
                <button 
                  type="button" 
                  className="btn-secondary flex-1" 
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={updating === 'creating'}
                  className="btn-primary flex-1"
                >
                  {updating === 'creating' ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ background: '#111827' }}>
              <tr className="text-left text-gray-400">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-gray-800 hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">
                    {u.name}
                    {u._id === user?._id && <span className="ml-2 text-xs text-indigo-400">(you)</span>}
                  </td>
                  <td className="px-6 py-4 text-gray-400">{u.email}</td>
                  <td className="px-6 py-4">
                    <select
                      className="input text-xs py-1 px-2 w-auto"
                      value={u.role}
                      disabled={u._id === user?._id || updating === u._id}
                      onChange={(e) => updateRole(u._id, e.target.value)}
                    >
                      <option value="VIEWER">VIEWER</option>
                      <option value="ANALYST">ANALYST</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={u.status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}>{u.status}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-6 py-4 text-center">
                    {u._id !== user?._id ? (
                      <button
                        onClick={() => toggleStatus(u._id, u.status)}
                        disabled={updating === u._id}
                        className={`text-xs px-3 py-1 rounded-lg border cursor-pointer bg-transparent transition-colors ${
                          u.status === 'ACTIVE'
                            ? 'border-red-800 text-red-400 hover:bg-red-950'
                            : 'border-emerald-800 text-emerald-400 hover:bg-emerald-950'
                        }`}
                      >
                        {updating === u._id ? '...' : u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                    ) : (
                      <span className="text-gray-600 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
