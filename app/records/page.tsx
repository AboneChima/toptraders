'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Download, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import SideMenu from '@/components/SideMenu';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'trade' | 'profit' | 'loss';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  time: string;
}

export default function FinancialRecordsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'deposit' | 'withdraw' | 'trade'>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({ balance: 0, profit: 0, loss: 0 });
  const [showSideMenu, setShowSideMenu] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setTransactions([]);
      setStats({ balance: 0, profit: 0, loss: 0 });
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === filter);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'text-blue-400';
      case 'withdraw': return 'text-orange-400';
      case 'trade': return 'text-purple-400';
      case 'profit': return 'text-green-400';
      case 'loss': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-black/70 border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-base font-semibold text-white">Financial Records</h1>
          <button onClick={() => setShowSideMenu(true)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto">
        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-6"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/40 to-purple-500/40 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-medium text-gray-400 mb-1">Total Balance</p>
            <h2 className="text-3xl font-bold text-white mb-3">${stats.balance.toFixed(2)}</h2>
            <div className="flex gap-4 text-xs">
              <div>
                <span className="text-gray-400">Profit: </span>
                <span className="text-green-400 font-semibold">+${stats.profit.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-400">Loss: </span>
                <span className="text-red-400 font-semibold">-${stats.loss.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['all', 'deposit', 'withdraw', 'trade'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as 'all' | 'deposit' | 'withdraw' | 'trade')}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                filter === f
                  ? 'bg-white text-black shadow-lg'
                  : 'bg-white/5 text-gray-400 border border-white/10'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Transactions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-semibold text-gray-400">Transactions</h3>
            <button className="text-xs text-gray-400 flex items-center gap-1 hover:text-white">
              <Download className="w-3 h-3" />
              Export
            </button>
          </div>

          {filteredTransactions.length === 0 ? (
            <div
              className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 text-center"
              style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)' }}
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-sm font-medium text-gray-300 mb-1">No Transactions Yet</p>
              <p className="text-xs text-gray-500">Your transaction history will appear here</p>
            </div>
          ) : (
            filteredTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-4 flex items-center justify-between"
                style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)' }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-sm font-bold ${getTypeColor(transaction.type)}`}>
                    {transaction.type === 'deposit' ? '↓' : transaction.type === 'withdraw' ? '↑' : '⇄'}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white capitalize">{transaction.type}</h4>
                    <p className="text-xs text-gray-400">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${getTypeColor(transaction.type)}`}>
                    {transaction.type === 'withdraw' || transaction.type === 'loss' ? '-' : '+'}
                    ${transaction.amount.toFixed(2)}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    transaction.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    transaction.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {showSideMenu && <SideMenu onClose={() => setShowSideMenu(false)} />}
      </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}
