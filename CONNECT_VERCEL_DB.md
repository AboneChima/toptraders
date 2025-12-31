# Connect to Vercel Postgres Database

## Step 1: Connect Database to Project

1. Go to https://vercel.com/dashboard
2. Click your `toptraders` project
3. Click **Storage** tab
4. Click **Connect Database**
5. Select your existing `toptrader.db` database
6. When asked for prefix: **Leave it blank** or use `POSTGRES_`
7. Click **Connect**

## Step 2: Get Environment Variables

After connecting, Vercel will automatically add these variables to your project:
- `POSTGRES_PRISMA_URL` (for DATABASE_URL)
- `POSTGRES_URL_NON_POOLING` (for DIRECT_URL)

## Step 3: Add Prisma-Specific Variables

Go to Settings → Environment Variables and add:

**Variable 1:**
- Name: `DATABASE_URL`
- Value: Reference → Select `POSTGRES_PRISMA_URL`

**Variable 2:**
- Name: `DIRECT_URL`
- Value: Reference → Select `POSTGRES_URL_NON_POOLING`

## Step 4: Update Local Environment

After connecting on Vercel, copy the connection strings and update your local `.env.local`:

```
DATABASE_URL="[copy from Vercel POSTGRES_PRISMA_URL]"
DIRECT_URL="[copy from Vercel POSTGRES_URL_NON_POOLING]"
```

## Step 5: Push Database Schema

Run locally:
```bash
npx prisma db push
```

This creates all tables in your Vercel database.

## Step 6: Redeploy

The database is now connected! Redeploy your site:
- Go to Deployments tab
- Click ... on latest deployment
- Click Redeploy

## Done!

Your site will now use the Vercel Postgres database and everything should work.
