# Vercel Deployment Guide

## Setup Vercel Postgres Database

### 1. Create Vercel Postgres Database

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project: `toptraders`
3. Go to the "Storage" tab
4. Click "Create Database"
5. Select "Postgres"
6. Choose a name: `toptraders-db`
7. Select region (choose closest to your users)
8. Click "Create"

### 2. Connect Database to Project

Vercel will automatically add these environment variables to your project:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### 3. Initialize Database Tables

After deployment, visit this URL to create the tables:
```
https://your-app.vercel.app/api/init-db
```

You should see: `{"message":"Database initialized successfully"}`

### 4. Test the API

- Register: `POST https://your-app.vercel.app/api/auth/register`
- Login: `POST https://your-app.vercel.app/api/auth/login`
- Get Users: `GET https://your-app.vercel.app/api/users`

## Current Status

✅ Frontend deployed on Vercel (using localStorage)
✅ API routes created
⏳ Need to add Vercel Postgres database
⏳ Need to update frontend to use API instead of localStorage

## Next Steps

1. Add Vercel Postgres database (follow steps above)
2. Visit `/api/init-db` to create tables
3. Update frontend auth to use API endpoints
4. Deploy and test!
