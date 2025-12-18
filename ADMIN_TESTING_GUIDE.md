# Admin Panel Testing Guide

## Quick Start Testing

### Step 1: Create Test Users
1. Open http://localhost:3000/register
2. Register a few test users:
   - User 1: `john@test.com` / any password
   - User 2: `jane@test.com` / any password
   - User 3: `bob@test.com` / any password

### Step 2: Access Admin Panel
1. Go to http://localhost:3000/admin
2. Enter password: `admin123`
3. You should see the admin dashboard

### Step 3: Verify Users Tab
1. Click on "Manage Users" tab
2. You should see all 3 registered users
3. Try these actions:
   - **Search**: Type a name in the search box
   - **Fund User**: Click the $ icon, add $1000 to a user
   - **Edit User**: Click the edit icon, change user status
   - **Add User**: Click "Add User" button, create a new user

### Step 4: Test Withdrawals
1. **As User:**
   - Logout from admin (if logged in)
   - Login as one of your test users
   - Go to http://localhost:3000/withdraw
   - Submit a withdrawal request for $100

2. **As Admin:**
   - Go back to http://localhost:3000/admin
   - Click "Withdrawals" tab
   - You should see the pending withdrawal
   - Click "Approve" or "Reject"
   - If approved, user's balance should decrease by $100

### Step 5: Test Deposits
1. **As User:**
   - Go to http://localhost:3000/deposit
   - Submit a deposit request for $500

2. **As Admin:**
   - Go to "Deposits" tab
   - You should see the pending deposit
   - Click "Confirm" or "Reject"
   - If confirmed, user's balance should increase by $500

### Step 6: Test Currency Pairs
1. Go to "Currency Pairs" tab
2. You should see default pairs (BTC/USDT, ETH/USDT, etc.)
3. Try these actions:
   - **Toggle Status**: Turn pairs on/off
   - **Add Pair**: Create a new trading pair
   - **Delete Pair**: Remove a pair
   - **Search**: Filter pairs by name

### Step 7: Test Dashboard
1. Go back to "Dashboard" tab
2. Verify statistics:
   - Total Users: Should match number of registered users
   - Pending Withdrawals: Should show count
   - Pending Deposits: Should show count
   - Recent Activity: Should show latest withdrawals

## Expected Behavior

### ✅ What Should Work
- All registered users appear in admin panel
- User balances update when deposits/withdrawals are approved
- Currency pairs can be added/removed/toggled
- Search and filter functions work
- Statistics update in real-time
- Data persists after page refresh

### ❌ Common Issues

**Issue: Admin panel shows no users**
- **Solution**: Register users first via `/register` or `/login`

**Issue: Balance not updating**
- **Solution**: Make sure to approve/confirm the withdrawal/deposit

**Issue: Can't login to admin**
- **Solution**: Password is `admin123` (case-sensitive)

**Issue: Data disappeared**
- **Solution**: Check if localStorage was cleared. Re-register users.

## Data Verification

### Check localStorage
Open browser DevTools (F12) → Application → Local Storage → http://localhost:3000

You should see two keys:
1. **auth-storage**: Contains all users and current user
2. **admin-storage**: Contains withdrawals, deposits, trades, currency pairs

### Sample Data Structure

**auth-storage:**
```json
{
  "state": {
    "user": { "id": "123", "name": "John", "email": "john@test.com", "balance": 1000 },
    "isAuthenticated": true,
    "allUsers": [
      { "id": "123", "name": "John", "email": "john@test.com", "balance": 1000 },
      { "id": "124", "name": "Jane", "email": "jane@test.com", "balance": 500 }
    ]
  }
}
```

**admin-storage:**
```json
{
  "state": {
    "isAuthenticated": true,
    "withdrawals": [
      { "id": "1", "userId": "123", "userName": "John", "amount": 100, "status": "pending" }
    ],
    "deposits": [],
    "trades": [],
    "currencyPairs": [...]
  }
}
```

## Testing Checklist

- [ ] Register 3+ test users
- [ ] Login to admin panel
- [ ] Verify all users appear in "Manage Users"
- [ ] Fund a user account
- [ ] Edit user details
- [ ] Submit withdrawal as user
- [ ] Approve withdrawal as admin
- [ ] Verify balance decreased
- [ ] Submit deposit as user
- [ ] Confirm deposit as admin
- [ ] Verify balance increased
- [ ] Add new currency pair
- [ ] Toggle currency pair status
- [ ] Delete currency pair
- [ ] Check dashboard statistics
- [ ] Verify data persists after refresh

## Advanced Testing

### Test Multiple Users
1. Open multiple browser windows/incognito tabs
2. Login as different users in each
3. Submit withdrawals/deposits from each
4. Manage all requests from admin panel

### Test Edge Cases
1. Try to withdraw more than balance
2. Submit multiple requests from same user
3. Approve/reject requests in different orders
4. Add duplicate currency pairs
5. Delete user with pending requests

### Performance Testing
1. Add 50+ users
2. Create 100+ withdrawal requests
3. Test search/filter with large datasets
4. Check page load times

## Troubleshooting Commands

### Clear All Data
```javascript
// Run in browser console
localStorage.clear();
location.reload();
```

### View Current User
```javascript
// Run in browser console
JSON.parse(localStorage.getItem('auth-storage'))
```

### View Admin Data
```javascript
// Run in browser console
JSON.parse(localStorage.getItem('admin-storage'))
```

### Reset Admin Password
Edit `toptrades-clone/store/adminStore.ts`:
```typescript
login: (password: string) => {
  const isValid = password === 'YOUR_NEW_PASSWORD';
  // ...
}
```

## Need Help?

If you encounter issues:
1. Check browser console for errors (F12)
2. Verify localStorage data structure
3. Clear localStorage and start fresh
4. Check that dev server is running
5. Review DATA_ARCHITECTURE.md for data flow

## Production Considerations

⚠️ **Important**: This is a demo app using localStorage. For production:
- Implement a real database (PostgreSQL, MongoDB, etc.)
- Add proper authentication (JWT, OAuth, etc.)
- Implement API endpoints for CRUD operations
- Add input validation and sanitization
- Implement rate limiting
- Add audit logs
- Use environment variables for sensitive data
- Implement proper error handling
- Add data backup mechanisms
