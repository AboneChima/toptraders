'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useAdminStore } from '@/store/adminStore';

interface Trade {
  id: string;
  pair: string;
  amount: number;
  entry: number;
  direction: 'up' | 'down';
  yield: number;
  time: string;
}

export default function TradePanel() {
  const [amount, setAmount] = useState('');
  const [leverage, setLeverage] = useState('1/2');
  const [duration, setDuration] = useState('15s');
  const [trades, setTrades] = useState<Trade[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const { user } = useAuthStore();
  const { addTrade } = useAdminStore();

  const handleTrade = (direction: 'up' | 'down') => {
    const tradeAmount = parseFloat(amount);
    
    if (!amount || tradeAmount < 500) {
      setNotificationMessage('Minimum order amount is 500 USDT');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    if (tradeAmount > 0 && user) {
      const newTrade: Trade = {
        id: Date.now().toString(),
        pair: 'BTC/USDT',
        amount: tradeAmount,
        entry: 89446.0,
        direction,
        yield: 0,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };

      setTrades(prev => [newTrade, ...prev]);
      
      // Save to admin store
      addTrade({
        userId: user.id,
        userName: user.name,
        pair: 'BTC/USDT',
        type: direction,
        amount: tradeAmount,
        profit: 0,
      });
      
      setAmount('');
      setNotificationMessage(`Trade placed: ${direction.toUpperCase()} ${tradeAmount} USDT`);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const leverageOptions = ['1/2', 'X2', 'Max'];
  const durationOptions = ['15s', '30s', '1m', '5m'];

  return (
    <div className="bg-gray-900 rounded-t-3xl px-5 py-5 space-y-4">
      {/* Trade Header */}
      <h2 className="text-lg font-semibold text-white">Trade</h2>

      {/* Amount Input */}
      <div className="flex items-center gap-3 bg-gray-800 rounded-xl px-3 py-2.5">
        <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold">T</span>
        </div>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1 bg-transparent text-white text-lg outline-none placeholder-gray-500"
          placeholder="0"
        />
      </div>

      {/* Balance Info - Compact */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">Available <span className="text-white">0 USDT</span></span>
        <span className="text-gray-400">Minimum order amount <span className="text-white">500 USDT</span></span>
      </div>

      {/* Leverage Options - Compact */}
      <div className="flex gap-2">
        {leverageOptions.map((option) => (
          <button
            key={option}
            onClick={() => setLeverage(option)}
            className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
              leverage === option
                ? 'bg-gray-700 text-white'
                : 'bg-gray-800 text-gray-400'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Duration Selector - Compact */}
      <div className="flex items-center gap-2">
        {durationOptions.map((option) => (
          <button
            key={option}
            onClick={() => setDuration(option)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              duration === option
                ? 'bg-gray-700 text-white'
                : 'bg-gray-800 text-gray-400'
            }`}
          >
            {option}
          </button>
        ))}
        <button className="ml-auto p-2 rounded-lg bg-gray-800">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Notification */}
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm text-center"
        >
          {notificationMessage}
        </motion.div>
      )}

      {/* Trade Buttons - Parallelogram/Skewed Shape */}
      <div className="flex gap-3 pt-1">
        {/* Down Button - Skewed */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => handleTrade('down')}
          className="flex-1 relative overflow-hidden h-12"
          style={{
            background: 'linear-gradient(90deg, #EF4444 0%, #DC2626 100%)',
            transform: 'skewX(-10deg)',
            borderRadius: '8px',
          }}
        >
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: 'skewX(10deg)' }}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white rotate-180" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" fill="white" fillOpacity="0.3"/>
                <path d="M10 3v14m0 0l-4-4m4 4l4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              <span className="text-white font-bold">20% Down</span>
            </div>
          </div>
        </motion.button>

        {/* Up Button - Skewed */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => handleTrade('up')}
          className="flex-1 relative overflow-hidden h-12"
          style={{
            background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
            transform: 'skewX(-10deg)',
            borderRadius: '8px',
          }}
        >
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: 'skewX(10deg)' }}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" fill="white" fillOpacity="0.3"/>
                <path d="M10 17V3m0 0l-4 4m4-4l4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              <span className="text-white font-bold">Up 20%</span>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Trade History Table - Compact */}
      <div className="pt-3 border-t border-gray-800">
        <div className="grid grid-cols-5 gap-2 text-xs text-gray-400 pb-2 font-medium">
          <span>Pair</span>
          <span>Amount</span>
          <span>Entry</span>
          <span>Yield</span>
          <span>Time</span>
        </div>
        {trades.length === 0 ? (
          <div className="text-center text-gray-500 text-xs py-4">
            No trading records
          </div>
        ) : (
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {trades.map((trade) => (
              <div key={trade.id} className="grid grid-cols-5 gap-2 text-xs text-white py-2 border-b border-gray-800">
                <span className="truncate">{trade.pair}</span>
                <span className="truncate">{trade.amount}</span>
                <span className="truncate">{trade.entry.toFixed(2)}</span>
                <span className={`truncate ${trade.yield >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {trade.yield >= 0 ? '+' : ''}{trade.yield.toFixed(2)}%
                </span>
                <span className="truncate">{trade.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
