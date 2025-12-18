'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import ActionButtons from '@/components/ActionButtons';
import MarketSection from '@/components/MarketSection';
import ConnectButton from '@/components/ConnectButton';
import PromoBanner from '@/components/PromoBanner';
import Footer from '@/components/Footer';
import SideMenu from '@/components/SideMenu';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Menu } from 'lucide-react';

export default function Home() {
  const [showSideMenu, setShowSideMenu] = useState(false);

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-black">
        {/* Hamburger Menu Button */}
        <button
          onClick={() => setShowSideMenu(true)}
          className="fixed top-4 left-4 z-30 p-2 bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>

        <ConnectButton />
        <HeroSection />
        <ActionButtons />
        <MarketSection />
        <PromoBanner />
        <Footer />

        {/* Side Menu */}
        <AnimatePresence>
          {showSideMenu && (
            <SideMenu onClose={() => setShowSideMenu(false)} />
          )}
        </AnimatePresence>
      </main>
    </ProtectedRoute>
  );
}
