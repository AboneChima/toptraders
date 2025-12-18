'use client';

import { useState, useEffect } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { Edit, Trash2, DollarSign, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UsersTab() {
  const updateUser = useAdminStore((state) => state.updateUser);
  const deleteUser = useAdminStore((state) => state.deleteUser);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string; email: string; balance: number; status: 'active' | 'inactive' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    balance: 0,
    status: 'active' as 'active' | 'inactive',
  });

  // Get users directly from localStorage to avoid hydration issues
  const [allUsers, setAllUsers] = useState<Array<{
    id: string;
    name: string;
    email: string;
    balance: number;
    status: 'active' | 'inactive';
    createdAt: string;
  }>>([]);

  useEffect(() => {
    setMounted(true);
    
    // Load users from API or localStorage
    const loadUsers = async () => {
      try {
        // Try API first
        const result = await api.getUsers();
        if (result.users) {
          setAllUsers(result.users);
          return;
        }
      } catch (error) {
        console.log('API not available, using localStorage');
      }
      
      // Fallback to localStorage
      try {
        const { getAllUsers } = useAuthStore.getState();
        const users = getAllUsers();
        setAllUsers(users);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };

    loadUsers();

    // Reload users every 2 seconds to catch updates
    const interval = setInterval(loadUsers, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return <div className="text-white">Loading...</div>;
  }

  // Filter users based on search query
  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditUser = () => {
    if (selectedUser) {
      updateUser(selectedUser.id, formData);
      setShowEditModal(false);
      setSelectedUser(null);
    }
  };

  const handleFundUser = async (amount: number) => {
    if (selectedUser) {
      try {
        const currentBalance = Number(selectedUser.balance) || 0;
        const newBalance = currentBalance + amount;
        
        // Update via API
        await fetch(`/api/users/${selectedUser.id}/balance`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ balance: newBalance }),
        });

        // Reload users
        const loadUsers = async () => {
          try {
            const result = await fetch('/api/users');
            const data = await result.json();
            if (data.users) {
              setAllUsers(data.users);
            }
          } catch (error) {
            console.error('Error loading users:', error);
          }
        };
        await loadUsers();

        setShowFundModal(false);
        setSelectedUser(null);
        setCustomAmount('');
      } catch (error) {
        console.error('Fund user error:', error);
        alert('Failed to fund user');
      }
    }
  };

  const handleLoginAsUser = async (user: any) => {
    if (confirm(`Login as ${user.name}? This will log you out of admin.`)) {
      try {
        // Set the user in auth store
        const authUser = {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          password: '',
          balance: user.balance,
          status: user.status,
          createdAt: user.createdAt,
        };
        
        useAuthStore.getState().user = authUser;
        useAuthStore.getState().isAuthenticated = true;
        localStorage.setItem('toptrades-auth', JSON.stringify({ user: authUser, isAuthenticated: true }));
        
        // Logout from admin
        useAdminStore.getState().logout();
        
        // Redirect to home
        window.location.href = '/';
      } catch (error) {
        console.error('Login as user error:', error);
        alert('Failed to login as user');
      }
    }
  };

  const openEditModal = (user: { id: string; name: string; email: string; balance: number; status: 'active' | 'inactive' }) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      balance: user.balance,
      status: user.status,
    });
    setShowEditModal(true);
  };



  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6"
        style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">User Management</h3>
          <div className="max-w-md">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm outline-none focus:border-white/30"
            />
            <p className="text-xs text-gray-400 mt-1">
              Showing {filteredUsers.length} of {allUsers.length} users
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Balance</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4 text-sm text-white">{user.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-400">{user.email}</td>
                  <td className="py-3 px-4 text-sm text-white">${(Number(user.balance) || 0).toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowFundModal(true);
                        }}
                        className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg"
                        title="Fund User"
                      >
                        <DollarSign className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleLoginAsUser(user)}
                        className="p-2 text-purple-400 hover:bg-purple-500/10 rounded-lg"
                        title="Login as User"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                      </button>
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500 text-sm">
                    {searchQuery ? `No users found matching "${searchQuery}"` : 'No users found. Register a user or add one manually.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Edit User</h3>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-white/10 rounded-lg">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-white/30"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-white/30"
                />
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-white/30"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <button
                  onClick={handleEditUser}
                  className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Update User
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fund User Modal */}
      <AnimatePresence>
        {showFundModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Fund User Account</h3>
                <button onClick={() => setShowFundModal(false)} className="p-2 hover:bg-white/10 rounded-lg">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-1">User: {selectedUser.name}</p>
                <p className="text-sm text-gray-400">Current Balance: ${(Number(selectedUser.balance) || 0).toFixed(2)}</p>
              </div>
              
              <div className="mb-4">
                <label className="text-sm text-gray-400 mb-2 block">Custom Amount</label>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter custom amount"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-white/30"
                />
                {customAmount && parseFloat(customAmount) > 0 && (
                  <button
                    onClick={() => handleFundUser(parseFloat(customAmount))}
                    className="w-full mt-2 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
                  >
                    Add ${parseFloat(customAmount).toFixed(2)}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[100, 500, 1000, 5000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleFundUser(amount)}
                    className="py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 transition-colors"
                  >
                    +${amount}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
