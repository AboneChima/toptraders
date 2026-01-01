'use client';

import { useEffect, useRef } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { api } from '@/lib/api';

// Global flag to prevent multiple initializations
let isInitialized = false;

export default function StoreInitializer() {
  const currencyPairs = useAdminStore((state) => state.currencyPairs);
  const addCurrencyPair = useAdminStore((state) => state.addCurrencyPair);
  const removeDuplicatePairs = useAdminStore((state) => state.removeDuplicatePairs);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations using both global flag and ref
    if (hasInitialized.current || isInitialized) {
      return;
    }

    hasInitialized.current = true;
    isInitialized = true;

    // Load currency pairs from database
    const loadCurrencyPairs = async () => {
      try {
        const result = await api.getCurrencyPairs();
        if (result.pairs && result.pairs.length > 0) {
          // Clear existing pairs first
          const store = useAdminStore.getState();
          store.currencyPairs.forEach(pair => {
            if (pair.id) {
              store.deleteCurrencyPair(pair.id);
            }
          });

          // Load from database
          result.pairs.forEach((pair: any) => {
            addCurrencyPair({
              name: pair.name,
              category: pair.category,
              price: pair.price,
              change: pair.change,
              icon: pair.icon,
              status: pair.status
            });
          });
        } else {
          // If no pairs in database, create defaults
          await initializeDefaultPairs();
        }
      } catch (error) {
        console.error('Failed to load currency pairs:', error);
        // Fallback to defaults if API fails
        if (currencyPairs.length === 0) {
          await initializeDefaultPairs();
        }
      }
    };

    const initializeDefaultPairs = async () => {
      const defaultPairs = [
        { name: 'BTC/USDT', status: true, category: 'USDT', icon: 'bitcoin' },
        { name: 'ETH/USDT', status: true, category: 'USDT', icon: 'eth' },
        { name: 'XRP/USDT', status: true, category: 'USDT', icon: 'xrp' },
        { name: 'DOGE/USDT', status: true, category: 'USDT', icon: 'doge' },
        { name: 'ADA/USDT', status: true, category: 'USDT', icon: 'ada' },
        { name: 'BCH/USDT', status: true, category: 'USDT', icon: 'bch' },
        { name: 'AXS/USDT', status: true, category: 'Web3', icon: 'axs' },
        { name: 'ALICE/USDT', status: true, category: 'Web3', icon: 'alice' },
        { name: 'SAND/USDT', status: true, category: 'Web3', icon: 'sand' },
        { name: 'MANA/USDT', status: true, category: 'Web3', icon: 'mana' },
        { name: 'ENJ/USDT', status: true, category: 'Web3', icon: 'enj' },
        { name: 'YGG/USDT', status: true, category: 'Web3', icon: 'ygg' },
        { name: 'APE/USDT', status: true, category: 'NFT', icon: 'ape' },
        { name: 'GMT/USDT', status: true, category: 'NFT', icon: 'gmt' },
        { name: 'IMX/USDT', status: true, category: 'NFT', icon: 'imx' },
        { name: 'CHR/USDT', status: true, category: 'NFT', icon: 'chr' },
        { name: 'OGN/USDT', status: true, category: 'NFT', icon: 'ogn' },
        { name: 'CHZ/USDT', status: true, category: 'NFT', icon: 'chz' },
      ];

      for (const pair of defaultPairs) {
        try {
          await api.createCurrencyPair(pair);
        } catch (error) {
          console.error(`Failed to create pair ${pair.name}:`, error);
        }
      }

      // Reload after creating defaults
      const result = await api.getCurrencyPairs();
      if (result.pairs) {
        result.pairs.forEach((pair: any) => {
          addCurrencyPair({
            name: pair.name,
            category: pair.category,
            price: pair.price,
            change: pair.change,
            icon: pair.icon,
            status: pair.status
          });
        });
      }
    };

    loadCurrencyPairs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return null;
}
