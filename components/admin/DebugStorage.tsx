'use client';

import { useEffect, useState } from 'react';

export default function DebugStorage() {
  const [storageData, setStorageData] = useState<any>(null);

  useEffect(() => {
    const checkStorage = () => {
      try {
        const authStorage = localStorage.getItem('auth-storage');
        const adminStorage = localStorage.getItem('admin-storage');
        
        console.log('=== STORAGE DEBUG ===');
        console.log('auth-storage raw:', authStorage);
        console.log('admin-storage raw:', adminStorage);
        
        if (authStorage) {
          const authData = JSON.parse(authStorage);
          console.log('auth-storage parsed:', authData);
          console.log('allUsers:', authData?.state?.allUsers);
        }
        
        if (adminStorage) {
          const adminData = JSON.parse(adminStorage);
          console.log('admin-storage parsed:', adminData);
          console.log('users:', adminData?.state?.users);
        }
        
        setStorageData({
          auth: authStorage ? JSON.parse(authStorage) : null,
          admin: adminStorage ? JSON.parse(adminStorage) : null,
        });
      } catch (error) {
        console.error('Error reading storage:', error);
      }
    };

    checkStorage();
    const interval = setInterval(checkStorage, 2000);
    return () => clearInterval(interval);
  }, []);

  const migrateUser = () => {
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const data = JSON.parse(authStorage);
        if (data.state.user && (!data.state.allUsers || data.state.allUsers.length === 0)) {
          // Add current user to allUsers
          data.state.allUsers = [{
            id: data.state.user.id,
            name: data.state.user.name,
            email: data.state.user.email,
            balance: data.state.user.balance || 0,
            status: data.state.user.status || 'active',
            createdAt: data.state.user.createdAt || new Date().toISOString(),
          }];
          localStorage.setItem('auth-storage', JSON.stringify(data));
          console.log('User migrated to allUsers!');
          alert('User migrated! Refresh the page.');
        } else {
          alert('No migration needed or user already in allUsers');
        }
      }
    } catch (error) {
      console.error('Migration error:', error);
    }
  };

  return (
    <div className="fixed top-4 left-4 bg-black/90 text-white p-4 rounded-lg max-w-2xl max-h-96 overflow-auto text-xs z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold">Storage Debug</h3>
        <button
          onClick={migrateUser}
          className="px-3 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
        >
          Migrate User
        </button>
      </div>
      <pre>{JSON.stringify(storageData, null, 2)}</pre>
    </div>
  );
}
