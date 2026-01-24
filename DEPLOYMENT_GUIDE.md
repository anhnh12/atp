# ATP Website - Deployment Guide

Complete guide for local development, building, and deploying the ATP Safety Equipment website.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Building the Website](#building-the-website)
4. [GitHub Pages Deployment](#github-pages-deployment)
5. [CI/CD with GitHub Actions](#cicd-with-github-actions)
6. [Useful Commands](#useful-commands)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)
- **GitHub account** - [Sign up](https://github.com/)

### Verify Installation

```bash
node --version  # Should be v16 or higher
npm --version   # Should be v8 or higher
git --version   # Any recent version
```

---

## Local Development Setup

### Step 1: Clone the Repository

```bash
# If you haven't cloned yet
git clone https://github.com/your-username/atp-website.git
cd atp-website
```

### Step 2: Install Dependencies

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

### Step 3: Start Development Server

```bash
npm start
```

Or using the Makefile:

```bash
make dev
```

The website will open at `http://localhost:3000` automatically.

### Step 4: Verify Everything Works

- ✅ Website loads at `http://localhost:3000`
- ✅ Products are displayed
- ✅ Categories are shown
- ✅ Navigation works
- ✅ No console errors

---

## Building the Website

### Build for Production

```bash
npm run build
```

Or using Makefile:

```bash
make build
```

This creates an optimized production build in the `build/` directory.

### Preview Production Build Locally

```bash
# Install serve globally (one-time)
npm install -g serve

# Serve the build
serve -s build -l 3000
```

Or using the Makefile:

```bash
make preview
```

### Build Output

The build process creates:
- Optimized JavaScript bundles
- Minified CSS
- Optimized images
- Static HTML files
- All assets in `build/` directory

---

## GitHub Pages Deployment

### Option 1: Manual Deployment

#### Step 1: Build the Website

```bash
npm run build
```

#### Step 2: Deploy to GitHub Pages

```bash
# Install gh-pages package (one-time)
npm install --save-dev gh-pages

# Deploy
npm run deploy
```

### Option 2: Automatic Deployment (Recommended)

Use GitHub Actions for automatic deployment (see [CI/CD section](#cicd-with-github-actions)).

---

## CI/CD with GitHub Actions

### Step 1: Create GitHub Actions Workflow

The workflow file is already created at `.github/workflows/deploy.yml`. 

**No action needed** - it's ready to use!

### Step 2: Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Under **Source**, select:
   - **Source**: `GitHub Actions`
4. Click **Save**

### Step 3: Push to GitHub

```bash
# Add all changes
git add .

# Commit
git commit -m "Setup CI/CD for GitHub Pages"

# Push to main branch
git push origin main
```

### Step 4: Verify Deployment

1. Go to **Actions** tab in GitHub
2. You should see the workflow running
3. Wait for it to complete (green checkmark)
4. Your site will be live at:
   - `https://your-username.github.io/atp-website/`
   - Or your custom domain if configured

### How It Works

1. **Push to main branch** → Triggers workflow
2. **Install dependencies** → `npm ci`
3. **Run tests** (if any) → `npm test`
4. **Build website** → `npm run build`
5. **Deploy to GitHub Pages** → Automatic

---

## Useful Commands

### NPM Scripts

All commands are available via `npm run <command>`:

```bash
# Development
npm start          # Start dev server (port 3000)
npm run dev        # Alias for start

# Building
npm run build      # Build for production
npm run build:analyze  # Build with bundle analysis

# Testing
npm test           # Run tests
npm test:watch     # Run tests in watch mode
npm test:coverage  # Run tests with coverage

# Deployment
npm run deploy     # Deploy to GitHub Pages
npm run deploy:preview  # Preview deployment

# Code Quality
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
npm run type-check # TypeScript type checking
```

### Makefile Commands

For convenience, use `make <command>`:

```bash
# Development
make dev           # Start development server
make dev:clean     # Clean and start dev server

# Building
make build         # Build for production
make build:clean   # Clean and build
make preview       # Preview production build

# Testing
make test          # Run all tests
make test:watch    # Run tests in watch mode

# Deployment
make deploy        # Deploy to GitHub Pages
make deploy:preview # Preview deployment

# Maintenance
make clean         # Remove build artifacts
make install       # Install dependencies
make update        # Update dependencies
make help          # Show all available commands
```

---

## Project Structure

```
atp-website/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── public/                      # Static assets
│   ├── index.html
│   └── ...
├── src/
│   ├── components/              # React components
│   ├── data/                    # Static JSON data
│   │   ├── categories.json
│   │   ├── products.json
│   │   ├── contact.json
│   │   └── dataMapper.ts
│   ├── hooks/                   # Custom React hooks
│   ├── types/                   # TypeScript types
│   └── ...
├── build/                       # Production build (generated)
├── package.json
├── Makefile                     # Convenience commands
└── DEPLOYMENT_GUIDE.md         # This file
```

---

## Custom Domain Setup (Optional)

### Step 1: Add Custom Domain to GitHub Pages

1. Go to **Settings** → **Pages**
2. Under **Custom domain**, enter your domain
3. Click **Save**

### Step 2: Configure DNS

Add a CNAME record pointing to:
```
your-username.github.io
```

### Step 3: Update Build Configuration

The `homepage` field in `package.json` is already configured for GitHub Pages. For custom domain, update it:

```json
{
  "homepage": "https://yourdomain.com"
}
```

---

## Troubleshooting

### Build Fails

**Problem**: `npm run build` fails

**Solutions**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

### GitHub Pages Not Updating

**Problem**: Changes not showing on GitHub Pages

**Solutions**:
1. Check GitHub Actions workflow status
2. Verify `homepage` in `package.json` is correct
3. Clear browser cache
4. Wait a few minutes (CDN propagation)

### Port Already in Use

**Problem**: `Port 3000 is already in use`

**Solutions**:
```bash
# Use a different port
PORT=3001 npm start

# Or kill the process using port 3000
# On macOS/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### TypeScript Errors

**Problem**: TypeScript compilation errors

**Solutions**:
```bash
# Check types
npm run type-check

# Fix common issues
npm run lint -- --fix
```

### Missing Dependencies

**Problem**: Module not found errors

**Solutions**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## Environment Variables

For local development, create a `.env` file (optional):

```env
REACT_APP_API_URL=http://localhost:8080/api/v1
REACT_APP_ENV=development
```

**Note**: Variables must start with `REACT_APP_` to be accessible in the app.

---

## Performance Optimization

### Build Analysis

Analyze bundle size:

```bash
npm run build:analyze
```

### Image Optimization

- Use WebP format when possible
- Compress images before adding to `public/`
- Use appropriate image sizes

### Code Splitting

React Router automatically code-splits routes. No additional configuration needed.

---

## Security Best Practices

1. **Never commit sensitive data** (API keys, passwords)
2. **Use environment variables** for configuration
3. **Keep dependencies updated**: `npm audit`
4. **Review GitHub Actions** for security

---

## Updating Content

### Update Products/Categories

1. Edit JSON files in `src/data/`:
   - `products.json`
   - `categories.json`
   - `contact.json`

2. Commit and push:
```bash
git add src/data/
git commit -m "Update product catalog"
git push origin main
```

3. GitHub Actions will automatically rebuild and deploy

### Update Images

1. Add images to `public/images/`
2. Update image URLs in JSON files
3. Commit and push

---

## Monitoring & Analytics

### GitHub Actions Status

Check deployment status:
- Go to **Actions** tab
- View latest workflow run
- Check logs for errors

### Website Analytics

Add Google Analytics (optional):
1. Get tracking ID
2. Add to `public/index.html`
3. Rebuild and deploy

---

## Support & Resources

- **React Documentation**: https://react.dev/
- **GitHub Pages Docs**: https://docs.github.com/pages
- **GitHub Actions Docs**: https://docs.github.com/actions
- **Create React App Docs**: https://create-react-app.dev/

---

## Quick Reference

### First Time Setup
```bash
git clone <repo-url>
cd atp-website
npm install
npm start
```

### Daily Development
```bash
npm start              # Start dev server
npm run build          # Build for production
npm test               # Run tests
```

### Deployment
```bash
git add .
git commit -m "Update content"
git push origin main    # Auto-deploys via GitHub Actions
```

### Emergency Commands
```bash
make clean             # Clean everything
make install           # Reinstall dependencies
make build:clean       # Clean build
```

---

**Last Updated**: 2024-01-22