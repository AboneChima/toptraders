# Vercel Deployment Guide with Prisma Postgres

## Setup Prisma Postgres Database

### 1. Get Database Connection Strings

You already created a Prisma Postgres database. Now get the connection strings:

1. Go to your Prisma Postgres dashboard
2. Copy both connection strings:
   - `DATABASE_URL` (Accelerate connection - starts with `prisma://`)
   - `DIRECT_URL` (Direct connection - starts with `postgresql://`)

### 2. Add Environment Variables to Vercel

1. Go to Vercel dashboard: https://vercel.com/dashboard
2. Select your project: `toptraders`
3. Go to Settings → Environment Variables
4. Add these variables:
   - `DATABASE_URL` = your Prisma Accelerate URL
   - `DIRECT_URL` = your direct PostgreSQL URL

### 3. Push Database Schema

Run this command locally (make sure you have the env vars in `.env.local`):
```bash
npx prisma db push
```

This will create all the tables in your database.

### 4. Deploy to Vercel

```bash
git add .
git commit -m "Switch to Prisma Postgres"
git push
```

Vercel will automatically deploy.

### 5. Test the API

After deployment:

- Test connection: `GET https://toptraders-p6s4.vercel.app/api/init-db`
- Register: `POST https://toptraders-p6s4.vercel.app/api/auth/register`
  ```json
  {
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- Login: `POST https://toptraders-p6s4.vercel.app/api/auth/login`
- Get Users: `GET https://toptraders-p6s4.vercel.app/api/users`

## Current Status

✅ Prisma Postgres database created
✅ Code updated to use Prisma Client
✅ API routes converted to Prisma
✅ Fixed Decimal type serialization in API responses
✅ Admin panel fetches from database
✅ Balance persistence fixed
✅ Real-time syncing implemented
✅ Database schema pushed
✅ Deployed to Vercel

## Recent Fixes

- Fixed `balance.toFixed is not a function` error
- All API routes now convert Prisma Decimal types to numbers
- Admin panel properly displays user balances
- Routes fixed: `/api/users`, `/api/users/[id]/balance`, `/api/auth/login`, `/api/auth/register`

## What Changed

- Removed `@vercel/postgres` package
- Added `@prisma/client` and `prisma`
- Created Prisma schema with all tables
- Updated all API routes to use Prisma
- Added Prisma generate to build script
- Added Decimal to number conversion for JSON serialization
