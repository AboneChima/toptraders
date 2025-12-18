'use client';

import { useEffect, useRef } from 'react';
import { useAdminStore } from '@/store/adminStore';

// Global flag to prevent multiple initializations
let isInitialized = false;

export default function StoreInitializer() {
  const currencyPairs = useAdminStore((state) => state.currencyPairs);
  const addCurrencyPair = useAdminStore((state) => state.addCurrencyPair);
  const removeDuplicatePairs = useAdminStore((state) => state.removeDuplicatePairs);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // First, remove any existing duplicates
    if (currencyPairs.length > 0) {
      removeDuplicatePairs();
    }

    // Prevent multiple initializations using both global flag and ref
    if (hasInitialized.current || isInitialized) {
      return;
    }

    // Only initialize if there are no currency pairs
    if (currencyPairs.length === 0) {
      hasInitialized.current = true;
      isInitialized = true;

      const defaultPairs = [
        { name: 'BTC/USDT', status: true, category: 'USDT' as const, price: 0, change: 0, icon: 'bitcoin' },
        { name: 'ETH/USDT', status: true, category: 'USDT' as const, price: 0, change: 0, icon: 'eth' },
        { name: 'XRP/USDT', status: true, category: 'USDT' as const, price: 0, change: 0, icon: 'xrp' },
        { name: 'DOGE/USDT', status: true, category: 'USDT' as const, price: 0, change: 0, icon: 'doge' },
        { name: 'ADA/USDT', status: true, category: 'USDT' as const, price: 0, change: 0, icon: 'ada' },
        { name: 'BCH/USDT', status: true, category: 'USDT' as const, price: 0, change: 0, icon: 'bch' },
        { name: 'AXS/USDT', status: true, category: 'Web3' as const, price: 0, change: 0, icon: 'axs' },
        { name: 'ALICE/USDT', status: true, category: 'Web3' as const, price: 0, change: 0, icon: 'alice' },
        { name: 'SAND/USDT', status: true, category: 'Web3' as const, price: 0, change: 0, icon: 'sand' },
        { name: 'MANA/USDT', status: true, category: 'Web3' as const, price: 0, change: 0, icon: 'mana' },
        { name: 'ENJ/USDT', status: true, category: 'Web3' as const, price: 0, change: 0, icon: 'enj' },
        { name: 'YGG/USDT', status: true, category: 'Web3' as const, price: 0, change: 0, icon: 'ygg' },
        { name: 'APE/USDT', status: true, category: 'NFT' as const, price: 0, change: 0, icon: 'ape' },
        { name: 'GMT/USDT', status: true, category: 'NFT' as const, price: 0, change: 0, icon: 'gmt' },
        { name: 'IMX/USDT', status: true, category: 'NFT' as const, price: 0, change: 0, icon: 'imx' },
        { name: 'CHR/USDT', status: true, category: 'NFT' as const, price: 0, change: 0, icon: 'chr' },
        { name: 'OGN/USDT', status: true, category: 'NFT' as const, price: 0, change: 0, icon: 'ogn' },
        { name: 'CHZ/USDT', status: true, category: 'NFT' as const, price: 0, change: 0, icon: 'chz' },
      ];

      defaultPairs.forEach(pair => addCurrencyPair(pair));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return null;
}
