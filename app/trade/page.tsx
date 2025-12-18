'use client';

import { useState } from 'react';
import { ArrowLeft, ChevronDown, Bell, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import TradingChart from '@/components/TradingChart';
import TradePanel from '@/components/TradePanel';
import CurrencyModal from '@/components/CurrencyModal';
import SideMenu from '@/components/SideMenu';
import TimeframeSelector from '@/components/TimeframeSelector';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function TradePage() {
  const router = useRouter();
  const [selectedPair, setSelectedPair] = useState('BTC/USDT');
  const [selectedPrice, setSelectedPrice] = useState(89449.39);
  const [priceChange, setPriceChange] = useState(1.465);
  const [timeframe, setTimeframe] = useState('1m');
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <button onClick={() => router.back()} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">High Low</h1>
        <button onClick={() => setShowSideMenu(true)} className="p-2">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Trading Pair Selector with Timeframe and Bell */}
      <div className="px-4 py-3 border-b border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setShowCurrencyModal(true)}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">₿</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">{selectedPair}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </button>
          
          <div className="flex items-center gap-2">
            <TimeframeSelector 
              value={timeframe} 
              onChange={setTimeframe}
            />
            <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
              <Bell className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-red-500">
            {selectedPrice.toLocaleString()}
          </span>
          <span className="text-sm text-red-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {priceChange}%
          </span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="relative">
        <TradingChart />
      </div>

      {/* Trade Panel */}
      <TradePanel />

      {/* Currency Modal */}
      <AnimatePresence>
        {showCurrencyModal && (
          <CurrencyModal
            onClose={() => setShowCurrencyModal(false)}
            onSelect={(pair, price, change) => {
              setSelectedPair(pair);
              setSelectedPrice(price);
              setPriceChange(change);
              setShowCurrencyModal(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Side Menu */}
      <AnimatePresence>
        {showSideMenu && (
          <SideMenu onClose={() => setShowSideMenu(false)} />
        )}
      </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}
