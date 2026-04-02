'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, CartesianGrid,
} from 'recharts';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function StatCard({ label, value, color, prefix = '₹' }) {
  return (
    <div className="card flex flex-col gap-2">
      <span className="text-sm text-gray-400">{label}</span>
      <span className={`text-2xl font-bold ${color}`}>
        {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—'}
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [trends, setTrends] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, c, t, r] = await Promise.all([
          api.get('dashboard/summary'),
          api.get('dashboard/category-breakdown'),
          api.get('dashboard/trends'),
          api.get('dashboard/recent'),
        ]);
        setSummary(s.data.data);
        setCategories(c.data.data);
        setTrends(
          t.data.data.map((item) => {
            const income = item.data.find((d) => d.type === 'INCOME')?.total || 0;
            const expense = item.data.find((d) => d.type === 'EXPENSE')?.total || 0;
            return {
              name: `${MONTH_NAMES[item._id.month - 1]} ${item._id.year}`,
              Income: income,
              Expense: expense,
            };
          })
        );
        setRecent(r.data.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="card text-red-400">{error}</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Financial overview and key metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Income" value={summary?.totalIncome} color="text-emerald-400" />
        <StatCard label="Total Expenses" value={summary?.totalExpenses} color="text-red-400" />
        <StatCard
          label="Net Balance"
          value={summary?.netBalance}
          color={summary?.netBalance >= 0 ? 'text-indigo-400' : 'text-red-400'}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">Monthly Trends</h2>
          {trends.length === 0 ? (
            <p className="text-gray-500 text-sm">No trend data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', color: '#f9fafb' }} />
                <Legend />
                <Line type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Expense" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">Category Breakdown</h2>
          {categories.length === 0 ? (
            <p className="text-gray-500 text-sm">No category data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={categories.map((c) => ({ name: c._id, Total: c.categoryTotal }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', color: '#f9fafb' }} />
                <Bar dataKey="Total" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Transactions</h2>
        {recent.length === 0 ? (
          <p className="text-gray-500 text-sm">No transactions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-800">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r._id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 text-gray-300">{new Date(r.date).toLocaleDateString('en-IN')}</td>
                    <td className="py-3 text-white font-medium">{r.category}</td>
                    <td className="py-3">
                      <span className={r.type === 'INCOME' ? 'badge-income' : 'badge-expense'}>{r.type}</span>
                    </td>
                    <td className={`py-3 font-semibold text-right ${r.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {r.type === 'INCOME' ? '+' : '-'}₹{r.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
