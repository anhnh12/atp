# GitHub Pages Setup - Step by Step

Complete guide to set up GitHub Pages with automatic CI/CD.

## 📋 Prerequisites Checklist

- [ ] GitHub account created
- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub repository
- [ ] Node.js and npm installed locally

---

## 🎯 Step 1: Create GitHub Repository

### Option A: Create New Repository

1. Go to [GitHub](https://github.com)
2. Click **"+"** → **"New repository"**
3. Repository name: `atp-website` (or your preferred name)
4. Description: "ATP Safety Equipment Website"
5. Visibility: **Public** (required for free GitHub Pages)
6. **DO NOT** initialize with README, .gitignore, or license
7. Click **"Create repository"**

### Option B: Use Existing Repository

If you already have a repository, skip to Step 2.

---

## 🚀 Step 2: Push Code to GitHub

### If repository is empty:

```bash
# In your project directory
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/atp-website.git
git push -u origin main
```

### If repository already exists:

```bash
git add .
git commit -m "Setup CI/CD"
git push origin main
```

---

## ⚙️ Step 3: Update Homepage in package.json

**Important**: Update the `homepage` field in `package.json` for GitHub Pages deployment:

1. Open `package.json`
2. Find the `"homepage"` field (currently set to `"."` for local development)
3. Replace it with your GitHub Pages URL:

```json
{
  "homepage": "https://your-username.github.io/atp-website"
}
```

**Replace `your-username` with your GitHub username and `atp-website` with your repository name.**

**Note**: 
- For **local development**, keep `"homepage": "."`
- For **GitHub Pages deployment**, use `"https://your-username.github.io/repo-name"`
- The GitHub Actions workflow will build with the correct homepage automatically

---

## 🔧 Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**:
   - Select: **GitHub Actions**
5. Click **Save**

**Note**: If you don't see "GitHub Actions" option:
- Make sure you've pushed the `.github/workflows/deploy.yml` file
- Wait a few minutes and refresh

---

## ✅ Step 5: Verify GitHub Actions Workflow

1. Go to **Actions** tab in your repository
2. You should see:
   - "Build and Deploy to GitHub Pages" workflow
   - Status: Yellow (running) or Green (success)

3. Click on the workflow to see details:
   - **build** job: Builds the website
   - **deploy** job: Deploys to GitHub Pages

---

## 🌐 Step 6: Access Your Website

After the workflow completes successfully:

1. Go to **Settings** → **Pages**
2. You'll see your site URL:
   ```
   https://your-username.github.io/atp-website/
   ```

3. Click the URL or copy it to your browser
4. Your website should be live! 🎉

---

## 🔄 Step 7: Automatic Deployment

From now on, every time you push to `main` branch:

1. **Push your changes**:
   ```bash
   git add .
   git commit -m "Update content"
   git push origin main
   ```

2. **GitHub Actions automatically**:
   - Builds your website
   - Deploys to GitHub Pages
   - Updates your live site

3. **Check status**:
   - Go to **Actions** tab
   - See workflow running
   - Wait for green checkmark ✅

4. **Site updates** in 1-2 minutes

---

## 📝 Step 8: Custom Domain (Optional)

### If you have a custom domain:

1. Go to **Settings** → **Pages**
2. Under **Custom domain**, enter your domain:
   ```
   www.yourdomain.com
   ```
3. Click **Save**

4. **Configure DNS**:
   - Add CNAME record pointing to:
     ```
     your-username.github.io
     ```

5. **Update package.json**:
   ```json
   {
     "homepage": "https://www.yourdomain.com"
   }
   ```

6. Commit and push:
   ```bash
   git add package.json
   git commit -m "Add custom domain"
   git push origin main
   ```

---

## 🐛 Troubleshooting

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

**Problem**: Red X in Actions tab

**Solution**:
1. Click on the failed workflow
2. Check the error logs
3. Common issues:
   - Missing dependencies → Check `package.json`
   - TypeScript errors → Run `npm run type-check` locally
   - Build errors → Run `npm run build` locally

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
3. Ensure GitHub Pages is enabled
4. Try accessing: `https://your-username.github.io/atp-website/`

---

## 📊 Monitoring

### Check Deployment Status

1. **Actions Tab**: See all deployments
2. **Settings → Pages**: See deployment history
3. **Repository → Environments**: See deployment environments

### View Deployment Logs

1. Go to **Actions** tab
2. Click on a workflow run
3. Click on **build** or **deploy** job
4. Expand steps to see logs

---

## 🔐 Permissions

### Required Permissions

The workflow needs these permissions (already configured):
- ✅ `contents: read` - Read repository
- ✅ `pages: write` - Deploy to Pages
- ✅ `id-token: write` - Authentication

### If Permissions Error

1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**:
   - Select: **Read and write permissions**
3. Click **Save**

---

## ✅ Final Checklist

Before considering setup complete:

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

If all checkboxes are checked, your CI/CD is fully set up!

**What happens now:**
- Every push to `main` → Auto-deploy
- Build failures → You get notified
- Site updates → Live in 1-2 minutes

**Next Steps:**
- Update content in `src/data/` JSON files
- Push changes
- Watch it deploy automatically!

---

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/pages)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Quick Setup](./SETUP.md)

---

**Need Help?** Check the [Deployment Guide](./DEPLOYMENT_GUIDE.md) for detailed information.