'use client';

import { useState } from 'react';
import { ArrowLeft, Menu, AlertCircle, Loader2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useAdminStore } from '@/store/adminStore';
import SideMenu from '@/components/SideMenu';
import ProtectedRoute from '@/components/ProtectedRoute';

const WITHDRAWAL_CONFIG = {
  minAmount: 500,
  maxAmount: 10000000,
  fixedCharge: 0,
  percentCharge: 0,
};

export default function WithdrawPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const addWithdrawal = useAdminStore((state) => state.addWithdrawal);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [currency, setCurrency] = useState('USDT (TRC20)');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState('');

  const userBalance = user?.balance || 0;

  const handleValidateAndContinue = () => {
    setError('');
    const withdrawAmount = parseFloat(amount);

    if (!amount || !walletAddress) {
      setError('Please fill in all fields');
      return;
    }

    if (withdrawAmount < WITHDRAWAL_CONFIG.minAmount) {
      setError(`Minimum withdrawal amount is $${WITHDRAWAL_CONFIG.minAmount.toLocaleString()}`);
      return;
    }

    if (withdrawAmount > WITHDRAWAL_CONFIG.maxAmount) {
      setError(`Maximum withdrawal amount is $${WITHDRAWAL_CONFIG.maxAmount.toLocaleString()}`);
      return;
    }

    if (withdrawAmount > userBalance) {
      setError(`Insufficient balance. Your available balance is $${userBalance.toFixed(2)}`);
      return;
    }

    setShowConfirmModal(true);
  };

  const handleSubmitWithdrawal = async () => {
    if (!user) return;

    setIsSubmitting(true);
    
    try {
      // Save to database via API
      const result = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          amount: parseFloat(amount),
          walletAddress,
        }),
      });

      if (!result.ok) {
        throw new Error('Failed to create withdrawal');
      }

      setIsSubmitting(false);
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      setAmount('');
      setWalletAddress('');
    } catch (error) {
      console.error('Withdrawal error:', error);
      alert('Failed to submit withdrawal. Please try again.');
      setIsSubmitting(false);
    }
  };

  const finalAmount = parseFloat(amount) || 0;
  const charges = WITHDRAWAL_CONFIG.fixedCharge + (finalAmount * WITHDRAWAL_CONFIG.percentCharge / 100);
  const netAmount = finalAmount - charges;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        <div className="sticky top-0 z-20 backdrop-blur-xl bg-black/70 border-b border-white/10">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-base font-semibold text-white">Withdraw Funds</h1>
            <button onClick={() => setShowSideMenu(true)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Menu className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
          {/* Balance Display */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 p-6"
            style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
          >
            <p className="text-sm text-gray-400 mb-1">Available Balance</p>
            <h2 className="text-3xl font-bold text-white">${userBalance.toFixed(2)}</h2>
          </motion.div>

          {/* Withdrawal Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4"
          >
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-400 font-medium mb-2">Withdrawal Information</p>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Minimum: ${WITHDRAWAL_CONFIG.minAmount.toLocaleString()}</li>
                  <li>• Maximum: ${WITHDRAWAL_CONFIG.maxAmount.toLocaleString()}</li>
                  <li>• Fixed Charge: ${WITHDRAWAL_CONFIG.fixedCharge}</li>
                  <li>• Percent Charge: {WITHDRAWAL_CONFIG.percentCharge}%</li>
                  <li>• Processing Time: 24-48 hours</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Withdrawal Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6"
            style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
          >
            <h2 className="text-lg font-semibold text-white mb-4">Withdrawal Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Cryptocurrency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-white/30"
                  style={{ color: 'white' }}
                >
                  <option value="USDT (TRC20)" style={{ backgroundColor: '#1f2937', color: 'white' }}>USDT (TRC20)</option>
                  <option value="BTC" style={{ backgroundColor: '#1f2937', color: 'white' }}>Bitcoin (BTC)</option>
                  <option value="ETH" style={{ backgroundColor: '#1f2937', color: 'white' }}>Ethereum (ETH)</option>
                  <option value="BNB" style={{ backgroundColor: '#1f2937', color: 'white' }}>Binance Coin (BNB)</option>
                  <option value="USDT (ERC20)" style={{ backgroundColor: '#1f2937', color: 'white' }}>USDT (ERC20)</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Wallet Address</label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter your wallet address"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Amount (USD)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-white/30"
                />
              </div>

              {/* Amount Breakdown */}
              {amount && parseFloat(amount) > 0 && (
                <div className="bg-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Withdrawal Amount:</span>
                    <span className="text-white">${finalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Charges:</span>
                    <span className="text-white">${charges.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between">
                    <span className="text-white font-semibold">You'll Receive:</span>
                    <span className="text-white font-semibold">${netAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <button
                onClick={handleValidateAndContinue}
                className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Continue to Confirm
              </button>
            </div>
          </motion.div>
        </div>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">Confirm Withdrawal</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Cryptocurrency:</span>
                    <span className="text-white font-medium">{currency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Wallet Address:</span>
                    <span className="text-white font-medium text-xs break-all">{walletAddress}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white font-medium">${finalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Charges:</span>
                    <span className="text-white font-medium">${charges.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between">
                    <span className="text-white font-semibold">Net Amount:</span>
                    <span className="text-white font-semibold">${netAmount.toFixed(2)}</span>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mt-4">
                    <p className="text-xs text-yellow-400">
                      Your withdrawal will be processed by our team within 24-48 hours. You'll receive a notification once it's approved and sent to your wallet.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitWithdrawal}
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Confirm Withdrawal'
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccessModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-6 text-center"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Withdrawal Request Submitted!</h3>
                <p className="text-sm text-gray-400 mb-6">
                  Your withdrawal request has been submitted successfully. Our team will review and process your request within 24-48 hours. You'll be notified once the funds are sent to your wallet.
                </p>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    router.push('/');
                  }}
                  className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Back to Home
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSideMenu && <SideMenu onClose={() => setShowSideMenu(false)} />}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}
