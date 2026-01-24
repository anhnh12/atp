# ⚡ Quick Deployment Guide

**Deploy your ATP website to GitHub Pages in 5 minutes - 100% FREE!**

## 🚀 Quick Steps

### 1. Create GitHub Repository
- Go to [github.com/new](https://github.com/new)
- Name: `atp-website` (or your choice)
- Visibility: **Public** (required for free Pages)
- Click "Create repository"

### 2. Push Your Code

```bash
cd /Users/caberchip/Documents/work/github.com/anhnh12/atp

# If not already a git repo
git init
git add .
git commit -m "Initial commit"

# Add your GitHub repo (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/atp-website.git
git branch -M main
git push -u origin main
```

### 3. Update Homepage in package.json

Open `atp-web/package.json` and update line 5:

```json
{
  "homepage": "https://YOUR_USERNAME.github.io/atp-website"
}
```

**Replace `YOUR_USERNAME` with your GitHub username.**

Then commit and push:
```bash
git add atp-web/package.json
git commit -m "Configure GitHub Pages homepage"
git push origin main
```

### 4. Enable GitHub Pages

1. Go to your repo on GitHub
2. **Settings** → **Pages**
3. **Source**: Select **GitHub Actions**
4. Click **Save**

### 5. Wait for Deployment

1. Go to **Actions** tab
2. Wait for green checkmark ✅ (2-3 minutes)
3. Your site is live at: `https://YOUR_USERNAME.github.io/atp-website/`

## ✅ Done!

Your website is now live and will auto-update on every push to `main` branch.

## 🔄 Future Updates

Just push your changes:
```bash
git add .
git commit -m "Update content"
git push origin main
```

GitHub Actions will automatically rebuild and deploy!

---

**Need more details?** See [DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md)
