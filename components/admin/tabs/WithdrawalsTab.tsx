'use client';

import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { api } from '@/lib/api';

export default function WithdrawalsTab() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWithdrawals();
    const interval = setInterval(loadWithdrawals, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadWithdrawals = async () => {
    try {
      const result = await api.getWithdrawals();
      if (result.withdrawals) {
        setWithdrawals(result.withdrawals);
      }
      setLoading(false);
    } catch (error) {
      console.error('Load withdrawals error:', error);
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.updateWithdrawalStatus(id, status);
      loadWithdrawals();
    } catch (error) {
      console.error('Update withdrawal error:', error);
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div
      className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6"
      style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
    >
      <h3 className="text-lg font-semibold text-white mb-6">Withdrawal Requests ({withdrawals.length})</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">User</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Amount</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Wallet</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Date</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((w) => (
              <tr key={w.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-4 text-sm text-white">{w.userName}</td>
                <td className="py-3 px-4 text-sm text-white">${w.amount.toFixed(2)}</td>
                <td className="py-3 px-4 text-sm text-gray-400 text-xs">{w.walletAddress.substring(0, 10)}...</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    w.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    w.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {w.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-400">
                  {new Date(w.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  {w.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateStatus(w.id, 'approved')}
                        className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(w.id, 'rejected')}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {withdrawals.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500 text-sm">
                  No withdrawal requests
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
