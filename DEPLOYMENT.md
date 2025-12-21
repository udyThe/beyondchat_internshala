# Deployment Checklist

## Pre-Deployment Verification

### ✅ Environment Variables
- [x] Backend `.env` file created from `.env.example`
- [x] Frontend `.env` file created from `.env.example`
- [x] NodeJS script `.env` file created from `.env.example`
- [x] All `.env` files listed in `.gitignore`
- [x] All `.env.example` files committed to repository

### ✅ Configuration Files
- [x] No hardcoded URLs in source code
- [x] All URLs use environment variables
- [x] Port configuration externalized
- [x] Database path configurable via environment
- [x] User agents configurable for scraping

### ✅ Dependencies
- [x] All `package.json` files have correct dependencies
- [x] Python requirements documented
- [x] `dotenv` package installed in backend
- [x] No missing dependencies

### ✅ Code Quality
- [x] No console errors
- [x] API endpoints tested and working
- [x] Database migrations handled
- [x] Error handling implemented
- [x] CORS properly configured

## Backend API Deployment

### Option 1: Render.com (Recommended)
1. Create account at https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - **Name**: beyondchats-api
   - **Root Directory**: `laravel-api`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     NODE_ENV=production
     PORT=8000 (set by Render automatically)
     ```
5. Click "Create Web Service"
6. Note the deployed URL (e.g., `https://beyondchats-api.onrender.com`)

### Option 2: Railway.app
1. Create account at https://railway.app
2. New Project → Deploy from GitHub
3. Select repository
4. Set root directory: `laravel-api`
5. Add environment variables (same as above)
6. Deploy

### Option 3: Heroku
```bash
cd laravel-api
heroku create beyondchats-api
git subtree push --prefix laravel-api heroku main
```

## Frontend Deployment

### Option 1: Vercel (Recommended)
```bash
cd reactjs-frontend

# Update .env.production with deployed API URL
echo "VITE_API_URL=https://your-api-url.com" > .env.production

# Deploy
npm install -g vercel
vercel --prod
```

Or via Vercel Dashboard:
1. Import project from GitHub
2. Set root directory: `reactjs-frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variable:
   - `VITE_API_URL=https://your-api-url.com`

### Option 2: Netlify
1. Connect GitHub repository
2. Configure:
   - **Base directory**: `reactjs-frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Environment variables**:
     ```
     VITE_API_URL=https://your-api-url.com
     ```

## NodeJS Enhancement Script

**Note**: This script is designed to run manually or via cron/scheduled task.

### Local Execution
```bash
cd nodejs-script
# Ensure .env has correct API_BASE_URL pointing to deployed backend
node demo-enhancement.js
```

### Scheduled Execution (Optional)
**On Linux/Mac (cron)**:
```bash
0 */6 * * * cd /path/to/nodejs-script && node demo-enhancement.js >> /var/log/enhancement.log 2>&1
```

**On Render/Railway**:
Create a separate "Cron Job" service that runs the script periodically.

## Post-Deployment Testing

### Backend API
```bash
# Test health endpoint
curl https://your-api-url.com

# Test articles endpoint
curl https://your-api-url.com/articles

# Test create article
curl -X POST https://your-api-url.com/articles \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Test content"}'
```

### Frontend
1. Visit deployed URL
2. Check all pages load:
   - Home (/)
   - Original Articles (/original)
   - Optimized Articles (/optimized)
   - Article Detail (/article/:id)
3. Verify articles display correctly
4. Check responsive design on mobile

### Enhancement Script
```bash
# From local machine pointing to production API
API_BASE_URL=https://your-api-url.com node demo-enhancement.js
```

## Environment Variables Reference

### Backend (`laravel-api/.env`)
```env
APP_NAME="BeyondChats Article Manager"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-api-url.com

PORT=8000

DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

### Frontend (`reactjs-frontend/.env.production`)
```env
VITE_API_URL=https://your-api-url.com
```

### Enhancement Script (`nodejs-script/.env`)
```env
API_BASE_URL=https://your-api-url.com
OPENAI_API_KEY=sk-xxxxxxxxxxxxx  # Optional - demo mode works without it
USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
```

## Database Management

**Important**: The SQLite database file is created automatically on first run.

- Locally: `laravel-api/database/database.sqlite`
- On cloud platforms: Persists in the deployment volume

**Backup**:
```bash
# Download database from server
scp user@server:/path/to/database.sqlite ./backup.sqlite

# Restore
scp ./backup.sqlite user@server:/path/to/database.sqlite
```

## Troubleshooting

### Frontend Can't Connect to API
- Check `VITE_API_URL` environment variable
- Verify CORS is enabled in backend (`cors()` middleware)
- Check backend is accessible publicly

### Backend Database Issues
- Ensure `database/` directory exists and is writable
- Check SQLite is available on the deployment platform
- Verify database file path in `.env`

### Enhancement Script Fails
- Confirm `API_BASE_URL` points to deployed backend
- Check API is returning valid responses
- Verify network connectivity
- Review error logs

## Security Checklist

- [ ] All `.env` files excluded from git
- [ ] API keys not exposed in frontend
- [ ] CORS properly configured (not `*` in production)
- [ ] Database file not publicly accessible
- [ ] Error messages don't expose sensitive info
- [ ] HTTPS enabled on deployed URLs
- [ ] Environment set to `production`

## Monitoring (Optional)

### Backend Monitoring
- Use Render/Railway built-in logs
- Set up Sentry for error tracking
- Monitor API response times

### Frontend Monitoring  
- Use Vercel/Netlify analytics
- Set up Google Analytics
- Monitor Core Web Vitals

## Cost Estimates (Free Tiers)

| Service | Free Tier Limits | Paid Starts At |
|---------|------------------|----------------|
| Render  | 750 hours/month  | $7/month       |
| Railway | $5 credit/month  | Pay-as-you-go  |
| Vercel  | Unlimited        | $20/month (Pro)|
| Netlify | 100GB bandwidth  | $19/month      |

## Success Criteria

- [ ] Backend API accessible at public URL
- [ ] Frontend loads and displays articles
- [ ] All 5 original articles visible
- [ ] All 5 enhanced articles visible with references
- [ ] Detail pages work for both original and enhanced
- [ ] Mobile responsive design works
- [ ] No console errors
- [ ] API response time < 2 seconds
- [ ] Frontend load time < 3 seconds

---

## Quick Deploy Commands

### 1. Backend
```bash
cd laravel-api
git add .
git commit -m "Ready for production"
git push origin main
# Then deploy via Render dashboard
```

### 2. Frontend
```bash
cd reactjs-frontend
echo "VITE_API_URL=https://your-api-url.com" > .env.production
vercel --prod
```

### 3. Test
```bash
curl https://your-api-url.com/articles
open https://your-frontend-url.com
```

---

**Last Updated**: December 21, 2025
**Status**: ✅ Ready for Deployment
