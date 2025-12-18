# Data Architecture & Admin Panel Guide

## Overview
This application uses **Zustand** with **localStorage persistence** for state management. There is NO backend database - all data is stored in the browser's localStorage.

## Data Storage Structure

### 1. Auth Store (`authStore.ts`)
**Storage Key:** `auth-storage`

**Purpose:** Manages user authentication and all registered users

**Data Stored:**
- `user`: Currently logged-in user
- `isAuthenticated`: Login status
- `allUsers`: Array of ALL registered users (this is the single source of truth for users)

**Key Methods:**
- `login(user)`: Log in a user
- `logout()`: Log out current user
- `registerUser(user)`: Add a new user to allUsers
- `updateUserBalance(userId, balance)`: Update user's balance

### 2. Admin Store (`adminStore.ts`)
**Storage Key:** `admin-storage`

**Purpose:** Manages admin authentication and platform data (withdrawals, deposits, trades, currency pairs)

**Data Stored:**
- `isAuthenticated`: Admin login status
- `currencyPairs`: Trading pairs configuration
- `withdrawals`: All withdrawal requests
- `deposits`: All deposit requests
- `trades`: All trading activity

**Important:** Admin store NO LONGER stores users separately. It now reads from `authStore.allUsers` via `getAllUsers()` method.

## How Admin Panel Works

### User Management
1. **Viewing Users**: Admin panel calls `getAllUsers()` which fetches from `authStore.allUsers`
2. **Adding Users**: Creates user in `authStore` via `registerUser()`
3. **Updating Users**: Updates user in `authStore.allUsers` directly
4. **Deleting Users**: Removes user from `authStore.allUsers`
5. **Funding Users**: Updates balance in `authStore` via `updateUserBalance()`

### Withdrawal Management
1. User submits withdrawal request → stored in `adminStore.withdrawals`
2. Admin approves/rejects → updates withdrawal status
3. On approval → automatically deducts from user's balance in `authStore`

### Deposit Management
1. User submits deposit → stored in `adminStore.deposits`
2. Admin confirms/rejects → updates deposit status
3. On confirmation → automatically adds to user's balance in `authStore`

### Currency Pairs
- Managed entirely in `adminStore.currencyPairs`
- Prices updated by `PriceUpdater` component using CoinGecko API
- Initial pairs loaded by `StoreInitializer` component

### Trades
- Stored in `adminStore.trades`
- Linked to users via `userId`

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser localStorage                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐      ┌──────────────────────┐    │
│  │   auth-storage       │      │   admin-storage      │    │
│  │  (Auth Store)        │      │   (Admin Store)      │    │
│  ├──────────────────────┤      ├──────────────────────┤    │
│  │ • user               │◄─────┤ • isAuthenticated    │    │
│  │ • isAuthenticated    │      │ • currencyPairs      │    │
│  │ • allUsers ⭐        │      │ • withdrawals        │    │
│  │   (SOURCE OF TRUTH)  │      │ • deposits           │    │
│  └──────────────────────┘      │ • trades             │    │
│           ▲                     └──────────────────────┘    │
│           │                              │                   │
│           │ getAllUsers()                │                   │
│           └──────────────────────────────┘                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Admin Panel Tabs

### 1. Dashboard Tab
- Shows statistics from all stores
- Total users from `authStore.allUsers`
- Pending withdrawals/deposits from `adminStore`
- Recent activity feed

### 2. Manage Users Tab
- Lists all users from `authStore.allUsers`
- Can add, edit, delete, and fund users
- Search and filter functionality
- All changes sync to `authStore`

### 3. Withdrawals Tab
- Lists all withdrawal requests from `adminStore.withdrawals`
- Can approve/reject requests
- Approval automatically updates user balance

### 4. Deposits Tab
- Lists all deposit requests from `adminStore.deposits`
- Can confirm/reject deposits
- Confirmation automatically updates user balance

### 5. Currency Pairs Tab
- Manages trading pairs from `adminStore.currencyPairs`
- Can add, toggle, delete pairs
- Prices auto-update from CoinGecko API

### 6. All Trades Tab
- Lists all trades from `adminStore.trades`
- Shows user trading activity
- Can update trade status

## Important Notes

### No Backend Database
- All data is stored in browser's localStorage
- Data persists across page refreshes
- Data is lost if localStorage is cleared
- Each browser/device has separate data

### Data Synchronization
- Admin store now reads users from auth store (single source of truth)
- Balance updates in admin panel reflect immediately in user dashboard
- Withdrawal/deposit approvals automatically update user balances

### Admin Access
- Default password: `admin123` (change in `adminStore.ts`)
- Admin panel: `/admin`
- Protected by `isAuthenticated` check

### Testing the Admin Panel

1. **Register some users:**
   - Go to `/register` and create test accounts
   - Or use `/login` (auto-creates users)

2. **Login as admin:**
   - Go to `/admin`
   - Enter password: `admin123`

3. **View users:**
   - Click "Manage Users" tab
   - You should see all registered users

4. **Test withdrawals:**
   - Login as a user
   - Go to `/withdraw` and submit request
   - Login as admin
   - Go to "Withdrawals" tab
   - Approve/reject the request

5. **Test deposits:**
   - Similar flow as withdrawals
   - Go to `/deposit` as user
   - Approve in admin panel

## Future Improvements

To add a real database:
1. Set up a backend (Node.js + Express, Next.js API routes, etc.)
2. Replace Zustand stores with API calls
3. Add authentication (JWT, sessions, etc.)
4. Implement proper security measures
5. Add data validation and error handling

## Troubleshooting

**Admin panel shows no users:**
- Make sure users are registered via `/register` or `/login`
- Check browser console for errors
- Clear localStorage and re-register users

**Balance not updating:**
- Check that withdrawal/deposit is approved/confirmed
- Verify user exists in `authStore.allUsers`
- Check browser console for errors

**Data lost after refresh:**
- This shouldn't happen with Zustand persist
- Check if localStorage is enabled in browser
- Verify storage keys: `auth-storage` and `admin-storage`
