'use client';

import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, Wallet, LayoutGrid } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';
import AuthModal from './AuthModal';

export default function ActionButtons() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const buttons = [
    { icon: ArrowDown, label: 'Deposit', path: '/deposit' },
    { icon: ArrowUp, label: 'Withdraw', path: '/withdraw' },
    { icon: Wallet, label: 'Assets', path: '/assets' },
    { icon: LayoutGrid, label: 'Applications', path: '/applications' },
  ];

  const handleButtonClick = (path: string) => {
    if (isAuthenticated) {
      router.push(path);
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <section className="px-4 py-3">
        <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
          {buttons.map((button, index) => (
            <motion.button
              key={button.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleButtonClick(button.path)}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                <button.icon className="w-5 h-5 text-black" strokeWidth={2.5} />
              </div>
              <span className="text-white text-xs font-normal">{button.label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
