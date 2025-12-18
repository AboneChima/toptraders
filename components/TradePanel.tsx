'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Check, X, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface Trade {
  id: string;
  pair: string;
  amount: number;
  entry: number;
  direction: 'up' | 'down';
  profit: number;
  status: 'active' | 'completed' | 'failed';
  time: string;
}

export default function TradePanel() {
  const [amount, setAmount] = useState('');
  const [leverage, setLeverage] = useState('1/2');
  const [duration, setDuration] = useState('15s');
  const [trades, setTrades] = useState<Trade[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info'>('info');

  const { user, updateUserBalance } = useAuthStore();
  const [userBalance, setUserBalance] = useState(user?.balance || 0);

  useEffect(() => {
    if (user) {
      loadTrades();
      loadBalance();
      const interval = setInterval(loadBalance, 3000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadBalance = async () => {
    if (!user) return;
    try {
      const result = await api.getUsers();
      if (result.users) {
        const currentUser = result.users.find((u: any) => u.id.toString() === user.id.toString());
        if (currentUser) {
          setUserBalance(currentUser.balance);
          updateUserBalance(user.id, currentUser.balance);
        }
      }
    } catch (error) {
      console.error('Load balance error:', error);
    }
  };

  const loadTrades = async () => {
    try {
      const result = await api.getTrades();
      if (result.trades) {
        const userTrades = result.trades
          .filter((t: any) => t.userId === user?.id)
          .slice(0, 10)
          .map((t: any) => ({
            id: t.id,
            pair: t.currencyPair,
            amount: t.amount,
            entry: t.entryPrice,
            direction: t.type as 'up' | 'down',
            profit: t.profitLoss,
            status: t.status === 'open' ? 'active' : t.status === 'closed' ? (t.profitLoss > 0 ? 'completed' : 'failed') : 'active',
            time: new Date(t.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          }));
        setTrades(userTrades);
      }
    } catch (error) {
      console.error('Load trades error:', error);
    }
  };

  const showMessage = (message: string, type: 'success' | 'error' | 'info') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const getDurationInMs = (dur: string): number => {
    const value = parseInt(dur);
    if (dur.includes('s')) return value * 1000;
    if (dur.includes('m')) return value * 60 * 1000;
    return 15000;
  };

  const calculateTradeOutcome = (): { won: boolean; profit: number } => {
    const random = Math.random();
    const won = random < 0.45;
    
    let multiplier = 0.2;
    if (leverage === 'X2') multiplier = 0.4;
    if (leverage === 'Max') multiplier = 0.8;
    
    const tradeAmount = parseFloat(amount);
    const profit = won ? tradeAmount * multiplier : -tradeAmount;
    
    return { won, profit };
  };

  const handleTrade = async (direction: 'up' | 'down') => {
    const tradeAmount = parseFloat(amount);
    
    if (!amount || tradeAmount < 10) {
      showMessage('Minimum order amount is $10', 'error');
      return;
    }

    if (tradeAmount > userBalance) {
      showMessage(`Insufficient balance. Available: $${userBalance.toFixed(2)}`, 'error');
      return;
    }

    if (!user) {
      showMessage('Please login to trade', 'error');
      return;
    }

    updateUserBalance(user.id, userBalance - tradeAmount);

    const entryPrice = 89446.0 + (Math.random() * 100 - 50);
    
    try {
      const result = await api.createTrade({
        userId: user.id,
        currencyPair: 'BTC/USDT',
        type: direction,
        amount: tradeAmount,
        entryPrice,
      });

      if (!result.trade) {
        throw new Error('Failed to create trade');
      }

      const newTrade: Trade = {
        id: result.trade.id,
        pair: 'BTC/USDT',
        amount: tradeAmount,
        entry: entryPrice,
        direction,
        profit: 0,
        status: 'active',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };

      setTrades(prev => [newTrade, ...prev]);
      setAmount('');
      showMessage(`Trade placed: ${direction.toUpperCase()} $${tradeAmount}`, 'info');

      const durationMs = getDurationInMs(duration);
      setTimeout(async () => {
        const { won, profit } = calculateTradeOutcome();
        
        await api.updateTrade(result.trade.id, {
          status: 'closed',
          profitLoss: profit,
          currentPrice: entryPrice + (won ? 100 : -100),
        });

        setTrades(prev => prev.map(t => 
          t.id === result.trade.id 
            ? { ...t, status: won ? 'completed' : 'failed', profit }
            : t
        ));

        if (won) {
          const newBalance = userBalance - tradeAmount + tradeAmount + profit;
          updateUserBalance(user.id, newBalance);
          showMessage(`Trade Won! +$${profit.toFixed(2)}`, 'success');
        } else {
          showMessage(`Trade Lost: $${Math.abs(profit).toFixed(2)}`, 'error');
        }
      }, durationMs);
    } catch (error) {
      console.error('Trade error:', error);
      showMessage('Failed to place trade', 'error');
      updateUserBalance(user.id, userBalance);
    }
  };

  const leverageOptions = ['1/2', 'X2', 'Max'];
  const durationOptions = ['15s', '30s', '1m', '5m'];

  return (
    <div className="bg-gray-900 rounded-t-3xl px-5 py-5 space-y-4">
      <h2 className="text-lg font-semibold text-white">Trade</h2>

      <div className="flex items-center gap-3 bg-gray-800 rounded-xl px-3 py-2.5">
        <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold">$</span>
        </div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1 bg-transparent text-white text-lg outline-none placeholder-gray-500"
          placeholder="0"
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">Available <span className="text-white">${userBalance.toFixed(2)}</span></span>
        <span className="text-gray-400">Minimum <span className="text-white">$10</span></span>
      </div>

      <div className="flex gap-2">
        {leverageOptions.map((option) => (
          <button
            key={option}
            onClick={() => setLeverage(option)}
            className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
              leverage === option ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {durationOptions.map((option) => (
          <button
            key={option}
            onClick={() => setDuration(option)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              duration === option ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`px-4 py-2 rounded-lg text-sm text-center flex items-center justify-center gap-2 ${
              notificationType === 'success' ? 'bg-green-600 text-white' :
              notificationType === 'error' ? 'bg-red-600 text-white' :
              'bg-blue-600 text-white'
            }`}
          >
            {notificationType === 'success' && <Check className="w-4 h-4" />}
            {notificationType === 'error' && <X className="w-4 h-4" />}
            {notificationMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3 pt-1">
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
          <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'skewX(10deg)' }}>
            <span className="text-white font-bold">
              {leverage === '1/2' ? '20%' : leverage === 'X2' ? '40%' : '80%'} Down
            </span>
          </div>
        </motion.button>

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
          <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'skewX(10deg)' }}>
            <span className="text-white font-bold">
              Up {leverage === '1/2' ? '20%' : leverage === 'X2' ? '40%' : '80%'}
            </span>
          </div>
        </motion.button>
      </div>

      <div className="pt-3 border-t border-gray-800">
        <div className="grid grid-cols-6 gap-2 text-xs text-gray-400 pb-2 font-medium">
          <span>Pair</span>
          <span>Amount</span>
          <span>Entry</span>
          <span>P/L</span>
          <span>Status</span>
          <span>Time</span>
        </div>
        {trades.length === 0 ? (
          <div className="text-center text-gray-500 text-xs py-4">No trading records</div>
        ) : (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {trades.map((trade) => (
              <div key={trade.id} className="grid grid-cols-6 gap-2 text-xs text-white py-2 border-b border-gray-800">
                <span className="truncate">{trade.pair}</span>
                <span className="truncate">${trade.amount}</span>
                <span className="truncate">${trade.entry.toFixed(0)}</span>
                <span className={`truncate font-semibold ${
                  trade.status === 'active' ? 'text-gray-400' :
                  trade.profit >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {trade.status === 'active' ? (
                    <Loader2 className="w-3 h-3 animate-spin inline" />
                  ) : (
                    `${trade.profit >= 0 ? '+' : ''}$${trade.profit.toFixed(0)}`
                  )}
                </span>
                <span className="truncate">
                  {trade.status === 'active' && <span className="text-yellow-400">Active</span>}
                  {trade.status === 'completed' && <Check className="w-3 h-3 text-green-400 inline" />}
                  {trade.status === 'failed' && <X className="w-3 h-3 text-red-400 inline" />}
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
