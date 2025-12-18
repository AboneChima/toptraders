'use client';

import { useState } from 'react';
import { ArrowLeft, Shield, Zap, Users, TrendingUp, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import SideMenu from '@/components/SideMenu';

export default function AboutPage() {
  const router = useRouter();
  const [showSideMenu, setShowSideMenu] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-black/70 border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-base font-semibold text-white">About Us</h1>
          <button onClick={() => setShowSideMenu(true)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto">
        {/* Glassmorphic Hero */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-6"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/40 to-purple-500/40 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-500/30 to-orange-500/30 rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-gray-300 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">TopTrades</h2>
              <p className="text-xs text-gray-400">Crypto Trading Platform</p>
            </div>
          </div>
        </motion.div>

        {/* Stats - Fixed visibility */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: '10M+', label: 'Users', gradient: 'from-blue-400 to-blue-600' },
            { value: '$50B+', label: 'Volume', gradient: 'from-green-400 to-green-600' },
            { value: '200+', label: 'Countries', gradient: 'from-purple-400 to-purple-600' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-4 text-center"
              style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)' }}
            >
              <div className={`text-lg font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-400 px-1">Key Features</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Shield, label: 'Secure', desc: 'Bank-level', color: 'from-blue-500/20 to-blue-600/20', iconColor: 'text-blue-400' },
              { icon: Zap, label: 'Fast', desc: 'Milliseconds', color: 'from-yellow-500/20 to-yellow-600/20', iconColor: 'text-yellow-400' },
              { icon: Users, label: 'Trusted', desc: '10M+ users', color: 'from-green-500/20 to-green-600/20', iconColor: 'text-green-400' },
              { icon: TrendingUp, label: 'Advanced', desc: 'Pro tools', color: 'from-purple-500/20 to-purple-600/20', iconColor: 'text-purple-400' },
            ].map((feature) => (
              <div
                key={feature.label}
                className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-4"
                style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)' }}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-2`}>
                  <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
                </div>
                <div className="text-xs font-semibold text-white">{feature.label}</div>
                <div className="text-xs text-gray-400">{feature.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div
          className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-5"
          style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)' }}
        >
          <h3 className="text-sm font-semibold text-white mb-2">Our Mission</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Democratize cryptocurrency trading with a secure, innovative platform that empowers everyone to participate in the digital economy.
          </p>
        </div>

        {/* Contact */}
        <button className="w-full py-3 bg-white text-black text-sm font-medium rounded-2xl hover:bg-gray-200 transition-colors shadow-lg">
          Contact Support
        </button>
      </div>

      <AnimatePresence>
        {showSideMenu && <SideMenu onClose={() => setShowSideMenu(false)} />}
      </AnimatePresence>
    </div>
  );
}
