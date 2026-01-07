# Silicon Vault - Deployment Guide

## 🚀 Netlify Deployment with Visitor Tracking

### Prerequisites
- A Netlify account
- Git repository for your project

### Deployment Steps

#### 1. **Install Dependencies**
```bash
npm install
```

#### 2. **Deploy to Netlify**

You have two options:

**Option A: Deploy via Netlify CLI**
```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to your Netlify account
netlify login

# Initialize and deploy
netlify init

# Deploy
netlify deploy --prod
```

**Option B: Deploy via Git**
1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Netlify](https://app.netlify.com/)
3. Click "Add new site" → "Import an existing project"
4. Connect your Git repository
5. Configure build settings (leave default for static site)
6. Click "Deploy site"

#### 3. **Enable Netlify Blobs**

Netlify Blobs is automatically available on all Netlify sites. No additional configuration needed!

#### 4. **Enable Vercel Analytics (Optional but Recommended)**

This project is now integrated with **Vercel Analytics**. 
1. If deploying to Vercel, simply enable Analytics in the dashboard.
2. If deploying elsewhere, the `inject()` and `track()` methods will still attempt to send data to Vercel if configured.
3. Custom events like `Search`, `Progress_Complete`, and `Roadmap_Expand` are automatically tracked.

### 🔧 How Visitor Tracking Works

The visitor tracking system uses a **multi-tier approach**:

#### Production (Netlify):
1. **Netlify Functions** with **Netlify Blobs** store visitor data
2. All visitors see the same shared statistics
3. Data persists across deployments

#### Local Development:
1. Falls back to **CountAPI** for global counting
2. Country data stored in `localStorage`
3. Seamless transition when deployed

#### Offline Fallback:
1. Uses `localStorage` for basic counting
2. Browser language detection for country estimation

### 📁 File Structure

```
silicon-vault/
├── index.html              # Main HTML file
├── styles.css              # Styles
├── script.js               # Client-side logic
├── netlify/
│   └── functions/
│       └── track-visit.js  # Serverless function for visitor tracking
├── netlify.toml           # Netlify configuration
└── package.json           # Dependencies
```

### 🔑 Environment Variables

No environment variables needed! Everything works out of the box.

### 🧪 Local Testing

To test Netlify Functions locally:

```bash
# Install dependencies
npm install

# Run Netlify Dev server
npm run dev
```

This will start a local server at `http://localhost:8888` with full Netlify Functions support.

### 📊 Visitor Statistics Features

- **Global Visitor Count**: Shared across all users
- **Country Breakdown**: Shows visitor distribution by country
- **Real-time Updates**: Immediate reflection of new visits
- **Persistent Storage**: Data survives deployments
- **Privacy-Friendly**: No personal data collected

### 🌍 API Usage

The system uses these free services:
- **Netlify Blobs**: For persistent storage (included with Netlify)
- **ipapi.co**: For geolocation (45k requests/month free)
- **CountAPI**: Fallback counter (unlimited, free)

### 🔒 Privacy & CORS

The Netlify Function handles CORS automatically, so your site works from any domain.

### 📈 Monitoring

View visitor stats by clicking the globe icon (🌍) in the navbar!

### 🐛 Troubleshooting

**Issue: Functions not working locally**
- Solution: Run `npm run dev` instead of opening HTML directly

**Issue: Visitor count not incrementing**
- Check browser console for errors
- Ensure Netlify Functions are deployed
- Verify site is deployed to Netlify (functions only work in production/dev environment)

**Issue: Country data not showing**
- May take a few seconds on first load
- Check if ipapi.co is accessible
- Fallback will use browser language if API fails

### 🎯 Next Steps

After deployment:
1. Visit your site to test the visitor counter
2. Share with friends to see country stats populate
3. Check Netlify dashboard for function logs

---

**Built with ❤️ for hardware engineers**
