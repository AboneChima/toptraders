# Coin Images

## How to Add Coin Logos

1. Download coin logos (PNG or SVG format, recommended size: 64x64px or larger)
2. Save them in this folder with these names:
   - `btc.png` - Bitcoin
   - `eth.png` - Ethereum
   - `bch.png` - Bitcoin Cash
   - `xrp.png` - Ripple
   - `doge.png` - Dogecoin
   - `ada.png` - Cardano
   - `link.png` - Chainlink
   - `dot.png` - Polkadot
   - `ape.png` - ApeCoin
   - `sand.png` - The Sandbox

## Where to Get Coin Logos

Free sources:
- CoinGecko API: https://www.coingecko.com/
- CryptoCompare: https://www.cryptocompare.com/
- CoinMarketCap: https://coinmarketcap.com/

## After Adding Images

The MarketSection component will need to be updated to use:
```tsx
<Image 
  src={`/coins/${pair.name.toLowerCase()}.png`} 
  alt={pair.name}
  width={44}
  height={44}
  className="rounded-full"
/>
```

For now, the app uses colored circles with the first letter of each coin.
