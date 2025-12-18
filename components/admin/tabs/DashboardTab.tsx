'use client';

import { useState, useEffect } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { DollarSign, Users, TrendingUp, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function DashboardTab() {
  const { withdrawals, deposits } = useAdminStore();
  
  const [allUsers, setAllUsers] = useState<Array<{
    id: string;
    name: string;
    email: string;
    balance: number;
    status: 'active' | 'inactive';
    createdAt: string;
  }>>([]);

  useEffect(() => {
    // Load users from API or localStorage
    const loadUsers = async () => {
      try {
        // Try API first
        const result = await api.getUsers();
        if (result.users) {
          setAllUsers(result.users);
          return;
        }
      } catch (error) {
        console.log('API not available, using localStorage');
      }
      
      // Fallback to localStorage
      try {
        const { getAllUsers } = useAuthStore.getState();
        const users = getAllUsers();
        setAllUsers(users);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };

    loadUsers();

    // Reload users every 5 seconds
    const interval = setInterval(loadUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = {
    totalPayments: deposits
      .filter(d => d.status === 'confirmed')
      .reduce((sum, d) => sum + d.amount, 0),
    totalUsers: allUsers.length,
    pendingWithdrawals: withdrawals.filter(w => w.status === 'pending').length,
    pendingDeposits: deposits.filter(d => d.status === 'pending').length,
    activeUsers: allUsers.filter(u => u.status === 'active').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6"
          style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-sm text-gray-400 mb-1">Total Payments</h3>
          <p className="text-2xl font-bold text-white">${stats.totalPayments.toFixed(2)}</p>
        </div>

        <div
          className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6"
          style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <h3 className="text-sm text-gray-400 mb-1">Total Users</h3>
          <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
        </div>

        <div
          className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6"
          style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <h3 className="text-sm text-gray-400 mb-1">Pending Withdrawals</h3>
          <p className="text-2xl font-bold text-white">{stats.pendingWithdrawals}</p>
        </div>

        <div
          className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6"
          style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <ArrowDownLeft className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <h3 className="text-sm text-gray-400 mb-1">Pending Deposits</h3>
          <p className="text-2xl font-bold text-white">{stats.pendingDeposits}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, label: 'Manage Users', color: 'bg-blue-500/20 text-blue-400' },
            { icon: ArrowUpRight, label: 'Withdrawals', color: 'bg-orange-500/20 text-orange-400' },
            { icon: ArrowDownLeft, label: 'Deposits', color: 'bg-green-500/20 text-green-400' },
            { icon: DollarSign, label: 'Currency Pairs', color: 'bg-purple-500/20 text-purple-400' },
          ].map((action) => (
            <div
              key={action.label}
              className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-all cursor-pointer"
              style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
            >
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-3`}>
                <action.icon className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-white">{action.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div
        className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6"
        style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
      >
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {withdrawals.slice(0, 5).map((w) => (
            <div key={w.id} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{w.userName}</p>
                  <p className="text-xs text-gray-400">Withdrawal Request</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-white">${w.amount}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  w.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  w.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {w.status}
                </span>
              </div>
            </div>
          ))}
          {withdrawals.length === 0 && (
            <p className="text-center text-gray-500 py-8 text-sm">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}
