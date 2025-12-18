'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff, TrendingUp, TrendingDown, Plus, ArrowUpRight, ArrowDownLeft, Menu, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import SideMenu from '@/components/SideMenu';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';

export default function AssetsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [hideBalance, setHideBalance] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (user) {
      loadData();
      const interval = setInterval(loadData, 3000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      // Load user balance
      const usersResult = await api.getUsers();
      if (usersResult.users) {
        const currentUser = usersResult.users.find((u: any) => u.id === user.id);
        if (currentUser) {
          setBalance(currentUser.balance);
          // Update auth store
          useAuthStore.getState().updateUserBalance(user.id, currentUser.balance);
        }
      }

      // Load deposits
      const depositsResult = await api.getDeposits();
      if (depositsResult.deposits) {
        const userDeposits = depositsResult.deposits.filter((d: any) => d.userId === user.id);
        setDeposits(userDeposits);
      }

      // Load withdrawals
      const withdrawalsResult = await api.getWithdrawals();
      if (withdrawalsResult.withdrawals) {
        const userWithdrawals = withdrawalsResult.withdrawals.filter((w: any) => w.userId === user.id);
        setWithdrawals(userWithdrawals);
      }
    } catch (error) {
      console.error('Load data error:', error);
    }
  };

  const allTransactions = [
    ...deposits.map(d => ({ ...d, type: 'deposit' })),
    ...withdrawals.map(w => ({ ...w, type: 'withdrawal' })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        <div className="sticky top-0 z-20 backdrop-blur-xl bg-black/70 border-b border-white/10">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-base font-semibold text-white">My Assets</h1>
            <button onClick={() => setShowSideMenu(true)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Menu className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto">
          {/* Balance Card */}
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
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-500/20 to-orange-500/20 rounded-full blur-3xl" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-gray-400">Total Balance</p>
                <button 
                  onClick={() => setHideBalance(!hideBalance)} 
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                >
                  {hideBalance ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                </button>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {hideBalance ? '••••••' : `$${balance.toFixed(2)}`}
              </h2>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Plus, label: 'Deposit', color: 'from-blue-500/20 to-blue-600/20', iconColor: 'text-blue-400', path: '/deposit' },
              { icon: ArrowUpRight, label: 'Withdraw', color: 'from-orange-500/20 to-orange-600/20', iconColor: 'text-orange-400', path: '/withdraw' },
              { icon: ArrowDownLeft, label: 'Trade', color: 'from-green-500/20 to-green-600/20', iconColor: 'text-green-400', path: '/trade' },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => router.push(action.path)}
                className="relative overflow-hidden rounded-2xl p-4 backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)' }}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-2`}>
                  <action.icon className={`w-5 h-5 ${action.iconColor}`} />
                </div>
                <span className="text-xs font-medium text-gray-300">{action.label}</span>
              </button>
            ))}
          </div>

          {/* Transactions */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 px-1">Recent Transactions</h3>
            
            {allTransactions.length === 0 ? (
              <div className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 text-center"
                style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)' }}
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center">
                  <ArrowDownLeft className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-sm font-medium text-gray-300 mb-1">No Transactions Yet</p>
                <p className="text-xs text-gray-500 mb-4">Start by making a deposit</p>
                <button
                  onClick={() => router.push('/deposit')}
                  className="px-4 py-2 bg-white text-black text-xs font-medium rounded-full hover:bg-gray-200 transition-colors"
                >
                  Deposit Funds
                </button>
              </div>
            ) : (
              allTransactions.map((transaction, index) => (
                <motion.div
                  key={`${transaction.type}-${transaction.id}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-4"
                  style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        transaction.type === 'deposit' ? 'bg-green-500/20' : 'bg-orange-500/20'
                      }`}>
                        {transaction.type === 'deposit' ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-400" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-orange-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white capitalize">{transaction.type}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(transaction.createdAt).toLocaleDateString()} {new Date(transaction.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${
                        transaction.type === 'deposit' ? 'text-green-400' : 'text-orange-400'
                      }`}>
                        {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-1 justify-end">
                        {transaction.status === 'pending' && (
                          <>
                            <Clock className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs text-yellow-400">Pending</span>
                          </>
                        )}
                        {(transaction.status === 'confirmed' || transaction.status === 'approved') && (
                          <>
                            <CheckCircle className="w-3 h-3 text-green-400" />
                            <span className="text-xs text-green-400">Completed</span>
                          </>
                        )}
                        {transaction.status === 'rejected' && (
                          <>
                            <XCircle className="w-3 h-3 text-red-400" />
                            <span className="text-xs text-red-400">Rejected</span>
                          </>
                        )}
                      </div>
                    </div>
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
