'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { DollarSign, Users, TrendingUp, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function DashboardTab() {
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalUsers: 0,
    pendingWithdrawals: 0,
    pendingDeposits: 0,
    activeUsers: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      console.log('Loading dashboard data...');
      // Load all data
      const [usersResult, depositsResult, withdrawalsResult] = await Promise.all([
        api.getUsers(),
        api.getDeposits(),
        api.getWithdrawals(),
      ]);

      console.log('Users:', usersResult);
      console.log('Deposits:', depositsResult);
      console.log('Withdrawals:', withdrawalsResult);

      // Calculate stats
      const totalPayments = depositsResult.deposits
        ?.filter((d: any) => d.status === 'confirmed')
        .reduce((sum: number, d: any) => sum + d.amount, 0) || 0;

      const totalUsers = usersResult.users?.length || 0;
      const activeUsers = usersResult.users?.filter((u: any) => u.status === 'active').length || 0;
      const pendingWithdrawals = withdrawalsResult.withdrawals?.filter((w: any) => w.status === 'pending').length || 0;
      const pendingDeposits = depositsResult.deposits?.filter((d: any) => d.status === 'pending').length || 0;

      console.log('Stats:', { totalPayments, totalUsers, pendingWithdrawals, pendingDeposits });

      setStats({
        totalPayments,
        totalUsers,
        pendingWithdrawals,
        pendingDeposits,
        activeUsers,
      });

      // Combine recent activity
      const deposits = depositsResult.deposits?.map((d: any) => ({ ...d, type: 'deposit' })) || [];
      const withdrawals = withdrawalsResult.withdrawals?.map((w: any) => ({ ...w, type: 'withdrawal' })) || [];
      const combined = [...deposits, ...withdrawals]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      
      console.log('Recent activity:', combined);
      setRecentActivity(combined);
    } catch (error) {
      console.error('Load dashboard data error:', error);
    }
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

      {/* Recent Activity */}
      <div
        className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6"
        style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
      >
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={`${activity.type}-${activity.id}`} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  activity.type === 'deposit' ? 'bg-green-500/20' : 'bg-orange-500/20'
                }`}>
                  {activity.type === 'deposit' ? (
                    <ArrowDownLeft className="w-5 h-5 text-green-400" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-orange-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{activity.userName}</p>
                  <p className="text-xs text-gray-400 capitalize">{activity.type} Request</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-white">${activity.amount.toFixed(2)}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activity.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  (activity.status === 'confirmed' || activity.status === 'approved') ? 'bg-green-500/20 text-green-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {activity.status}
                </span>
              </div>
            </div>
          ))}
          {recentActivity.length === 0 && (
            <p className="text-center text-gray-500 py-8 text-sm">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}
