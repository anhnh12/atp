# Quick Setup Guide

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

Or using Makefile:

```bash
make install
```

### 2. Start Development Server

```bash
npm start
```

Or:

```bash
make dev
```

### 3. Open Browser

The website will automatically open at `http://localhost:3000`

---

## 📦 First Time Setup

### Prerequisites

- Node.js 16+ ([Download](https://nodejs.org/))
- npm or yarn
- Git

### Step-by-Step

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/atp-website.git
   cd atp-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development**
   ```bash
   npm start
   ```

4. **Verify setup**
   - Website loads at `http://localhost:3000`
   - Products are displayed
   - No console errors

---

## 🏗️ Building for Production

### Build Command

```bash
npm run build
```

Or:

```bash
make build
```

### Preview Build Locally

```bash
npm run preview
```

Or:

```bash
make preview
```

---

## 🚢 Deployment to GitHub Pages

### Automatic Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository **Settings** → **Pages**
   - Source: Select **GitHub Actions**
   - Save

3. **Done!** 
   - GitHub Actions will automatically build and deploy
   - Site will be live at: `https://your-username.github.io/atp-website/`

### Manual Deployment

```bash
npm run deploy
```

---

## 📝 Common Commands

### Development
```bash
npm start          # Start dev server
make dev           # Same as above
```

### Building
```bash
npm run build      # Build for production
make build         # Same as above
```

### Testing
```bash
npm test           # Run tests
make test          # Same as above
```

### Code Quality
```bash
npm run lint       # Check code style
npm run type-check # Check TypeScript
make format        # Format code
```

### Deployment
```bash
git push origin main  # Auto-deploys via GitHub Actions
```

---

## 🔧 Troubleshooting

### Port 3000 already in use

```bash
# Use different port
PORT=3001 npm start
```

### Build fails

```bash
# Clean and reinstall
make clean
make install
make build
```

### Dependencies issues

```bash
# Remove and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 More Information

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete documentation.

---

**Need Help?** Check the full [Deployment Guide](./DEPLOYMENT_GUIDE.md)