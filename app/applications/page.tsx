'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Grid3x3 } from 'lucide-react';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ApplicationsPage() {
  const router = useRouter();

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
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Grid3x3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Applications</h1>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <p className="text-gray-400 text-center py-12">
              Applications coming soon
            </p>
          </div>
        </motion.div>
      </div>
      </main>
    </ProtectedRoute>
  );
}
