# 🚀 Quick Start Guide

## Local Development (2 commands)

```bash
npm install    # First time only
npm start      # Start dev server
```

Website opens at: `http://localhost:3000`

---

## Build & Deploy (3 steps)

### 1. Update Content
Edit files in `src/data/`:
- `products.json`
- `categories.json`
- `contact.json`

### 2. Commit & Push
```bash
git add .
git commit -m "Update products"
git push origin main
```

### 3. Done! ✅
GitHub Actions automatically:
- Builds the website
- Deploys to GitHub Pages
- Updates live site in 1-2 minutes

---

## First Time GitHub Setup

### 1. Create Repository
- Go to GitHub → New repository
- Name: `atp-website`
- Make it **Public**

### 2. Push Code
```bash
git remote add origin https://github.com/your-username/atp-website.git
git push -u origin main
```

### 3. Enable GitHub Pages
- Repository → **Settings** → **Pages**
- Source: **GitHub Actions**
- Save

### 4. Update Homepage
Edit `package.json`:
```json
{
  "homepage": "https://your-username.github.io/atp-website"
}
```

### 5. Push Again
```bash
git add package.json
git commit -m "Setup GitHub Pages"
git push origin main
```

### 6. Wait & Check
- Go to **Actions** tab
- Wait for green checkmark ✅
- Visit: `https://your-username.github.io/atp-website/`

---

## Useful Commands

```bash
# Development
npm start              # Start dev server
make dev               # Same (if Make installed)

# Building
npm run build          # Build for production
make build             # Same

# Testing
npm test               # Run tests
npm run type-check     # Check TypeScript

# Deployment
git push origin main   # Auto-deploys!
```

---

## File Structure

```
atp-website/
├── src/
│   ├── data/          ← Edit content here
│   │   ├── products.json
│   │   ├── categories.json
│   │   └── contact.json
│   └── ...
├── .github/
│   └── workflows/
│       └── deploy.yml  ← CI/CD (already set up)
└── package.json
```

---

## Troubleshooting

**Port 3000 in use?**
```bash
PORT=3001 npm start
```

**Build fails?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Website not updating?**
1. Check **Actions** tab (should be green ✅)
2. Clear browser cache
3. Wait 2-3 minutes

---

## 📚 Full Documentation

- **Setup**: [SETUP.md](./SETUP.md)
- **Deployment**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **GitHub Setup**: [GITHUB_SETUP.md](./GITHUB_SETUP.md)

---

**That's it!** You're ready to go! 🎉