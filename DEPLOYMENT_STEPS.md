# 🚀 Deployment Guide - Free Static Website Hosting

This guide will help you deploy your ATP website to **GitHub Pages** completely free, with automatic CI/CD.

## ✅ Why GitHub Pages?

- **100% Free** - No credit card required, no hidden fees
- **Automatic Deployment** - Every push to main branch auto-deploys
- **Fast CDN** - Global content delivery network
- **Custom Domain Support** - Add your own domain later (optional)
- **SSL/HTTPS** - Automatic SSL certificates
- **No Maintenance** - Set it and forget it

---

## 📋 Prerequisites

Before starting, make sure you have:

- [ ] GitHub account ([Sign up free](https://github.com/join))
- [ ] Git installed on your computer
- [ ] Code pushed to a GitHub repository

---

## 🎯 Step-by-Step Deployment

### Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in:
   - **Repository name**: `atp-website` (or your preferred name)
   - **Description**: "ATP Safety Equipment Website"
   - **Visibility**: Select **Public** (required for free GitHub Pages)
   - **DO NOT** check "Initialize with README"
4. Click **"Create repository"**

### Step 2: Push Your Code to GitHub

If you haven't pushed your code yet:

```bash
# Navigate to your project root
cd /Users/caberchip/Documents/work/github.com/anhnh12/atp

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for deployment"

# Add your GitHub repository as remote
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/atp-website.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note**: Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 3: Update Homepage Configuration

The `package.json` is already configured with `"homepage": "."` for local development. For GitHub Pages, we need to update it:

1. Open `atp-web/package.json`
2. Find the `"homepage"` field
3. Update it to match your repository:

```json
{
  "homepage": "https://YOUR_USERNAME.github.io/atp-website"
}
```

**Replace `YOUR_USERNAME` with your GitHub username and `atp-website` with your repository name.**

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu bar)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**:
   - Select: **GitHub Actions**
5. Click **Save**

**Note**: The "GitHub Actions" option will appear after you push the workflow file.

### Step 5: Verify GitHub Actions Workflow

1. Go to the **Actions** tab in your repository
2. You should see:
   - "Build and Deploy to GitHub Pages" workflow
   - Status: Yellow (running) or Green (success) ✅

3. Click on the workflow to see details:
   - **build** job: Builds your website
   - **deploy** job: Deploys to GitHub Pages

### Step 6: Access Your Live Website

After the workflow completes successfully (green checkmark ✅):

1. Go to **Settings** → **Pages** in your repository
2. You'll see your site URL:
   ```
   https://YOUR_USERNAME.github.io/atp-website/
   ```
3. Click the URL or copy it to your browser
4. **Your website is now live!** 🎉

---

## 🔄 Automatic Deployment

From now on, **every time you push to the `main` branch**:

1. **Make your changes** locally
2. **Commit and push**:
   ```bash
   git add .
   git commit -m "Update website content"
   git push origin main
   ```
3. **GitHub Actions automatically**:
   - Builds your website
   - Deploys to GitHub Pages
   - Updates your live site
4. **Check status**:
   - Go to **Actions** tab
   - See workflow running
   - Wait for green checkmark ✅
5. **Site updates** in 1-2 minutes

**No manual steps needed!** Just push and your site updates automatically.

---

## 🛠️ Troubleshooting

### Workflow Not Running

**Problem**: No workflow appears in Actions tab

**Solution**:
1. Check that `.github/workflows/deploy.yml` exists
2. Verify it's committed and pushed:
   ```bash
   git ls-files .github/workflows/
   ```
3. If missing, add and push:
   ```bash
   git add .github/
   git commit -m "Add GitHub Actions workflow"
   git push origin main
   ```

### Build Fails

**Problem**: Red X ❌ in Actions tab

**Solution**:
1. Click on the failed workflow
2. Check the error logs
3. Common issues:
   - Missing dependencies → Check `package.json`
   - TypeScript errors → Run `npm run type-check` locally
   - Build errors → Run `npm run build` locally in `atp-web/` directory

### Pages Not Updating

**Problem**: Changes not showing on website

**Solution**:
1. Check workflow status (should be green ✅)
2. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
3. Wait 2-3 minutes (CDN propagation)
4. Check if `homepage` in `package.json` is correct

### 404 Error on Pages

**Problem**: Website shows 404

**Solution**:
1. Verify `homepage` in `package.json` matches your repository name
2. Check that build completed successfully
3. Ensure GitHub Pages is enabled (Settings → Pages)
4. Try accessing: `https://YOUR_USERNAME.github.io/atp-website/`

### Permission Errors

**Problem**: "Permission denied" in workflow

**Solution**:
1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**:
   - Select: **Read and write permissions**
3. Click **Save**

---

## 📝 Custom Domain (Optional)

If you have a custom domain (e.g., `www.atp-safety.com`):

### Step 1: Add Custom Domain to GitHub Pages

1. Go to **Settings** → **Pages**
2. Under **Custom domain**, enter your domain:
   ```
   www.yourdomain.com
   ```
3. Click **Save**

### Step 2: Configure DNS

Add a CNAME record in your DNS settings pointing to:
```
YOUR_USERNAME.github.io
```

### Step 3: Update package.json

Update the `homepage` field:
```json
{
  "homepage": "https://www.yourdomain.com"
}
```

### Step 4: Commit and Push

```bash
git add atp-web/package.json
git commit -m "Add custom domain"
git push origin main
```

---

## 💰 Cost Breakdown

**Total Cost: $0.00**

- ✅ GitHub Pages: **Free** (unlimited for public repos)
- ✅ GitHub Actions: **Free** (2,000 minutes/month for free accounts)
- ✅ Bandwidth: **Free** (100 GB/month)
- ✅ Storage: **Free** (1 GB per repository)
- ✅ SSL/HTTPS: **Free** (automatic)

**Your website will run completely free forever!**

---

## ✅ Final Checklist

Before considering deployment complete:

- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub
- [ ] `homepage` in `package.json` updated
- [ ] GitHub Pages enabled (Source: GitHub Actions)
- [ ] Workflow file exists (`.github/workflows/deploy.yml`)
- [ ] First deployment successful (green checkmark ✅)
- [ ] Website accessible at GitHub Pages URL
- [ ] Test push triggers new deployment

---

## 🎉 Success!

If all checkboxes are checked, your website is live and will automatically update on every push!

**What happens now:**
- ✅ Every push to `main` → Auto-deploy
- ✅ Build failures → You get notified
- ✅ Site updates → Live in 1-2 minutes
- ✅ **Zero maintenance required**

**Next Steps:**
- Update content in `atp-web/src/data/` JSON files
- Push changes
- Watch it deploy automatically!

---

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/pages)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/)

---

**Need Help?** Check the [GITHUB_SETUP.md](./GITHUB_SETUP.md) for more detailed information.
