# Deployment Guide

This guide covers deploying the Personal Financial Tracker to GitHub and Vercel.

## 📤 Step 1: Prepare for GitHub

### 1.1 Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `personal-financial-tracker`
3. Description: "A modern personal finance management app with bilingual support"
4. Choose **Public** to make it public
5. Add `.gitignore` and `LICENSE` (MIT)
6. Create repository

### 1.2 Initialize Local Git Repository

```bash
cd personal-financial-tracker

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Personal Financial Tracker"

# Add remote repository
git remote add origin https://github.com/yourusername/personal-financial-tracker.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 1.3 Verify on GitHub

- Visit your repository: `https://github.com/yourusername/personal-financial-tracker`
- Verify all files are pushed
- Check that README.md displays correctly

## 🚀 Step 2: Deploy Frontend to Vercel

### 2.1 Connect Vercel to GitHub

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in with GitHub
3. Click **"New Project"**
4. Import your GitHub repository
5. Select `personal-financial-tracker` repository

### 2.2 Configure Vercel Project

#### Root Directory
- Set **Root Directory** to `client/`

#### Environment Variables
Add these in Vercel Project Settings > Environment Variables:

```
VITE_API_URL=https://your-backend-url.com/api
```

**Note**: Replace `your-backend-url.com` with your backend server URL after deployment.

#### Build Settings
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 2.3 Deploy

1. Click **"Deploy"**
2. Wait for build to complete
3. Once deployed, your frontend URL will be: `https://your-project-name.vercel.app`

### 2.4 Custom Domain (Optional)

1. Go to Project Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## 🖥️ Step 3: Deploy Backend

Choose one of the following options:

### Option A: Railway.app (Recommended - Easy)

1. **Sign up** at [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. **Select repository** and authorize Railway
4. **Select `server` directory**
5. **Add PostgreSQL database**:
   - Right-click canvas → **Database** → **PostgreSQL**
6. **Environment Variables**:
   - `DATABASE_URL` - Auto-filled by Railway
   - `JWT_SECRET` - Generate: `openssl rand -base64 32`
   - `NODE_ENV` - Set to `production`
7. **Deploy** - Railway will automatically deploy on git push

Railway provides a public URL like: `https://your-app.railway.app`

### Option B: Render.com

1. **Sign up** at [render.com](https://render.com)
2. **New** → **Web Service**
3. **Connect GitHub** and select repository
4. **Configure**:
   - Name: `financial-tracker-api`
   - Root Directory: `server`
   - Build Command: `npm install && npx prisma migrate deploy`
   - Start Command: `npm start`
5. **Add PostgreSQL**:
   - Create new PostgreSQL instance
   - Copy connection string to `DATABASE_URL`
6. **Environment Variables**:
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=<your-secret>
   NODE_ENV=production
   ```
7. **Deploy**

### Option C: Heroku (Legacy - May Charge)

1. **Sign up** at [heroku.com](https://heroku.com)
2. **Create New App**
3. **Connect GitHub** repository
4. **Add Heroku Postgres** database
5. **Set Config Vars**:
   ```
   DATABASE_URL=<auto-filled>
   JWT_SECRET=<your-secret>
   NODE_ENV=production
   ```
6. **Deploy**

### Option D: DigitalOcean App Platform

1. **Sign up** at [digitalocean.com](https://digitalocean.com)
2. **Create** → **Apps** → **GitHub**
3. **Select repository** and authorize
4. **Configure**:
   - Source Repo → main branch
   - HTTP Port: 5000
5. **Add PostgreSQL Database**
6. **Environment Variables** (auto-linked from database)
7. **Deploy**

## 📋 Step 4: Update Environment Variables

After deploying backend, update Vercel frontend environment variables:

1. Go to **Vercel Project Settings** > **Environment Variables**
2. Update `VITE_API_URL` to your backend URL:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```
3. **Redeploy** frontend:
   - Go to **Deployments**
   - Click **"Redeploy"** on latest deployment
   - Or push a commit to trigger automatic redeploy

## 🔒 Security Checklist

- [ ] JWT_SECRET is strong and random
- [ ] DATABASE_URL uses strong password
- [ ] Environment variables not committed to git
- [ ] CORS configured correctly in backend
- [ ] API endpoints validated and sanitized
- [ ] Password hashing with bcryptjs
- [ ] HTTPS enforced

## 📊 Post-Deployment Verification

1. **Frontend**: 
   - Visit `https://your-project-name.vercel.app`
   - Test login with demo credentials
   - Verify language toggle works
   - Check all pages load correctly

2. **Backend API**:
   - Test `/api/auth/login` endpoint
   - Verify database connection
   - Check CORS headers

3. **Database**:
   - Verify migrations ran successfully
   - Check seed data loaded
   - Monitor database metrics

## 🚨 Troubleshooting

### Build Fails on Vercel

**Error**: `Cannot find module 'vite'`
- **Solution**: Ensure `package.json` and `package-lock.json` are in `client/` directory
- Clear Vercel cache: Settings → Storage → Clear Cache

### API Connection Error

**Error**: `Cannot reach backend API`
- **Solution**: Update `VITE_API_URL` environment variable in Vercel
- Redeploy frontend after updating
- Verify backend URL is accessible

### Database Migration Error

**Error**: `Prisma migration failed`
- **Solution**: Run locally first:
  ```bash
  npx prisma migrate resolve --rolled-back <migration-name>
  npx prisma migrate deploy
  ```

### CORS Issues

**Error**: `Access to XMLHttpRequest blocked by CORS`
- **Solution**: Update `server/src/index.js`:
  ```javascript
  const cors = require('cors');
  app.use(cors({
    origin: 'https://your-vercel-url.vercel.app',
    credentials: true
  }));
  ```

## 📈 Monitoring & Maintenance

- Monitor Vercel analytics in dashboard
- Check backend server logs
- Monitor database performance
- Set up error tracking (Sentry recommended)
- Regular backups of database

## 🔄 Continuous Deployment

Both Vercel and your backend service support automatic deployment:

- **Push to main branch** → Auto-deploy
- **GitHub Actions** → Optional CI/CD pipeline
- **Automated tests** → Pre-deployment validation

## 📞 Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deploy)

---

**Deployment completed!** Your Personal Financial Tracker is now live and accessible to the world. 🎉
