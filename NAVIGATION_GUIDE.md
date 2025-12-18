# TopTrades Navigation Guide

## 🚀 How to Access Different Pages

### User Dashboard Pages

All user pages are accessible via the **Hamburger Menu (☰)** located at:
- **Homepage**: Top-left corner
- **All other pages**: Top-right corner

#### Available Pages:
1. **Home** - `/` - Main landing page
2. **My Assets** - `/assets` - Portfolio management
3. **Mining/Staking** - `/staking` - Staking pools
4. **Trade** - `/trade` - Trading interface
5. **Referral** - `/referral` - Referral program
6. **Financial Records** - `/records` - Transaction history
7. **Knowledge** - `/knowledge` - Educational content
8. **About Us** - `/about` - Company information

### 🔐 Admin Panel Access

There are **3 ways** to access the admin panel:

#### Method 1: Direct URL (Easiest)
Simply navigate to: `http://localhost:3000/admin`

#### Method 2: Footer Link
1. Scroll to the bottom of the homepage
2. Click on "Admin Panel" link in the footer

#### Method 3: Side Menu (For Admin Users)
1. Login with admin credentials (email: `admin@toptrades.info`)
2. Open the hamburger menu
3. Look for "Admin Panel" button at the bottom (blue highlighted)

## 📱 Admin Panel Features

Once in the admin panel (`/admin`), you can:

### Dashboard
- View total payments
- See total users count
- Check pending tickets
- Monitor online users

### User Management
- View all users
- Add new users
- Edit user details
- Check user balances
- Manage user status

### Currency Pairs
- Create new trading pairs
- Enable/disable pairs
- Edit pair settings
- Delete pairs

### Withdrawals
- View withdrawal requests
- Approve/reject withdrawals
- Monitor withdrawal history

### Deposits
- View deposit history
- Track user deposits
- Manage deposit requests

## 🎨 Page Themes

### User Pages
- **Theme**: Dark mode with Apple glassmorphism
- **Colors**: Black background, white text, subtle gradients
- **Design**: Modern, clean, mobile-first

### Admin Panel
- **Theme**: Professional light theme
- **Colors**: Blue sidebar, white content area
- **Design**: Desktop/tablet optimized with collapsible sidebar

## 🔧 Development Access

### Current Server
- **URL**: `http://localhost:3000`
- **Admin Panel**: `http://localhost:3000/admin`

### Quick Links
```
User Dashboard:
- Homepage: http://localhost:3000
- Assets: http://localhost:3000/assets
- Trading: http://localhost:3000/trade
- Staking: http://localhost:3000/staking
- Referral: http://localhost:3000/referral
- Records: http://localhost:3000/records
- Knowledge: http://localhost:3000/knowledge
- About: http://localhost:3000/about

Admin Panel:
- Dashboard: http://localhost:3000/admin
```

## 📝 Notes

1. **Financial Records** page is located at `/records` (not `/financial-records`)
2. **Admin Panel** is fully responsive for laptop, iPad, and tablets
3. **Sidebar** in admin panel can be collapsed using the menu button
4. All **user pages** have dark theme with proper text visibility
5. **Hamburger menu** is available on all pages for easy navigation

## 🎯 Testing Checklist

- [x] Homepage loads correctly
- [x] Hamburger menu opens on all pages
- [x] All user pages accessible via menu
- [x] Admin panel accessible via URL
- [x] Admin panel accessible via footer
- [x] Financial records page works
- [x] All pages have proper dark theme
- [x] Text is visible on all pages
- [x] Admin panel sidebar is collapsible

## 🚨 Troubleshooting

**Can't find Financial Records?**
- Use the hamburger menu (☰)
- Click "Financial Records"
- Or navigate to: `http://localhost:3000/records`

**Can't access Admin Panel?**
- Go directly to: `http://localhost:3000/admin`
- Or click "Admin Panel" link in the footer
- No login required for development

**Page not loading?**
- Check if server is running: `npm run dev`
- Clear browser cache
- Check console for errors
