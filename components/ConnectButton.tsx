'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

export default function ConnectButton() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowMenu(false);
    router.push('/');
  };

  if (isAuthenticated && user) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMenu(!showMenu)}
            className="bg-blue-600 text-white w-10 h-10 rounded-full font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            {user.name.charAt(0).toUpperCase()}
          </motion.button>

          {/* Dropdown Menu */}
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-xl border border-gray-800 overflow-hidden"
            >
              <div className="p-3 border-b border-gray-800">
                <p className="text-white font-semibold text-sm">{user.name}</p>
                <p className="text-gray-400 text-xs truncate">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-3 py-2 text-left text-red-400 hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/login')}
        className="bg-white text-black px-5 py-2 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors"
      >
        Sign In
      </motion.button>
    </div>
  );
}
