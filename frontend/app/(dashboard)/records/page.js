'use client';
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';

const CATEGORIES = ['Salary', 'Rent', 'Groceries', 'Utilities', 'Investment', 'Sales', 'Other'];

function RecordModal({ record, onClose, onSaved }) {
  const [form, setForm] = useState(
    record
      ? { amount: record.amount, type: record.type, category: record.category, date: record.date?.slice(0, 10), notes: record.notes || '' }
      : { amount: '', type: 'INCOME', category: 'Salary', date: new Date().toISOString().slice(0, 10), notes: '' }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, amount: parseFloat(form.amount) };
      if (record) await api.put(`records/${record._id}`, payload);
      else await api.post('records', payload);
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white">{record ? 'Edit Record' : 'New Record'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl bg-transparent border-0 cursor-pointer">×</button>
        </div>
        {error && <div className="mb-4 p-3 bg-red-950 border border-red-800 rounded-lg text-red-400 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Amount (₹)</label>
              <input type="number" step="0.01" min="0.01" className="input" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Type</label>
              <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="INCOME">INCOME</option>
                <option value="EXPENSE">EXPENSE</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Category</label>
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Date</label>
              <input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Notes (optional)</label>
            <textarea className="input" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white transition-colors cursor-pointer bg-transparent">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RecordsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [records, setRecords] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // null | 'create' | record object
  const [filters, setFilters] = useState({ type: '', category: '', startDate: '', endDate: '', page: 1, limit: 10 });

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
      const { data } = await api.get('records', { params });
      setRecords(data.data);
      setMeta(data.meta);
    } catch {
      setError('Failed to load records.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await api.delete(`records/${id}`);
      fetchRecords();
    } catch {
      alert('Failed to delete record.');
    }
  };

  const setPage = (p) => setFilters((f) => ({ ...f, page: p }));

  return (
    <div className="flex flex-col gap-6">
      {modal && (
        <RecordModal
          record={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={fetchRecords}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Financial Records</h1>
          <p className="text-gray-400 mt-1">{meta.total} records found</p>
        </div>
        {isAdmin && (
          <button className="btn-primary" onClick={() => setModal('create')}>+ New Record</button>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Type</label>
            <select className="input text-sm" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}>
              <option value="">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Category</label>
            <select className="input text-sm" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}>
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">From Date</label>
            <input type="date" className="input text-sm" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value, page: 1 })} />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">To Date</label>
            <input type="date" className="input text-sm" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value, page: 1 })} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="p-6 text-red-400">{error}</div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No records found. {isAdmin && 'Create your first record!'}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: '#111827' }}>
                <tr className="text-left text-gray-400">
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Notes</th>
                  <th className="px-6 py-4 font-medium text-right">Amount</th>
                  {isAdmin && <th className="px-6 py-4 font-medium text-center">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id} className="border-t border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 text-gray-300">{new Date(r.date).toLocaleDateString('en-IN')}</td>
                    <td className="px-6 py-4 text-white font-medium">{r.category}</td>
                    <td className="px-6 py-4"><span className={r.type === 'INCOME' ? 'badge-income' : 'badge-expense'}>{r.type}</span></td>
                    <td className="px-6 py-4 text-gray-400 max-w-xs truncate">{r.notes || '—'}</td>
                    <td className={`px-6 py-4 font-semibold text-right ${r.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {r.type === 'INCOME' ? '+' : '-'}₹{r.amount.toLocaleString('en-IN')}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setModal(r)} className="text-xs text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded hover:bg-indigo-950 transition-colors cursor-pointer bg-transparent border-0">Edit</button>
                          <button onClick={() => handleDelete(r._id)} className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-950 transition-colors cursor-pointer bg-transparent border-0">Delete</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(meta.page - 1)} disabled={meta.page <= 1} className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white disabled:opacity-40 cursor-pointer bg-transparent">← Prev</button>
          <span className="text-gray-400 text-sm">Page {meta.page} of {meta.totalPages}</span>
          <button onClick={() => setPage(meta.page + 1)} disabled={meta.page >= meta.totalPages} className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white disabled:opacity-40 cursor-pointer bg-transparent">Next →</button>
        </div>
      )}
    </div>
  );
}
