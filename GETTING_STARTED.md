# 🚀 GETTING STARTED - Silicon Vault with Vite

## ⚡ Quick Start (Super Easy!)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

🎉 **That's it!** Your browser will open automatically at http://localhost:3000

---

## 🎯 What You'll See

- ✅ Your website running locally
- ✅ Fast hot-reload (changes appear instantly)
- ✅ Visitor counter working (with fallback APIs)
- ✅ Globe icon showing statistics

---

## 📦 Available Commands

```bash
# Local development (with Vite - super fast!)
npm run dev

# Local development (with Netlify Functions)
npm run dev:netlify

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Netlify
npm run deploy
```

---

## 🎨 Features Now Working

### Local Development (npm run dev):
- ✅ **Fast dev server** - Instant hot reload
- ✅ **Visitor tracking** - Uses fallback APIs (CountAPI + ipapi)
- ✅ **Country detection** - Works immediately
- ⚠️ **Shared stats** - Not available (uses localStorage)

### Netlify Deployment (after deploy):
- ✅ **All features** - Everything works perfectly
- ✅ **Shared statistics** - All users see same data
- ✅ **Netlify Blobs** - Persistent storage
- ✅ **Serverless backend** - Scales automatically

---

## 🚀 Deploy to Netlify

When ready to deploy:

```bash
# Option 1: One command deploy
npm run deploy

# Option 2: Use the helper script
.\deploy.ps1

# Option 3: Push to Git and connect on Netlify
git push origin main
# Then import in Netlify dashboard
```

---

## 🔧 How It Works

### Development Flow:
```
1. Run: npm run dev
2. Vite starts fast dev server
3. Opens browser at localhost:3000
4. Make changes → See them instantly!
```

### Production Flow:
```
1. Run: npm run build
2. Vite builds optimized bundle
3. Generates dist/ folder
4. Deploy to Netlify
5. Netlify Functions handle backend
6. Netlify Blobs stores data
```

---

## 🎯 Visitor Tracking Modes

### Local (npm run dev):
- Uses **CountAPI** for global count
- Uses **localStorage** for countries
- Fast and works offline

### Production (Netlify):
- Uses **Netlify Blobs** for everything
- Shared across ALL users
- Persistent storage

---

## 🐛 Troubleshooting

**Nothing happens after "npm run dev"?**
- Wait a few seconds, browser should auto-open
- Or manually visit: http://localhost:3000

**Port 3000 already in use?**
- Vite will automatically use next available port
- Check terminal for actual port number

**Visitor stats not showing?**
- Wait a few seconds for APIs to respond
- Check browser console for any errors
- May need internet connection for geolocation

---

## ✨ Why Vite?

✅ **Instant server start** - No waiting!  
✅ **Lightning-fast HMR** - See changes immediately  
✅ **Modern build** - Optimized production bundles  
✅ **Better DX** - Developer experience  
✅ **Works effortlessly** - Just `npm run dev`!  

---

## 🎉 You're Ready!

Just run:
```bash
npm install
npm run dev
```

**Your site will open automatically!** 🚀

Click the globe icon (🌍) in the navbar to see visitor statistics!
