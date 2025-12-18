'use client';

import { useState, useEffect } from 'react';
import { useAdminStore } from '@/store/adminStore';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import ResetAdminData from '@/components/admin/ResetAdminData';

export default function AdminPage() {
  const { isAuthenticated } = useAdminStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Delay mounting to avoid hydration mismatch
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <ResetAdminData />
      {!isAuthenticated ? <AdminLogin /> : <AdminDashboard />}
    </>
  );
}
