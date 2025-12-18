'use client';

import { useEffect } from 'react';
import { useAdminStore } from '@/store/adminStore';

// Map coin symbols to CoinGecko IDs
const coinGeckoIds: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  BNB: 'binancecoin',
  BCH: 'bitcoin-cash',
  XRP: 'ripple',
  DOGE: 'dogecoin',
  ADA: 'cardano',
  SOL: 'solana',
  MATIC: 'matic-network',
  DOT: 'polkadot',
  AVAX: 'avalanche-2',
  LINK: 'chainlink',
  UNI: 'uniswap',
  AXS: 'axie-infinity',
  ALICE: 'my-neighbor-alice',
  SAND: 'the-sandbox',
  MANA: 'decentraland',
  ENJ: 'enjincoin',
  YGG: 'yield-guild-games',
  APE: 'apecoin',
  GMT: 'stepn',
  IMX: 'immutable-x',
  CHR: 'chromia',
  OGN: 'origin-protocol',
  CHZ: 'chiliz',
};

export default function PriceUpdater() {
  const updateCurrencyPair = useAdminStore((state) => state.updateCurrencyPair);

  useEffect(() => {
    const updatePrices = async () => {
      // Get fresh currency pairs from store
      const currencyPairs = useAdminStore.getState().currencyPairs;
      if (currencyPairs.length === 0) return;

      try {
        // Extract unique symbols from currency pairs
        const symbols = currencyPairs.map(pair => {
          const symbol = pair.name.split('/')[0];
          return symbol;
        });

        // Get CoinGecko IDs for these symbols
        const ids = symbols
          .map(s => coinGeckoIds[s])
          .filter(Boolean)
          .join(',');

        if (!ids) return;

        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          }
        );

        if (!response.ok) {
          console.warn('CoinGecko API request failed, using mock prices');
          // Use mock prices if API fails
          setMockPrices();
          return;
        }

        const data = await response.json();

        // Update prices for each currency pair
        data.forEach((coin: { id: string; current_price: number; price_change_percentage_24h: number }) => {
          const symbol = Object.keys(coinGeckoIds).find(
            key => coinGeckoIds[key] === coin.id
          );

          if (symbol) {
            // Find all pairs with this symbol
            currencyPairs.forEach(pair => {
              if (pair.name.startsWith(symbol + '/')) {
                updateCurrencyPair(pair.id, {
                  price: coin.current_price,
                  change: coin.price_change_percentage_24h || 0,
                });
              }
            });
          }
        });
      } catch (error) {
        console.warn('Failed to fetch crypto prices, using mock data:', error);
        // Use mock prices on error
        setMockPrices();
      }
    };

    const setMockPrices = () => {
      // Get fresh currency pairs from store
      const currencyPairs = useAdminStore.getState().currencyPairs;
      
      // Mock prices for testing when API is unavailable
      const mockPrices: Record<string, { price: number; change: number }> = {
        BTC: { price: 89500, change: 2.5 },
        ETH: { price: 3200, change: 1.8 },
        XRP: { price: 0.65, change: -0.5 },
        DOGE: { price: 0.08, change: 3.2 },
        ADA: { price: 0.45, change: 1.1 },
        BCH: { price: 420, change: -1.2 },
        AXS: { price: 8.5, change: 4.5 },
        ALICE: { price: 1.2, change: 2.1 },
        SAND: { price: 0.55, change: 3.8 },
        MANA: { price: 0.42, change: 1.9 },
        ENJ: { price: 0.38, change: 2.3 },
        YGG: { price: 0.52, change: 1.7 },
        APE: { price: 1.8, change: -0.8 },
        GMT: { price: 0.25, change: 2.9 },
        IMX: { price: 1.5, change: 3.1 },
        CHR: { price: 0.18, change: 1.4 },
        OGN: { price: 0.12, change: 0.9 },
        CHZ: { price: 0.09, change: 2.2 },
      };

      currencyPairs.forEach(pair => {
        const symbol = pair.name.split('/')[0];
        const mockData = mockPrices[symbol];
        if (mockData && pair.price === 0) {
          // Only set mock prices if price is not already set
          updateCurrencyPair(pair.id, {
            price: mockData.price,
            change: mockData.change,
          });
        }
      });
    };

    // Set mock prices once on mount
    setMockPrices();
    
    // Try to fetch real prices after a delay
    const fetchTimer = setTimeout(() => {
      updatePrices();
    }, 1000);

    // Update every 60 seconds
    const interval = setInterval(updatePrices, 60000);

    return () => {
      clearTimeout(fetchTimer);
      clearInterval(interval);
    };
  }, [updateCurrencyPair]);

  return null; // This component doesn't render anything
}
