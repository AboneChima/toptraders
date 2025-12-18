'use client';

import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';
import AuthModal from './AuthModal';
import { useRouter } from 'next/navigation';

export default function PromoBanner() {
  const { isAuthenticated } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();

  const handleStartNow = () => {
    if (isAuthenticated) {
      router.push('/staking');
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <section className="px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <h2 className="text-gray-500 text-base font-normal px-4 leading-relaxed">
            Don&apos;t just HOLD. Start earning massive APY on popular cryptos.
          </h2>
          
          <button 
            onClick={handleStartNow}
            className="w-full bg-blue-600 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-colors"
          >
            Start Now
          </button>
        </motion.div>
      </section>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
