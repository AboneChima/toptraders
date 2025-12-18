'use client';

import { useState, useEffect } from 'react';
import { useAdminStore } from '@/store/adminStore';

export default function TradesTab() {
  const [mounted, setMounted] = useState(false);
  const trades = useAdminStore((state) => state.trades);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div
      className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6"
      style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
    >
      <h3 className="text-lg font-semibold text-white mb-6">All Trades</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">User</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Pair</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Type</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Amount</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Profit/Loss</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Date</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-4 text-sm text-white">{trade.userName}</td>
                <td className="py-3 px-4 text-sm text-white">{trade.pair}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    trade.type === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {trade.type.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-white">${trade.amount}</td>
                <td className="py-3 px-4">
                  <span className={`text-sm font-semibold ${trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trade.profit >= 0 ? '+' : ''}${trade.profit}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    trade.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    trade.status === 'active' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {trade.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-400">
                  {new Date(trade.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {trades.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500 text-sm">
                  No trades yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
