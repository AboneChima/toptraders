'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Lock, Unlock, DollarSign, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import SideMenu from '@/components/SideMenu';
import ProtectedRoute from '@/components/ProtectedRoute';

interface StakingPool {
  id: string;
  symbol: string;
  name: string;
  apy: number;
  minStake: number;
  lockPeriod: string;
  totalStaked: string;
  icon: string;
  risk: 'low' | 'medium' | 'high';
}

export default function StakingPage() {
  const router = useRouter();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'available' | 'staked'>('available');
  const [totalStaked, setTotalStaked] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const stakingPools: StakingPool[] = [
    { id: '1', symbol: 'BTC', name: 'Bitcoin', apy: 5.2, minStake: 0.001, lockPeriod: '30 days', totalStaked: '$2.5B', icon: 'bitcoin', risk: 'low' },
    { id: '2', symbol: 'ETH', name: 'Ethereum', apy: 7.8, minStake: 0.1, lockPeriod: '60 days', totalStaked: '$1.8B', icon: 'eth', risk: 'low' },
    { id: '3', symbol: 'USDT', name: 'Tether', apy: 12.5, minStake: 100, lockPeriod: '90 days', totalStaked: '$850M', icon: 'usdt_tether-removebg-preview', risk: 'medium' },
    { id: '4', symbol: 'BNB', name: 'BNB', apy: 15.3, minStake: 0.5, lockPeriod: '120 days', totalStaked: '$420M', icon: 'bch', risk: 'medium' },
  ];

  useEffect(() => {
    const fetchStakingData = async () => {
      setTotalStaked(0);
      setTotalEarnings(0);
    };
    fetchStakingData();
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
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
          <h1 className="text-base font-semibold text-white">Staking</h1>
          <button onClick={() => setShowSideMenu(true)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto">
        {/* Stats Card */}
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
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-500/30 to-blue-500/30 rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <p className="text-xs font-medium text-gray-400 mb-1">Total Staked Value</p>
            <h2 className="text-3xl font-bold text-white mb-4">${totalStaked.toFixed(2)}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Total Earnings</p>
                <p className="text-lg font-semibold text-green-400">+${totalEarnings.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Active Stakes</p>
                <p className="text-lg font-semibold text-white">0</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2">
          {['available', 'staked'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'available' | 'staked')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-white text-black shadow-lg'
                  : 'bg-white/5 text-gray-400 border border-white/10'
              }`}
            >
              {tab === 'available' ? 'Available Pools' : 'My Stakes'}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'available' ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 px-1">Staking Pools</h3>
            {stakingPools.map((pool, index) => (
              <motion.div
                key={pool.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-4"
                style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src={`/coins/${pool.icon}.png`}
                      alt={pool.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-white">{pool.symbol}</h4>
                      <p className="text-xs text-gray-400">{pool.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">{pool.apy}%</div>
                    <div className="text-xs text-gray-400">APY</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="bg-white/5 rounded-lg p-2">
                    <div className="flex items-center gap-1 mb-1">
                      <Lock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">Lock</span>
                    </div>
                    <p className="text-xs font-medium text-white">{pool.lockPeriod}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2">
                    <div className="flex items-center gap-1 mb-1">
                      <DollarSign className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">Min</span>
                    </div>
                    <p className="text-xs font-medium text-white">{pool.minStake} {pool.symbol}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2">
                    <div className="flex items-center gap-1 mb-1">
                      <TrendingUp className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">Risk</span>
                    </div>
                    <p className={`text-xs font-medium capitalize ${getRiskColor(pool.risk)}`}>{pool.risk}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Total Staked: {pool.totalStaked}</span>
                  <button className="px-4 py-2 bg-white text-black text-xs font-medium rounded-full hover:bg-gray-200 transition-colors">
                    Stake Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div
            className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 text-center"
            style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)' }}
          >
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center">
              <Unlock className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-sm font-medium text-gray-300 mb-1">No Active Stakes</p>
            <p className="text-xs text-gray-500 mb-4">Start staking to earn passive income</p>
            <button
              onClick={() => setActiveTab('available')}
              className="px-4 py-2 bg-white text-black text-xs font-medium rounded-full hover:bg-gray-200 transition-colors"
            >
              Browse Pools
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showSideMenu && <SideMenu onClose={() => setShowSideMenu(false)} />}
      </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}
