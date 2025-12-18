'use client';

import PriceUpdater from './PriceUpdater';
import StoreInitializer from './StoreInitializer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StoreInitializer />
      <PriceUpdater />
      {children}
    </>
  );
}
