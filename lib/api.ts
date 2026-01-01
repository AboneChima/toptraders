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

  // Deposits
  getDeposits: async () => {
    const res = await fetch(`${API_BASE}/api/deposits`);
    return res.json();
  },

  createDeposit: async (data: { userId: string; amount: number; method: string }) => {
    const res = await fetch(`${API_BASE}/api/deposits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateDepositStatus: async (depositId: string, status: string) => {
    const res = await fetch(`${API_BASE}/api/deposits/${depositId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // Withdrawals
  getWithdrawals: async () => {
    const res = await fetch(`${API_BASE}/api/withdrawals`);
    return res.json();
  },

  createWithdrawal: async (data: { userId: string; amount: number; walletAddress: string }) => {
    const res = await fetch(`${API_BASE}/api/withdrawals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateWithdrawalStatus: async (withdrawalId: string, status: string) => {
    const res = await fetch(`${API_BASE}/api/withdrawals/${withdrawalId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // Trades
  getTrades: async () => {
    const res = await fetch(`${API_BASE}/api/trades`);
    return res.json();
  },

  createTrade: async (data: { userId: string; currencyPair: string; type: string; amount: number; entryPrice: number }) => {
    const res = await fetch(`${API_BASE}/api/trades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateTrade: async (tradeId: string, data: { status?: string; profitLoss?: number; currentPrice?: number }) => {
    const res = await fetch(`${API_BASE}/api/trades/${tradeId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Currency Pairs
  getCurrencyPairs: async () => {
    const res = await fetch(`${API_BASE}/api/currency-pairs`);
    return res.json();
  },

  createCurrencyPair: async (data: { name: string; category?: string; icon?: string; description?: string }) => {
    const res = await fetch(`${API_BASE}/api/currency-pairs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateCurrencyPair: async (pairId: number, data: any) => {
    const res = await fetch(`${API_BASE}/api/currency-pairs/${pairId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteCurrencyPair: async (pairId: number) => {
    const res = await fetch(`${API_BASE}/api/currency-pairs/${pairId}`, {
      method: 'DELETE',
    });
    return res.json();
  },
};
