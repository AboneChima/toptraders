# Clean Up Duplicate Currency Pairs

If you're seeing console errors about duplicate keys (e.g., "Encountered two children with the same key, `BTC/USDT`"), follow these steps to clean up your data:

## Quick Fix (Recommended)

### Option 1: Use Browser Console
1. Open your browser DevTools (Press F12)
2. Go to the Console tab
3. Paste this code and press Enter:

```javascript
// Get the admin store data
const adminData = JSON.parse(localStorage.getItem('admin-storage'));

if (adminData && adminData.state && adminData.state.currencyPairs) {
  const pairs = adminData.state.currencyPairs;
  const seen = new Map();
  const uniquePairs = [];
  
  // Keep only first occurrence of each pair
  pairs.forEach(pair => {
    if (!seen.has(pair.name)) {
      seen.set(pair.name, true);
      uniquePairs.push(pair);
    }
  });
  
  console.log(`Found ${pairs.length} pairs, keeping ${uniquePairs.length} unique pairs`);
  console.log(`Removed ${pairs.length - uniquePairs.length} duplicates`);
  
  // Update the store
  adminData.state.currencyPairs = uniquePairs;
  localStorage.setItem('admin-storage', JSON.stringify(adminData));
  
  console.log('✅ Duplicates removed! Please refresh the page.');
}
```

4. Refresh the page (F5)
5. The duplicate key errors should be gone

### Option 2: Clear and Reinitialize
1. Open DevTools (F12) → Console
2. Run this command:

```javascript
localStorage.removeItem('admin-storage');
location.reload();
```

3. The app will automatically reinitialize with clean data
4. Note: This will remove all admin data (withdrawals, deposits, trades)

## Why This Happened

The duplicate currency pairs were created because:
1. The `StoreInitializer` component ran multiple times
2. Each time it added the default pairs without checking for duplicates
3. This has now been fixed in the code

## Prevention

The following fixes have been implemented to prevent future duplicates:

1. **Global Initialization Flag**: Prevents multiple initializations
2. **Duplicate Check in addCurrencyPair**: Skips adding if pair already exists
3. **Automatic Cleanup**: Removes duplicates on app startup
4. **Unique IDs**: Uses timestamp + random string for truly unique IDs

## Verify the Fix

After cleaning up, verify by:

1. Open DevTools (F12) → Console
2. Run this command:

```javascript
const adminData = JSON.parse(localStorage.getItem('admin-storage'));
const pairs = adminData?.state?.currencyPairs || [];
const names = pairs.map(p => p.name);
const uniqueNames = [...new Set(names)];
console.log(`Total pairs: ${pairs.length}`);
console.log(`Unique pairs: ${uniqueNames.length}`);
console.log(`Duplicates: ${pairs.length - uniqueNames.length}`);
```

3. If "Duplicates: 0", you're all set! ✅

## Manual Cleanup (Advanced)

If you want to manually inspect and clean the data:

1. Open DevTools (F12) → Application → Local Storage → http://localhost:3000
2. Click on `admin-storage`
3. Copy the value
4. Paste into a JSON formatter/editor
5. Find the `currencyPairs` array
6. Remove duplicate entries (keep only one of each pair name)
7. Paste the cleaned JSON back
8. Refresh the page

## Still Having Issues?

If duplicates persist:

1. **Clear all data and start fresh:**
```javascript
localStorage.clear();
location.reload();
```

2. **Check for multiple StoreInitializer components:**
   - Search your code for `<StoreInitializer />`
   - Should only appear once in `ClientLayout.tsx`

3. **Verify the fix is applied:**
   - Check `components/StoreInitializer.tsx` has the `isInitialized` flag
   - Check `store/adminStore.ts` has the duplicate check in `addCurrencyPair`

## Need Help?

If you continue to see duplicate key errors:
1. Check browser console for specific error messages
2. Verify localStorage data structure
3. Try clearing localStorage completely
4. Check that you're running the latest code version
