# 🌐 Admin Subdomain Setup Guide

## Overview

The admin panel can be accessed via:
- **Subdomain**: `admin.anphatsafetyvn.com` (production)
- **Path**: `anphatsafetyvn.com/admin` (production fallback)
- **Localhost**: `localhost:3000/admin` (development)

The app automatically detects the subdomain and routes accordingly.

---

## 🔧 How It Works

### Subdomain Detection

The app uses `src/utils/subdomain.ts` to detect if you're on an admin subdomain:

- **Production**: Checks if hostname starts with `admin.` (e.g., `admin.anphatsafetyvn.com`)
- **Localhost**: Always uses path-based routing (`/admin/*`)

### Routing Logic

```typescript
// On admin subdomain (admin.domain.com)
- / → Admin Login
- /login → Admin Login  
- /dashboard → Admin Dashboard
- /categories → Category Manager
- /products → Product Manager

// On main domain or localhost (domain.com or localhost:3000)
- / → Products Page
- /admin/login → Admin Login
- /admin → Admin Dashboard
- /admin/categories → Category Manager
- /admin/products → Product Manager
```

---

## 🚀 Production Setup

### Option 1: Subdomain Setup (Recommended)

1. **DNS Configuration**:
   - Add a CNAME record:
     ```
     admin.anphatsafetyvn.com → anphatsafetyvn.com
     ```
   - Or A record pointing to same IP as main domain

2. **GitHub Pages Configuration**:
   - GitHub Pages doesn't natively support subdomains for the same repo
   - You'll need one of these approaches:

   **Approach A: Separate Repository for Admin**
   - Create a new repo: `atp-admin`
   - Deploy admin panel to `admin.anphatsafetyvn.com`
   - Main site stays on `anphatsafetyvn.com`

   **Approach B: Use a Different Hosting Service**
   - Deploy admin to a service that supports subdomains:
     - **Vercel** (free, supports subdomains)
     - **Netlify** (free, supports subdomains)
     - **Firebase Hosting** (free tier available)

   **Approach C: Use Path-Based Routing**
   - Keep using `anphatsafetyvn.com/admin`
   - No DNS changes needed
   - Works with GitHub Pages

### Option 2: Path-Based Routing (Current - Works with GitHub Pages)

Keep using `anphatsafetyvn.com/admin` - no changes needed!

---

## 🛠️ Development Setup

### Localhost (No Changes Needed)

The app automatically uses path-based routing on localhost:
- `http://localhost:3000/admin/login`
- `http://localhost:3000/admin`

### Testing Subdomain Locally (Optional)

If you want to test subdomain routing locally:

1. **Edit `/etc/hosts`** (macOS/Linux) or `C:\Windows\System32\drivers\etc\hosts` (Windows):
   ```
   127.0.0.1 admin.localhost
   ```

2. **Access**: `http://admin.localhost:3000`

3. **Note**: This is optional - path-based routing works fine for development

---

## 📝 Code Changes Made

### 1. Subdomain Detection Utility
- **File**: `src/utils/subdomain.ts`
- Detects admin subdomain
- Returns appropriate base path

### 2. App Routing
- **File**: `src/App.tsx`
- Conditional routing based on subdomain
- Admin subdomain → Admin routes only
- Main domain/localhost → Public + Admin routes

### 3. Admin Components
- Updated navigation links to work with both subdomain and path-based routing
- Login redirects based on subdomain detection

---

## ✅ Testing

### Test Path-Based (Localhost)
```bash
npm start
# Visit: http://localhost:3000/admin/login
```

### Test Subdomain (Production)
```
# Visit: admin.anphatsafetyvn.com
# Should show admin login
```

---

## 🎯 Recommendation

**For GitHub Pages**: Use **path-based routing** (`domain.com/admin`)
- ✅ No DNS configuration needed
- ✅ Works immediately
- ✅ No additional hosting costs
- ✅ Simple deployment

**For Subdomain**: Use **Vercel** or **Netlify** (free)
- ✅ Better separation
- ✅ Can use different domains
- ✅ More professional
- ⚠️ Requires DNS setup

---

## 📚 Additional Notes

- The code automatically detects subdomain vs path-based routing
- No changes needed for localhost development
- All admin routes work in both modes
- Logout and navigation work correctly in both modes

---

**Current Status**: Code supports both subdomain and path-based routing. Choose based on your hosting setup!
