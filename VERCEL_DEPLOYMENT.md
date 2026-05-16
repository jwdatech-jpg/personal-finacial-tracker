# 🚀 Full-Stack Vercel Deployment Guide

Deploy your entire Personal Financial Tracker (Frontend + Backend) to Vercel.

## ✅ Prerequisites

- [ ] Code pushed to GitHub (main branch)
- [ ] Vercel account (sign up at https://vercel.com)
- [ ] PostgreSQL database (recommended: Vercel Postgres, Neon, or PlanetScale)

---

## 📋 Step 1: Set Up Database

Choose ONE of these options:

### Option A: Vercel Postgres (Recommended if using Vercel Hobby/Pro)
1. Go to **https://vercel.com/dashboard**
2. Select your project (after importing in Step 2)
3. Go to **Storage** → **Create Database** → **Postgres**
4. Copy the connection string to use in Step 3

### Option B: Neon (Free tier available)
1. Go to **https://neon.tech**
2. Sign up and create a new project
3. Copy your database connection string (PostgreSQL)

### Option C: PlanetScale (Free tier available)
1. Go to **https://planetscale.com**
2. Create account and new database
3. Copy the connection string

---

## 🚀 Step 2: Deploy to Vercel

### 2.1 Import Repository

1. Go to **https://vercel.com/new**
2. Click **"Import Project"**
3. Paste your GitHub repository URL or select it from the list
4. Click **"Import"**

### 2.2 Configure Project Settings

**Root Directory**: Leave as `.` (root) - Vercel will auto-detect both client and server

**Build Command**: Keep default (Vercel uses `vercel.json`)

**Output Directory**: Keep default

**Environment Variables** - Add these:

| Name | Value | Notes |
|------|-------|-------|
| `DATABASE_URL` | Your PostgreSQL connection string | From Step 1 |
| `JWT_SECRET` | Generate with: `openssl rand -base64 32` | Keep it secret! |
| `NODE_ENV` | `production` | |
| `PRISMA_SKIP_VALIDATION_WARNING` | `1` | Optional, suppresses warnings |

### 2.3 Deploy

Click **"Deploy"** and wait for completion (2-5 minutes)

Your app URL: `https://your-project.vercel.app`

---

## 🗄️ Step 3: Initialize Database

### 3.1 Run Migrations

After deployment completes:

1. Go to **Vercel Dashboard** → **Your Project**
2. Open the **Deployments** tab
3. Click on the latest successful deployment
4. Copy the deployment URL

### 3.2 Run Prisma Migrations

In your local terminal:

```bash
cd server
npx prisma migrate deploy --skip-generate
```

OR use Vercel CLI:

```bash
vercel env pull
npx prisma migrate deploy
```

### 3.3 Seed Database (Optional)

```bash
cd server
npx prisma db seed
```

---

## ✅ Testing

### Test Frontend
- Open your Vercel URL: `https://your-project.vercel.app`
- Try logging in / registering

### Test Backend
- API health check: `https://your-project.vercel.app/api/health`
- Should return: `{"status":"ok","timestamp":"..."}`

### Test API Connection
- Open browser DevTools (F12)
- Go to **Network** tab
- Perform an action (login, create account, etc.)
- Check that API calls go to `/api/...`

---

## 🔧 Environment Variables Reference

### Frontend (Client)
- `VITE_API_URL=/api` (relative path, auto-set by Vercel)

### Backend (Server)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Your JWT signing key
- `NODE_ENV=production`
- `CLIENT_URL` - Your frontend URL (optional, CORS auto-handled)

---

## 🐛 Troubleshooting

### 500 Error on API Calls
- Check `DATABASE_URL` is set correctly in Vercel
- Ensure migrations have run: `npx prisma migrate deploy`
- Check Vercel logs: **Deployments** → **View Logs**

### Database Connection Error
- Test connection string locally first
- Ensure your database is accessible from internet (not local)
- Check IP whitelisting if required by your DB provider

### CORS Errors
- Vercel automatically handles CORS
- If issues persist, add `CLIENT_URL` environment variable

### Migrations Failed
```bash
# Reset and retry
npx prisma migrate reset
npx prisma migrate deploy
```

---

## 📚 Resources

- [Vercel Docs - Serverless Functions](https://vercel.com/docs/functions)
- [Prisma - Deploy Guide](https://www.prisma.io/docs/guides/deployment)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)

---

## ✨ What's Included

- **Frontend**: React + Vite, deployed as static + serverless
- **Backend**: Express.js API running as Vercel serverless functions
- **Database**: PostgreSQL (your choice of provider)
- **Auto-CORS**: Configured to work with Vercel domains
- **Health Checks**: Built-in API health endpoint

---

## 🎉 You're Done!

Your full-stack app is now live on Vercel!

- **Frontend**: https://your-project.vercel.app
- **API**: https://your-project.vercel.app/api

