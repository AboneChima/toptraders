# TopTrades Clone - Crypto Trading Platform

A modern, responsive cryptocurrency trading platform built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- 🎨 Pixel-perfect UI matching the reference design
- 📱 Fully responsive (Mobile, Tablet, Desktop)
- 🔐 Email/Password authentication (replaces wallet connection)
- ⚡ Smooth animations with Framer Motion
- 🎯 Market data display with tabs (USDT, Web3, NFT)
- 💼 Action buttons (Deposit, Withdraw, Assets, Applications)
- 🌙 Dark theme with modern aesthetics

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd toptrades-clone
```

2. Install dependencies (already done):
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
toptrades-clone/
├── app/
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── forgot-password/    # Password reset page
│   ├── deposit/            # Deposit page
│   ├── withdraw/           # Withdraw page
│   ├── assets/             # Assets page
│   ├── applications/       # Applications page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
├── components/
│   ├── Header.tsx          # Status bar header
│   ├── HeroSection.tsx     # Hero with crypto illustration
│   ├── ActionButtons.tsx   # Main action buttons
│   ├── MarketSection.tsx   # Market data with tabs
│   └── ConnectButton.tsx   # Connect/Login button
├── store/
│   └── authStore.ts        # Zustand auth store
└── tailwind.config.ts      # Tailwind configuration
```

## Pages

- **/** - Homepage with hero, action buttons, and market data
- **/login** - Email/password login
- **/register** - User registration
- **/forgot-password** - Password reset
- **/deposit** - Deposit funds (placeholder)
- **/withdraw** - Withdraw funds (placeholder)
- **/assets** - View assets (placeholder)
- **/applications** - Applications (placeholder)

## Key Components

### HeroSection
- Animated crypto illustration with coins and bars
- Main headline and trust indicators
- Smooth entrance animations

### ActionButtons
- Four main actions: Deposit, Withdraw, Assets, Applications
- Hover and tap animations
- Navigation to respective pages

### MarketSection
- Tabbed interface (USDT, Web3, NFT)
- Market pair listings with prices
- Color-coded percentage changes
- Smooth tab transitions

## Authentication

The platform uses email/password authentication instead of crypto wallet connection:
- Login with email and password
- Registration with validation
- Password reset functionality
- Session persistence with Zustand

## Responsive Design

The application is fully responsive across all breakpoints:
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

## Build for Production

```bash
npm run build
npm start
```

## Development

```bash
npm run dev
```

## Customization

### Colors
Edit `tailwind.config.ts` to customize the color scheme.

### Market Data
Update `components/MarketSection.tsx` to add/modify market pairs.

### Animations
Adjust Framer Motion settings in component files for different animation effects.

## Notes

- This is a frontend clone with mock data
- Authentication is simulated (no backend)
- Market data is static (can be connected to real APIs)
- All placeholder pages are ready for implementation

## License

MIT
