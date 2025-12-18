'use client';

import { useEffect } from 'react';

export default function ResetAdminData() {
  useEffect(() => {
    // Clear old admin data on mount
    const adminData = localStorage.getItem('admin-storage');
    if (adminData) {
      const parsed = JSON.parse(adminData);
      // Check if currency pairs are less than expected
      if (parsed.state?.currencyPairs?.length < 19) {
        localStorage.removeItem('admin-storage');
        window.location.reload();
      }
    }
  }, []);

  return null;
}
