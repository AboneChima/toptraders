'use client';

import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, BookOpen, TrendingUp, Shield, Lightbulb, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import SideMenu from '@/components/SideMenu';

export default function KnowledgePage() {
  const router = useRouter();
  const [expandedCategory, setExpandedCategory] = useState<string | null>('basics');
  const [showSideMenu, setShowSideMenu] = useState(false);

  const categories = [
    {
      id: 'basics',
      title: 'Trading Basics',
      icon: BookOpen,
      color: 'from-blue-500/10 to-blue-600/10',
      iconColor: 'text-blue-600',
      articles: [
        { id: '1', title: 'What is Cryptocurrency?', time: '5 min' },
        { id: '2', title: 'How to Start Trading', time: '8 min' },
        { id: '3', title: 'Understanding Market Orders', time: '6 min' },
        { id: '4', title: 'Reading Candlestick Charts', time: '10 min' },
      ],
    },
    {
      id: 'strategies',
      title: 'Trading Strategies',
      icon: TrendingUp,
      color: 'from-green-500/10 to-green-600/10',
      iconColor: 'text-green-600',
      articles: [
        { id: '5', title: 'Day Trading Strategies', time: '12 min' },
        { id: '6', title: 'Swing Trading Guide', time: '15 min' },
        { id: '7', title: 'Risk Management', time: '10 min' },
        { id: '8', title: 'Technical Analysis', time: '20 min' },
      ],
    },
    {
      id: 'security',
      title: 'Security & Safety',
      icon: Shield,
      color: 'from-orange-500/10 to-orange-600/10',
      iconColor: 'text-orange-600',
      articles: [
        { id: '9', title: 'Securing Your Account', time: '7 min' },
        { id: '10', title: 'Two-Factor Authentication', time: '5 min' },
        { id: '11', title: 'Avoiding Scams', time: '8 min' },
        { id: '12', title: 'Wallet Security', time: '10 min' },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced Topics',
      icon: Lightbulb,
      color: 'from-purple-500/10 to-purple-600/10',
      iconColor: 'text-purple-600',
      articles: [
        { id: '13', title: 'Leverage Trading', time: '15 min' },
        { id: '14', title: 'Futures & Options', time: '18 min' },
        { id: '15', title: 'Market Psychology', time: '12 min' },
        { id: '16', title: 'Algorithmic Trading', time: '25 min' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-black/70 border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-base font-semibold text-white">Knowledge</h1>
          <button onClick={() => setShowSideMenu(true)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="px-4 py-4 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <h2 className="text-base font-bold text-white mb-1">Learn to Trade</h2>
        <p className="text-xs text-gray-400">Master crypto trading with our guides</p>
      </div>

      {/* Categories */}
      <div className="px-4 py-3 space-y-2 max-w-2xl mx-auto">
        {categories.map((category) => (
          <div
            key={category.id}
            className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden"
            style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)' }}
          >
            {/* Category Header */}
            <button
              onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                  <category.icon className={`w-5 h-5 ${category.iconColor}`} />
                </div>
                <span className="text-sm font-semibold text-white">{category.title}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  expandedCategory === category.id ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Articles List */}
            <AnimatePresence>
              {expandedCategory === category.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-white/10"
                >
                  {category.articles.map((article, index) => (
                    <motion.button
                      key={article.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => router.push(`/knowledge/${article.id}`)}
                      className="w-full flex items-center justify-between p-4 hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0"
                    >
                      <div className="flex-1 text-left">
                        <h3 className="text-xs font-medium text-white mb-0.5">{article.title}</h3>
                        <span className="text-xs text-gray-400">{article.time} read</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showSideMenu && <SideMenu onClose={() => setShowSideMenu(false)} />}
      </AnimatePresence>
    </div>
  );
}
