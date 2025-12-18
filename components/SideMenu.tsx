'use client';

import { motion } from 'framer-motion';
import { 
  Home, 
  Wallet, 
  Pickaxe, 
  TrendingUp, 
  Gift, 
  FileText, 
  BookOpen, 
  Info,
  ChevronDown,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface SideMenuProps {
  onClose: () => void;
}

export default function SideMenu({ onClose }: SideMenuProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Wallet, label: 'My Assets', path: '/assets' },
    { icon: Pickaxe, label: 'Mining', path: '/staking', hasSubmenu: false },
    { icon: TrendingUp, label: 'Trade', path: '/trade', hasSubmenu: false },
    { icon: Gift, label: 'Referral', path: '/referral' },
    { icon: FileText, label: 'Financial Records', path: '/records' },
    { icon: BookOpen, label: 'Knowledge', path: '/knowledge', hasSubmenu: false },
    { icon: Info, label: 'About Us', path: '/about' },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Side Menu */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed left-0 top-0 bottom-0 w-80 bg-black z-50 overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        {/* User Profile */}
        <div className="px-6 py-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg">
              {isAuthenticated && user ? (
                <span className="text-white font-bold text-lg">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </span>
              ) : (
                <span className="text-white font-bold text-lg">?</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold text-base truncate">
                {isAuthenticated && user ? user.name : 'Guest User'}
              </div>
              <div className="text-gray-400 text-xs">
                ID: {isAuthenticated && user ? user.id : '000000'}
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="py-4">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.path)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-900 transition-colors"
            >
              <div className="flex items-center gap-4">
                <item.icon className="w-6 h-6 text-white" />
                <span className="text-white font-medium">{item.label}</span>
              </div>
              {item.hasSubmenu && (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
          ))}

        </nav>
      </motion.div>
    </>
  );
}
