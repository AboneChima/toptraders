'use client';

import { useState } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/store/adminStore';

type MarketTab = 'USDT' | 'Web3' | 'NFT';

interface MarketPair {
  symbol: string;
  name: string;
  price: string;
  change: number;
  icon: string;
}

export default function MarketSection() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<MarketTab>('USDT');
  const currencyPairs = useAdminStore((state) => state.currencyPairs);

  // Directly compute from store - no local state needed
  const marketData = React.useMemo(() => {
    const activePairs = currencyPairs.filter(p => p.status);
    
    const categorized: Record<MarketTab, MarketPair[]> = {
      USDT: [],
      Web3: [],
      NFT: [],
    };

    activePairs.forEach(pair => {
      const marketPair: MarketPair = {
        symbol: pair.name,
        name: pair.name.split('/')[0],
        price: pair.price ? `$${pair.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}` : '$0.00',
        change: pair.change || 0,
        icon: pair.icon,
      };

      categorized[pair.category].push(marketPair);
    });

    return categorized;
  }, [currencyPairs]);

  return (
    <section className="px-4 py-4">
      {/* Tabs - Centered */}
      <div className="flex justify-center gap-3 mb-6">
        {(['USDT', 'Web3', 'NFT'] as MarketTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-2 rounded-full font-medium transition-all text-sm ${
              activeTab === tab
                ? 'bg-blue-900 text-blue-400'
                : 'bg-transparent text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Market Pairs */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-2"
        >
          {marketData[activeTab].map((pair, index) => (
            <motion.div
              key={pair.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => router.push('/trade')}
              className="flex items-center justify-between py-3 hover:bg-gray-900/30 transition-colors cursor-pointer rounded-lg px-2"
            >
              <div className="flex items-center gap-3">
                {/* Icon */}
                <Image
                  src={`/coins/${pair.icon}.png`}
                  alt={pair.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                
                {/* Pair Info */}
                <div>
                  <div className="text-white font-semibold text-base">{pair.symbol}</div>
                  <div className="text-gray-500 text-sm">{pair.name}</div>
                </div>
              </div>

              {/* Price Info */}
              <div className="text-right">
                <div className="text-white font-semibold text-base">{pair.price}</div>
                <div className={`text-sm flex items-center gap-1 justify-end ${
                  pair.change >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {pair.change < 0 ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : (
                    <TrendingUp className="w-3 h-3" />
                  )}
                  <span>{pair.change >= 0 ? '+' : ''}{pair.change.toFixed(3)}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
