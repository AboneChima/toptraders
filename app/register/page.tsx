'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    try {
      // Try API first (if database is set up)
      const result = await api.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (result.error) {
        alert(result.error);
        setIsLoading(false);
        return;
      }

      // Save to localStorage for session
      const { registerUser, login } = useAuthStore.getState();
      registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      login(formData.email, formData.password);

      setTimeout(() => {
        setIsLoading(false);
        router.push('/');
      }, 500);
    } catch (error) {
      // Fallback to localStorage if API fails
      console.log('API not available, using localStorage');
      const { registerUser, login } = useAuthStore.getState();
      
      const success = registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      if (!success) {
        alert('Email already registered');
        setIsLoading(false);
        return;
      }

      login(formData.email, formData.password);
      
      setTimeout(() => {
        setIsLoading(false);
        router.push('/');
      }, 500);
    }
  };

  return (
    <main className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="p-6">
        <button
          onClick={() => router.back()}
          className="text-white flex items-center gap-2 hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      {/* Register Form */}
      <div className="flex-1 flex items-center justify-center px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <h1 className="text-3xl font-bold text-white mb-2 text-center">Create Account</h1>
          <p className="text-gray-400 mb-8 text-center">Join the future of crypto trading</p>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-white mb-2 text-sm">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  required
                  className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-800 focus:border-blue-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-white mb-2 text-sm">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-800 focus:border-blue-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-white mb-2 text-sm">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a password"
                  required
                  className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-800 focus:border-blue-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-white mb-2 text-sm">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm your password"
                  required
                  className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-800 focus:border-blue-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </motion.button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-400 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-500 hover:text-blue-400 transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
