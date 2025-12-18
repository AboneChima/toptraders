'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Share2, Users, DollarSign, Check, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import SideMenu from '@/components/SideMenu';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ReferralPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0, earnings: 0, pending: 0 });
  
  const referralCode = user?.id || 'GUEST';
  const referralLink = `https://toptrades.info/ref/${referralCode}`;

  useEffect(() => {
    const fetchStats = async () => {
      setStats({ total: 0, active: 0, earnings: 0, pending: 0 });
    };
    fetchStats();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join TopTrades',
          text: 'Start trading crypto with me!',
          url: referralLink,
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
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
          <h1 className="text-base font-semibold text-white">Referral</h1>
          <button onClick={() => setShowSideMenu(true)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-6 text-center"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-green-500/40 to-blue-500/40 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <h2 className="text-lg font-bold text-white mb-1">Earn 10% Commission</h2>
            <p className="text-xs text-gray-400">Invite friends and earn from their trades</p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Users, value: stats.total, label: 'Referrals', color: 'from-blue-500/20 to-blue-600/20', iconColor: 'text-blue-400' },
            { icon: Users, value: stats.active, label: 'Active', color: 'from-green-500/20 to-green-600/20', iconColor: 'text-green-400' },
            { icon: DollarSign, value: `$${stats.earnings.toFixed(2)}`, label: 'Earned', color: 'from-yellow-500/20 to-yellow-600/20', iconColor: 'text-yellow-400' },
            { icon: DollarSign, value: `$${stats.pending.toFixed(2)}`, label: 'Pending', color: 'from-orange-500/20 to-orange-600/20', iconColor: 'text-orange-400' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-4"
              style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)' }}
            >
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2`}>
                <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
              </div>
              <p className="text-lg font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Referral Link */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-400 px-1">Your Link</h3>
          <div
            className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-4 space-y-3"
            style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)' }}
          >
            <div className="bg-white/5 rounded-xl p-3">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="w-full bg-transparent text-xs text-gray-300 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 py-2.5 bg-white text-black rounded-xl text-xs font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
              <button
                onClick={handleShare}
                className="flex-1 py-2.5 bg-white/10 text-white rounded-xl text-xs font-medium flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
              >
                <Share2 className="w-3 h-3" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Code */}
        <div
          className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-4 text-center"
          style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)' }}
        >
          <p className="text-xs text-gray-400 mb-1">Referral Code</p>
          <p className="text-base font-bold text-white tracking-wider">{referralCode}</p>
        </div>

        {/* How it Works */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-400 px-1">How It Works</h3>
          <div
            className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-4 space-y-3"
            style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)' }}
          >
            {[
              'Share your link with friends',
              'They sign up and start trading',
              'Earn 10% of their trading fees',
            ].map((step, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  {index + 1}
                </div>
                <p className="text-xs text-gray-300 pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSideMenu && <SideMenu onClose={() => setShowSideMenu(false)} />}
      </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}
