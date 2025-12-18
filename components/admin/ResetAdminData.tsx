'use client';

import { useEffect } from 'react';

export default function ResetAdminData() {
  useEffect(() => {
    // Only run once - check if we've already reset
    const hasReset = sessionStorage.getItem('admin-data-reset');
    if (hasReset) return;

    // Clear old admin data on mount
    const adminData = localStorage.getItem('admin-storage');
    if (adminData) {
      const parsed = JSON.parse(adminData);
      // Check if currency pairs are less than expected
      if (parsed.state?.currencyPairs?.length < 19) {
        localStorage.removeItem('admin-storage');
        sessionStorage.setItem('admin-data-reset', 'true');
        window.location.reload();
      }
    }
  }, []);

  return null;
}
