'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center px-4 py-6 text-center">
      {/* Hero Illustration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <div className="relative w-56 h-56 flex items-center justify-center">
          {/* Yellow Coin */}
          <div className="absolute top-0 right-12 w-24 h-24 bg-yellow-400 rounded-full border-8 border-gray-800 z-10">
            <div className="absolute inset-2 bg-yellow-300 rounded-full"></div>
          </div>
          
          {/* Green Ethereum Coin */}
          <div className="absolute left-0 top-16 w-20 h-20 bg-emerald-400 rounded-full border-8 border-gray-800 z-20">
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-10 bg-gray-800 clip-diamond"></div>
            </div>
          </div>
          
          {/* Blue Coin */}
          <div className="absolute bottom-8 right-0 w-20 h-20 bg-blue-500 rounded-full border-8 border-gray-800 z-10">
            <div className="absolute inset-2 bg-blue-400 rounded-full">
              <div className="absolute inset-3 bg-gray-800 rounded-full"></div>
            </div>
          </div>
          
          {/* Vertical bars */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
            <div className="w-8 h-32 bg-gray-700 rounded-t-lg"></div>
            <div className="w-8 h-40 bg-gray-700 rounded-t-lg"></div>
            <div className="w-8 h-28 bg-gray-700 rounded-t-lg"></div>
          </div>
          
          {/* Sparkles */}
          <div className="absolute top-8 left-16 w-3 h-3 bg-cyan-400 rotate-45"></div>
          <div className="absolute top-20 right-8 w-2 h-2 bg-cyan-400 rotate-45"></div>
          <div className="absolute bottom-20 left-8 w-2 h-2 bg-cyan-400 rotate-45"></div>
          <div className="absolute top-12 right-20 w-4 h-4">
            <div className="absolute w-1 h-4 bg-yellow-400"></div>
            <div className="absolute w-4 h-1 bg-yellow-400 top-1.5"></div>
          </div>
          <div className="absolute bottom-16 right-12 w-3 h-3">
            <div className="absolute w-0.5 h-3 bg-cyan-400 left-1"></div>
            <div className="absolute w-3 h-0.5 bg-cyan-400 top-1"></div>
          </div>
        </div>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-xl md:text-2xl font-bold text-white mb-5 max-w-sm px-4"
      >
        The future belongs to cryptocurrencies
      </motion.h1>

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-wrap items-center justify-center gap-4 text-white text-xs"
      >
        <div className="flex items-center gap-1">
          <Check className="w-3.5 h-3.5" />
          <span>Secure</span>
        </div>
        <div className="flex items-center gap-1">
          <Check className="w-3.5 h-3.5" />
          <span>Innovative</span>
        </div>
        <div className="flex items-center gap-1">
          <Check className="w-3.5 h-3.5" />
          <span>Trustworthy</span>
        </div>
      </motion.div>
    </section>
  );
}
