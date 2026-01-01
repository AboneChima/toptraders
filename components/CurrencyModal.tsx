'use client';

import { useState } from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import Image from 'next/image';
import { useAdminStore } from '@/store/adminStore';
import CoinAvatar from './CoinAvatar';

interface Currency {
  symbol: string;
  name: string;
  pair: string;
  price: number;
  change: number;
  icon: string;
}

interface CurrencyModalProps {
  onClose: () => void;
  onSelect: (pair: string, price: number, change: number) => void;
}

export default function CurrencyModal({ onClose, onSelect }: CurrencyModalProps) {
  const [activeTab, setActiveTab] = useState<'USDT' | 'Web3' | 'NFT'>('USDT');
  const currencyPairs = useAdminStore((state) => state.currencyPairs);
  
  // Directly compute from store - no local state needed
  const currencyData = React.useMemo(() => {
    const activePairs = currencyPairs.filter(p => p.status);
    
    const categorized: Record<string, Currency[]> = {
      USDT: [],
      Web3: [],
      NFT: [],
    };

    activePairs.forEach(pair => {
      const symbol = pair.name.split('/')[0];
      const currency: Currency = {
        symbol: pair.name,
        name: symbol,
        pair: pair.name,
        price: pair.price || 0,
        change: pair.change || 0,
        icon: pair.icon,
      };

      categorized[pair.category].push(currency);
    });

    return categorized;
  }, [currencyPairs]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-full bg-gray-900 rounded-t-3xl max-h-[75vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 flex-shrink-0">
          <h2 className="text-xl font-semibold text-white">Subscribe Currency</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 px-6 py-4 border-b border-gray-800 flex-shrink-0">
          {(['USDT', 'Web3', 'NFT'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Currency List */}
        <div className="overflow-y-auto flex-1 px-6 pb-6">
          {currencyData[activeTab].map((currency) => (
            <button
              key={currency.symbol}
              onClick={() => onSelect(currency.pair, currency.price, currency.change)}
              className="w-full flex items-center justify-between py-4 border-b border-gray-800 hover:bg-gray-800 transition-colors rounded-lg px-2"
            >
              <div className="flex items-center gap-3">
                <CoinAvatar icon={currency.icon} name={currency.name} size={40} />
                <div className="text-left">
                  <div className="font-semibold text-white text-base">{currency.pair}</div>
                  <div className="text-sm text-gray-400">{currency.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-white text-base">
                  ${typeof currency.price === 'number' ? currency.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 }) : '0.00'}
                </div>
                <div className={`text-sm flex items-center gap-1 justify-end ${
                  currency.change >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {currency.change >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {currency.change >= 0 ? '+' : ''}{(currency.change || 0).toFixed(3)}%
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
