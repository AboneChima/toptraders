'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MarketSection from '@/components/MarketSection';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function MarketsPage() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-black">
      <div className="p-6">
        <button
          onClick={() => router.back()}
          className="text-white flex items-center gap-2 hover:text-gray-300 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h1 className="text-3xl font-bold text-white mb-8">Markets</h1>
        
        <MarketSection />
      </div>
      </main>
    </ProtectedRoute>
  );
}
