'use client';

import { useState } from 'react';
import { ArrowLeft, Menu, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useAdminStore } from '@/store/adminStore';
import SideMenu from '@/components/SideMenu';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function WithdrawPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addWithdrawal } = useAdminStore();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USDT');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleWithdraw = () => {
    if (!user) {
      alert('Please login first');
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount < 10) {
      alert('Minimum withdrawal is $10');
      return;
    }

    addWithdrawal({
      userId: user.id,
      userName: user.name,
      amount: withdrawAmount,
      currency,
    });

    setShowSuccess(true);
    setAmount('');
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-black/70 border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-base font-semibold text-white">Withdraw</h1>
          <button onClick={() => setShowSideMenu(true)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6"
          style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
        >
          <h2 className="text-lg font-semibold text-white mb-4">Withdrawal Request</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-white/30"
              >
                <option value="USDT">USDT</option>
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
              </select>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-500 font-medium mb-1">Processing Time</p>
                <p className="text-xs text-gray-400">
                  Withdrawals typically take 24-48 hours for confirmation by our team. You&apos;ll be notified once processed.
                </p>
              </div>
            </div>

            <button
              onClick={handleWithdraw}
              className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Submit Withdrawal Request
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl backdrop-blur-xl bg-green-500/10 border border-green-500/20 p-4"
            >
              <p className="text-green-400 text-sm font-medium">
                Withdrawal request submitted successfully! Our team will process it within 24-48 hours.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showSideMenu && <SideMenu onClose={() => setShowSideMenu(false)} />}
      </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}
