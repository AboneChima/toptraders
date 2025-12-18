'use client';

import { useState } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { 
  LayoutDashboard, Users, DollarSign, TrendingUp, ArrowUpRight, 
  ArrowDownLeft, Settings, LogOut, Menu, X 
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import tab components
import DashboardTab from './tabs/DashboardTab';
import UsersTab from './tabs/UsersTab';
import WithdrawalsTab from './tabs/WithdrawalsTab';
import DepositsTab from './tabs/DepositsTab';
import CurrencyTab from './tabs/CurrencyTab';
import TradesTab from './tabs/TradesTab';
import SettingsTab from './tabs/SettingsTab';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const logout = useAdminStore((state) => state.logout);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Manage Users', icon: Users },
    { id: 'withdrawals', label: 'Withdrawals', icon: ArrowUpRight },
    { id: 'deposits', label: 'Deposits', icon: ArrowDownLeft },
    { id: 'currency', label: 'Currency Pairs', icon: DollarSign },
    { id: 'trades', label: 'All Trades', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: 0 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        className="w-70 bg-gradient-to-b from-gray-900 to-black border-r border-white/10 flex-shrink-0 overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">TopTrades</h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white text-black' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all mt-8"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </nav>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 backdrop-blur-xl bg-black/70 border-b border-white/10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
              </button>
              <h2 className="text-xl font-bold text-white">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Administrator</span>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <main className="p-6">
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'withdrawals' && <WithdrawalsTab />}
          {activeTab === 'deposits' && <DepositsTab />}
          {activeTab === 'currency' && <CurrencyTab />}
          {activeTab === 'trades' && <TradesTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}
