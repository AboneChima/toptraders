'use client';

import { useState } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { Plus, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CurrencyTab() {
  const { currencyPairs, addCurrencyPair, toggleCurrencyPair, deleteCurrencyPair } = useAdminStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: 'USDT' as 'USDT' | 'Web3' | 'NFT',
    price: 0,
    change: 0,
    icon: '',
    description: '',
    status: true,
  });

  // Filter currency pairs based on search query
  const filteredPairs = currencyPairs.filter(pair =>
    pair.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pair.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pair.icon.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPair = () => {
    if (formData.name.trim() && formData.icon.trim()) {
      addCurrencyPair(formData);
      setFormData({
        name: '',
        category: 'USDT',
        price: 0,
        change: 0,
        icon: '',
        description: '',
        status: true,
      });
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6"
        style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 max-w-md">
            <h3 className="text-lg font-semibold text-white mb-2">Currency Pairs</h3>
            <input
              type="text"
              placeholder="Search by name, category, or icon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm outline-none focus:border-white/30"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-white text-black rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Pair
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">SL</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">NAME</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">CATEGORY</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">PRICE</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">STATUS</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredPairs.map((pair, index) => (
                <tr key={pair.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4 text-sm text-white">{index + 1}</td>
                  <td className="py-3 px-4 text-sm text-white">{pair.name}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      pair.category === 'USDT' ? 'bg-blue-500/20 text-blue-400' :
                      pair.category === 'Web3' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-orange-500/20 text-orange-400'
                    }`}>
                      {pair.category || 'USDT'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-white">${pair.price ? pair.price.toFixed(2) : '0.00'}</td>
                  <td className="py-3 px-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pair.status}
                        onChange={() => toggleCurrencyPair(pair.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => deleteCurrencyPair(pair.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPairs.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500 text-sm">
                    {searchQuery ? `No currency pairs found matching "${searchQuery}"` : 'No currency pairs found. Create your first pair to get started.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Pair Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Create Currency Pair</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/10 rounded-lg">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Currency Pair Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., BTC/USDT, ETH/USDT"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-white/30"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as 'USDT' | 'Web3' | 'NFT' })}
                    className="w-full px-4 py-3 bg-gray-900 border border-white/10 rounded-xl text-white outline-none focus:border-white/30 cursor-pointer"
                    style={{ 
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      paddingRight: '3rem'
                    }}
                  >
                    <option value="USDT" style={{ backgroundColor: '#111', color: 'white' }}>USDT (Main Pairs)</option>
                    <option value="Web3" style={{ backgroundColor: '#111', color: 'white' }}>Web3 (Gaming/Metaverse)</option>
                    <option value="NFT" style={{ backgroundColor: '#111', color: 'white' }}>NFT (NFT Tokens)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Price (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g., 90000 for Bitcoin"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    24h Change (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g., 2.5 for +2.5% or -1.2 for -1.2%"
                    value={formData.change || ''}
                    onChange={(e) => setFormData({ ...formData, change: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-white/30"
                  />
                  <p className="text-xs text-gray-500 mt-1">Use positive numbers for gains, negative for losses</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Icon Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., bitcoin, eth, doge"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-white/30"
                  />
                  <p className="text-xs text-gray-500 mt-1">Must match the coin image filename in /public folder</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    placeholder="Brief description of this currency pair"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-white/30 resize-none"
                  />
                </div>

                <button
                  onClick={handleAddPair}
                  className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Create Currency Pair
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
