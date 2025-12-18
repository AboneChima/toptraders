'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Settings, User, Bell, Shield, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function SettingsPage() {
  const router = useRouter();

  const settingsItems = [
    { icon: User, label: 'Profile Settings', path: '/settings/profile' },
    { icon: Bell, label: 'Notifications', path: '/settings/notifications' },
    { icon: Shield, label: 'Security', path: '/settings/security' },
  ];

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-black">
      <div className="p-6">
        <button
          onClick={() => router.back()}
          className="text-white flex items-center gap-2 hover:text-gray-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
          </div>

          <div className="space-y-4">
            {settingsItems.map((item, index) => (
              <motion.button
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => router.push(item.path)}
                className="w-full bg-gray-900 rounded-xl p-4 flex items-center gap-4 hover:bg-gray-800 transition-colors border border-gray-800"
              >
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-medium">{item.label}</span>
              </motion.button>
            ))}

            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => router.push('/login')}
              className="w-full bg-red-600 rounded-xl p-4 flex items-center gap-4 hover:bg-red-700 transition-colors mt-8"
            >
              <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center">
                <LogOut className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-medium">Logout</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
      </main>
    </ProtectedRoute>
  );
}
