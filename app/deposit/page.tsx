'use client';

import { useState } from 'react';
import { ArrowLeft, Menu, Copy, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useAdminStore } from '@/store/adminStore';
import SideMenu from '@/components/SideMenu';
import ProtectedRoute from '@/components/ProtectedRoute';

const DEPOSIT_ADDRESSES = {
  'USDT (TRC20)': 'TJxZA88VxvCyfe4JDcbXXEVYrsRWPMxWUN',
  'BTC': 'bc1qkgashfw03tczfy75m0d7u5qusg3e4g0pel2fpl',
  'BNB': '0x3D867C10B445670A1FDF4FdFC7e9eA083ed2F99d',
  'USDT (ERC20)': '0x3D867C10B445670A1FDF4FdFC7e9eA083ed2F99d',
  'ETH': '0x3D867C10B445670A1FDF4FdFC7e9eA083ed2F99d',
};

export default function DepositPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const addDeposit = useAdminStore((state) => state.addDeposit);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [copiedCoin, setCopiedCoin] = useState<string | null>(null);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const [amount, setAmount] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleCopyAddress = (address: string, coin: string) => {
    navigator.clipboard.writeText(address);
    setCopiedCoin(coin);
    setShowCopyFeedback(true);
    setTimeout(() => setShowCopyFeedback(false), 2000);
  };

  const handleSubmitDeposit = async () => {
    if (!user || !selectedCoin || !amount) return;

    const depositAmount = parseFloat(amount);
    if (depositAmount < 10) {
      alert('Minimum deposit is $10');
      return;
    }

    if (copiedCoin !== selectedCoin) {
      alert('Please copy the wallet address before proceeding');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Save to database via API
      const result = await fetch('/api/deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          amount: depositAmount,
          method: selectedCoin,
        }),
      });

      if (!result.ok) {
        throw new Error('Failed to create deposit');
      }

      setIsSubmitting(false);
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      setAmount('');
      setSelectedCoin(null);
      setCopiedCoin(null);
    } catch (error) {
      console.error('Deposit error:', error);
      alert('Failed to submit deposit. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        <div className="sticky top-0 z-20 backdrop-blur-xl bg-black/70 border-b border-white/10">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-base font-semibold text-white">Deposit Funds</h1>
            <button onClick={() => setShowSideMenu(true)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Menu className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3"
          >
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-400 font-medium mb-1">Deposit Instructions</p>
              <p className="text-xs text-gray-400">
                Select a cryptocurrency, copy the wallet address, and send your funds. Your deposit will be confirmed within 1-2 hours.
              </p>
            </div>
          </motion.div>

          {/* Coin Selection */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6"
            style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
          >
            <h2 className="text-lg font-semibold text-white mb-4">Select Cryptocurrency</h2>
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(DEPOSIT_ADDRESSES).map(([coin, address]) => (
                <div key={coin}>
                  <button
                    onClick={() => setSelectedCoin(selectedCoin === coin ? null : coin)}
                    className={`w-full p-4 rounded-xl border transition-all ${
                      selectedCoin === coin
                        ? 'bg-white/10 border-white/30'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{coin}</span>
                      <span className="text-xs text-gray-400">Click to expand</span>
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {selectedCoin === coin && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 p-4 bg-white/5 rounded-xl border border-white/10 space-y-4">
                          <div>
                            <p className="text-xs text-gray-400 mb-2">Wallet Address:</p>
                            <div className="flex items-center gap-2 mb-3">
                              <code className="flex-1 text-xs text-white bg-black/50 p-3 rounded-lg break-all">
                                {address}
                              </code>
                              <button
                                onClick={() => handleCopyAddress(address, coin)}
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                              >
                                {copiedCoin === coin && showCopyFeedback ? (
                                  <Check className="w-4 h-4 text-green-400" />
                                ) : (
                                  <Copy className="w-4 h-4 text-white" />
                                )}
                              </button>
                            </div>
                            {copiedCoin === coin && (
                              <p className="text-xs text-green-400 mb-2">✓ Address copied - You can now enter amount</p>
                            )}
                          </div>

                          {/* Amount Input - Always visible but disabled until copied */}
                          <div>
                            <label className="text-sm text-gray-400 mb-2 block">Enter Deposit Amount (USD)</label>
                            <input
                              type="number"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              placeholder="Enter amount"
                              disabled={copiedCoin !== coin}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-400 mt-2">
                              {copiedCoin === coin ? 'Minimum deposit: $10' : 'Copy the address above to continue'}
                            </p>
                          </div>

                          {copiedCoin === coin && amount && parseFloat(amount) >= 10 && (
                            <button
                              onClick={() => setShowConfirmModal(true)}
                              className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                            >
                              Continue to Confirm
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
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
                <h3 className="text-xl font-bold text-white mb-4">Confirm Deposit</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Cryptocurrency:</span>
                    <span className="text-white font-medium">{selectedCoin}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white font-medium">${amount}</span>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mt-4">
                    <p className="text-xs text-yellow-400">
                      Your deposit will be processed and confirmed by our team within 1-2 hours. You'll receive a notification once it's approved.
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
                    onClick={handleSubmitDeposit}
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Confirm Deposit'
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
                <h3 className="text-xl font-bold text-white mb-2">Deposit Request Submitted!</h3>
                <p className="text-sm text-gray-400 mb-6">
                  Your deposit request has been submitted successfully. Our team will review and confirm your deposit within 1-2 hours. You'll be notified once it's processed.
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
