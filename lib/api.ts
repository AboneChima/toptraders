// API client for backend communication

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export const api = {
  // Auth
  register: async (data: { name: string; email: string; password: string }) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  login: async (data: { email: string; password: string }) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Users
  getUsers: async () => {
    const res = await fetch(`${API_BASE}/api/users`);
    return res.json();
  },

  updateUserBalance: async (userId: string, balance: number) => {
    const res = await fetch(`${API_BASE}/api/users/${userId}/balance`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ balance }),
    });
    return res.json();
  },

  deleteUser: async (userId: string) => {
    const res = await fetch(`${API_BASE}/api/users/${userId}`, {
      method: 'DELETE',
    });
    return res.json();
  },
};
