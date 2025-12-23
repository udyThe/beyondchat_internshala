# BeyondChats Article Manager

A full-stack application that scrapes articles, optimizes them using AI, and displays them in a beautiful React frontend.

## � Live Demo

> **Frontend Live Link**: [View Deployed Application](#deployment-instructions)  
> **API Documentation**: [Backend API Endpoints](#-api-endpoints)  
> **GitHub Repository**: [Source Code](https://github.com/yourusername/beyondchat_internshala)

**Note**: After deployment, update the live links above with your actual deployed URLs.

### Quick Links
- 📱 [View Original Articles](#) - Browse articles scraped from BeyondChats
- 🤖 [View Optimized Articles](#) - See AI-enhanced versions
- 📊 [Compare Versions](#) - Side-by-side comparison

---

## �🏗️ Architecture

```
┌─────────────────────┐
│  Web Scraper        │
│  (Python)           │
│  - Scrapes articles │
│  - Extracts content │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  API Server         │
│  (Node.js/Express)  │
│  - SQLite Database  │
│  - CRUD Operations  │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌─────────┐ ┌──────────────────┐
│ NodeJS  │ │  React Frontend  │
│ Script  │ │  (Vite)          │
│         │ │  - Article List  │
│ - Google│ │  - Detail View   │
│   Search│ │  - Responsive UI │
│ - Scrape│ └──────────────────┘
│ - LLM   │
│ - Update│
└─────────┘
```

## 📊 Data Flow

1. **Scraping Phase**: Python script scrapes 5 oldest articles from BeyondChats blogs
2. **Storage Phase**: Articles are stored in SQLite database via API
3. **Optimization Phase**: Node.js script:
   - Fetches latest article from API
   - Searches Google for the article title
   - Scrapes top 2 ranking articles
   - Uses LLM (OpenAI) to optimize the article
   - Publishes optimized version back to API
4. **Display Phase**: React frontend displays both original and optimized articles

## 🚀 Local Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Python 3.x (for initial scraping)

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd beyondchat_internshala
```

### Step 2: Set Up API Server

```bash
cd laravel-api

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env if needed (default values work for local development)
# PORT=8000 (optional, defaults to 8000)

# Run the seeder to populate database with scraped articles
npm run seed

# Start the API server
npm start
```

The API server will be running on `http://localhost:8000`

### Step 3: Set Up Node.js Optimization Script

```bash
cd ../nodejs-script

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your OpenAI API key (optional but recommended)
# OPENAI_API_KEY=your_openai_api_key_here

# Run the script to optimize an article
npm start
```

**Note**: If you don't have an OpenAI API key, the script will use mock optimization. To get a real API key:
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add it to the `.env` file

### Step 4: Set Up React Frontend

```bash
cd ../reactjs-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env if needed
# VITE_API_URL=http://localhost:8000
# VITE_PORT=3000 (change if port 3000 is in use)

# Start the development server
npm run dev
```

The frontend will be running on `http://localhost:3000` (or the port specified in .env)

### Step 5: Run the Initial Scraper (Optional)

If you want to scrape new articles:

```bash
cd ..

# Install Python dependencies
pip install requests beautifulsoup4

# Run the scraper
python3 scraper.py
```

## 📁 Project Structure

```
beyondchat_internshala/
├── laravel-api/           # Backend API (Node.js/Express)
│   ├── server.js          # Main API server
│   ├── database.js        # Database connection and queries
│   ├── seed.js            # Database seeder
│   ├── package.json
│   └── database/
│       └── database.sqlite
│
├── nodejs-script/         # Article optimization script
│   ├── index.js           # Main script orchestrator
│   ├── apiClient.js       # API client for backend
│   ├── googleSearch.js    # Google search and scraping
│   ├── articleOptimizer.js # LLM integration
│   ├── .env               # Environment variables
│   └── package.json
│
├── reactjs-frontend/      # React frontend
│   ├── src/
│   │   ├── App.jsx        # Main app component
│   │   ├── api.js         # API service
│   │   ├── components/
│   │   │   ├── ArticleList.jsx
│   │   │   └── ArticleDetail.jsx
│   │   └── index.css      # Styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── scraper.py             # Initial web scraper (Python)
├── scraped_articles.json  # Scraped articles data
└── README.md              # This file
```

## 🎯 Features

### Phase 1: Web Scraping & API (✅ Complete)
- ✅ Scrapes 5 oldest articles from BeyondChats blogs
- ✅ Stores articles in SQLite database
- ✅ RESTful CRUD API with Express.js
- ✅ Endpoints for articles management

### Phase 2: AI Optimization (✅ Complete)
- ✅ Fetches latest article from API
- ✅ Searches Google for article title
- ✅ Scrapes top 2 ranking articles
- ✅ Uses OpenAI GPT to optimize content
- ✅ Publishes optimized article with references
- ✅ Fallback to mock optimization if no API key

### Phase 3: React Frontend (✅ Complete)
- ✅ Professional, responsive UI
- ✅ Article listing with filters
- ✅ Detailed article view
- ✅ Shows both original and optimized versions
- ✅ Markdown rendering
- ✅ Mobile-friendly design

## 🔌 API Endpoints

```
GET    /                    - API documentation
GET    /articles            - Get all articles
GET    /articles/latest     - Get latest unupdated article
GET    /articles/:id        - Get article by ID
POST   /articles            - Create new article
PUT    /articles/:id        - Update article
DELETE /articles/:id        - Delete article
```

## 🧪 Testing the Workflow

1. **Start the API server**: `cd laravel-api && npm start`
2. **Visit API docs**: Open http://localhost:8000 in browser
3. **Check articles**: http://localhost:8000/articles
4. **Run optimization script**: `cd nodejs-script && npm start`
5. **View frontend**: `cd reactjs-frontend && npm run dev`
6. **Open browser**: http://localhost:3000

## 🎨 Frontend Screenshots

The frontend features:
- **Home Page**: Grid view of all articles
- **Original Articles**: Filter for original content
- **Optimized Articles**: Filter for AI-optimized content
- **Article Detail**: Full article view with related versions
- **Responsive Design**: Works on mobile, tablet, and desktop

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js, SQLite
- **Frontend**: React, Vite, React Router, Axios
- **Scraping**: Python, BeautifulSoup, Cheerio
- **AI**: OpenAI GPT-3.5 Turbo
- **Styling**: Custom CSS (no frameworks for better performance)

## 🌐 Deployment Guide

### Option 1: Quick Deploy to Vercel + Render (Recommended)

#### Backend Deployment (Render.com - Free Tier)

1. **Create a Render account** at https://render.com

2. **Deploy Backend**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `beyondchats-api`
     - **Root Directory**: `laravel-api`
     - **Environment**: Node
     - **Build Command**: `npm install && npm run seed`
     - **Start Command**: `npm start`
   - Add Environment Variables:
     - `NODE_ENV=production`
   - Click "Create Web Service"
   - Note your deployed URL (e.g., `https://beyondchats-api.onrender.com`)

3. **Database**: SQLite file will be created automatically by the seed script

#### Frontend Deployment (Vercel - Free Tier)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Deploy Frontend**:
   ```bash
   cd reactjs-frontend
   
   # Update .env with your deployed backend URL
   echo "VITE_API_URL=https://beyondchats-api.onrender.com" > .env.production
   
   # Deploy to Vercel
   vercel --prod
   ```

3. **Or Deploy via Vercel Dashboard**:
   - Go to https://vercel.com
   - Import your GitHub repository
   - Configure:
     - **Root Directory**: `reactjs-frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Environment Variables**:
       - `VITE_API_URL=https://your-backend-url.onrender.com`
   - Click "Deploy"

4. **Get your live URL**: `https://your-project.vercel.app`

### Option 2: Deploy to Netlify

```bash
cd reactjs-frontend

# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod
```

### Option 3: Manual Deployment

#### Backend (Any Node.js Hosting)
- Upload `laravel-api/` folder
- Set environment variables
- Run `npm install && npm run seed && npm start`

#### Frontend (Any Static Hosting)
- Build: `npm run build` in `reactjs-frontend/`
- Upload `dist/` folder contents
- Configure environment variables before build

### Post-Deployment Checklist

- [ ] Backend API is accessible (test with `/articles` endpoint)
- [ ] Database is seeded with articles
- [ ] Frontend loads without errors
- [ ] Frontend can fetch articles from backend API
- [ ] CORS is properly configured
- [ ] Environment variables are set correctly
- [ ] Update README with actual live links

### Deployment Troubleshooting

**Backend Issues:**
- If database is empty, manually run: `npm run seed`
- Check Render logs for any startup errors
- Verify PORT environment variable is set by Render automatically

**Frontend Issues:**
- Ensure `VITE_API_URL` points to deployed backend
- Check browser console for CORS errors
- Verify backend is responding before frontend loads

**CORS Issues:**
If you see CORS errors, ensure backend `server.js` has:
```javascript
app.use(cors({
  origin: ['https://your-frontend-domain.vercel.app'],
  credentials: true
}));
```

---

## 📝 Environment Variables

### laravel-api/.env
```env
APP_NAME="BeyondChats Article Manager"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

PORT=8000                              # API server port

DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite    # Relative path to SQLite database
```

### nodejs-script/.env
```env
API_BASE_URL=http://localhost:8000      # Backend API URL
OPENAI_API_KEY=your_openai_api_key_here # Get from https://platform.openai.com/api-keys
USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
```

### reactjs-frontend/.env
```env
VITE_API_URL=http://localhost:8000      # Backend API URL
VITE_PORT=3000                           # Frontend dev server port
```

### Python Scraper (Optional - via environment variables)
```bash
export BLOG_URL="https://beyondchats.com/blogs"
export API_BASE_URL="http://localhost:8000"
export NUM_ARTICLES=5
```

## 🤝 Contributing

This is a demo project for BeyondChats internship application.

## 📄 License

MIT License

## 👤 Author

Uday - BeyondChats Internship Candidate

---

**Note**: Make sure the API server is running before starting the frontend or optimization script!
