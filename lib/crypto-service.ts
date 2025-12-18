// CoinGecko API service for real-time crypto prices
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

interface CoinPrice {
  id: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
}

// Map our coin symbols to CoinGecko IDs
const coinGeckoIds: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  BCH: 'bitcoin-cash',
  XRP: 'ripple',
  DOGE: 'dogecoin',
  ADA: 'cardano',
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

export async function fetchCryptoPrices(symbols: string[]): Promise<Record<string, CoinPrice>> {
  try {
    const ids = symbols.map(s => coinGeckoIds[s]).filter(Boolean).join(',');
    
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false`,
      { next: { revalidate: 60 } } // Cache for 60 seconds
    );

    if (!response.ok) {
      throw new Error('Failed to fetch prices');
    }

    const data = await response.json();
    
    const priceMap: Record<string, CoinPrice> = {};
    data.forEach((coin: { id: string; symbol: string; current_price: number; price_change_percentage_24h: number }) => {
      const symbol = Object.keys(coinGeckoIds).find(
        key => coinGeckoIds[key] === coin.id
      );
      if (symbol) {
        priceMap[symbol] = {
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
          current_price: coin.current_price,
          price_change_percentage_24h: coin.price_change_percentage_24h || 0,
        };
      }
    });

    return priceMap;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    return {};
  }
}

export function formatPrice(price: number): string {
  if (price >= 1000) {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else if (price >= 1) {
    return `$${price.toFixed(2)}`;
  } else {
    return `$${price.toFixed(4)}`;
  }
}
