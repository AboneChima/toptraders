'use client';

import { useState } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { Lock, TrendingUp } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAdminStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    if (!success) {
      setError('Invalid password');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-gray-400 text-sm">Enter password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6"
            style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
          >
            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 mb-4">
              <Lock className="w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter admin password"
                className="flex-1 bg-transparent text-white outline-none placeholder-gray-500"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm mb-4">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Login
            </button>
          </div>

          <p className="text-center text-xs text-gray-500">
            Authorized access only
          </p>
        </form>
      </div>
    </div>
  );
}
