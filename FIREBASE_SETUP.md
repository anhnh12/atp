# 🔥 Firebase Setup Guide

Complete guide to set up Firebase for the ATP website.

## 📋 Prerequisites

- Firebase account ([Sign up free](https://firebase.google.com))
- Google account
- Node.js installed

---

## 🚀 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `atp-website` (or your choice)
4. Click **Continue**
5. **Disable** Google Analytics (optional, not needed for small projects)
6. Click **Create project**
7. Wait for project creation (30 seconds)

---

## 🔧 Step 2: Enable Firebase Services

### Enable Firestore Database

1. In Firebase Console, click **Firestore Database** (left sidebar)
2. Click **"Create database"**
3. Select **"Start in test mode"** (we'll add security rules later)
4. Choose a location (choose closest to your users, e.g., `asia-southeast1` for Vietnam)
5. Click **Enable**

### Enable Storage

1. Click **Storage** (left sidebar)
2. Click **"Get started"**
3. You'll see **"Set up default bucket"** screen with two steps:
   - **Step 1: Bucket options**
   - **Step 2: Security rules**

4. **Configure Bucket Options:**
   - Select **"No-cost location"** (recommended for cost optimization)
   - **Location**: 
     - If available, choose **"asia-southeast1"** (closest to Vietnam, better performance)
     - If not available, **"us-east1"** is fine (still free, works well for small sites)
   - **Access frequency**: Leave as **"Standard"** (default)
   - **Storage class**: Leave as **"Regional"** (default)
   - Click **"Next"**

5. **Security Rules** (Step 2):
   - Select **"Start in production mode"** ✅
     - This is more secure by default
     - We have proper security rules ready to deploy immediately
   - **Important**: The default rules shown will deny all access (`allow read, write: if false`)
   - Don't worry - we'll update these rules right after setup
   - Click **"Create"** (or **"Done"**)

**Why Production Mode?**
- ✅ More secure by default
- ✅ We have proper security rules ready (`storage.rules` file)
- ✅ We'll update rules immediately after setup (Step 5 below)
- ✅ Better practice for production use

**Note**: 
- ✅ **"No-cost location"** is perfect for your use case (~100MB images)
- ✅ US-EAST1 or ASIA-SOUTHEAST1 both work fine
- ✅ You'll stay within free tier limits

### Enable Authentication

1. Click **Authentication** (left sidebar)
2. Click **"Get started"**
3. Click **Sign-in method** tab
4. Click **Google** provider
5. Toggle **Enable**
6. Enter project support email
7. Click **Save**

---

## 🔑 Step 3: Get Firebase Configuration

1. In Firebase Console, click **⚙️ Settings** (gear icon) → **Project settings**
2. Scroll down to **"Your apps"** section
3. Click **Web icon** (`</>`)
4. Register app:
   - App nickname: `ATP Website`
   - **Do NOT** check "Also set up Firebase Hosting"
   - Click **Register app**
5. Copy the `firebaseConfig` object

It should look like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

## 📝 Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your Firebase config:
   ```env
   REACT_APP_FIREBASE_API_KEY=AIzaSy...
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
   REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
   
   # Add admin email(s) - comma-separated
   REACT_APP_ADMIN_EMAILS=admin@example.com,admin2@example.com
   ```

3. **Important**: Add `.env` to `.gitignore` (should already be there)

---

## 🔒 Step 5: Configure Security Rules

### Firestore Security Rules

**Important for Migration**: Before running the migration script, you need to temporarily allow writes.

1. In Firebase Console, go to **Firestore Database** → **Rules** tab
2. **For Migration (Temporary)**: Use test mode rules to allow migration:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;  // Temporary: allows all operations
       }
     }
   }
   ```
3. Click **Publish**
4. **Run your migration script** (see Step 8 below)
5. **After migration completes**, replace with production rules from `firestore.rules` file:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       function isAuthenticated() {
         return request.auth != null;
       }
       
       function isAdmin() {
         return isAuthenticated() && 
                request.auth.token.email != null;
       }
       
       match /products/{productId} {
         allow read: if true;
         allow create, update, delete: if isAdmin();
       }
       
       match /categories/{categoryId} {
         allow read: if true;
         allow create, update, delete: if isAdmin();
       }
     }
   }
   ```
6. Click **Publish** again

**Why?** The migration script runs without authentication, so it needs temporary write access. After migration, switch back to secure rules.

### Storage Security Rules

1. In Firebase Console, go to **Storage** → **Rules** tab
2. You'll see default rules that deny all access (from production mode setup)
3. Replace the default rules with content from `storage.rules` file in your project
4. The rules should allow:
   - ✅ **Public read** - Anyone can view product/category images
   - ✅ **Admin write** - Only authenticated admins can upload/delete
5. Click **Publish**

**Note**: After publishing, your images will be publicly accessible (which is what you want for product images), but only admins can upload/delete.

**Note**: The rules allow:
- ✅ **Public read** - Anyone can view products/categories
- ✅ **Admin write** - Only authenticated admins can create/update/delete

---

## 👥 Step 6: Configure Admin Emails

The admin authentication uses email-based access control.

1. Open `.env` file
2. Add admin email(s) to `REACT_APP_ADMIN_EMAILS`:
   ```env
   REACT_APP_ADMIN_EMAILS=admin@example.com,admin2@example.com
   ```

**Note**: Only emails in this list can access admin panel after Google login.

---

## 📦 Step 7: Install Dependencies

```bash
npm install
```

This will install Firebase SDK and other dependencies.

---

## 🗄️ Step 8: Migrate Existing Data (Optional)

If you have existing JSON data to migrate:

**The script automatically reads from your `.env` file!**

1. Make sure your `.env` file has Firebase configuration (with `REACT_APP_` prefix):
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

2. Run migration script (no manual export needed!):
   ```bash
   node scripts/migrate-to-firebase.js
   ```

**That's it!** The script will automatically read from your `.env` file.

**Note**: The script will migrate all categories and products from your JSON files to Firestore. Make sure you have:
- ✅ Firebase project created
- ✅ Firestore Database enabled
- ✅ Security rules published (or in test mode for migration)

---

## ✅ Step 9: Test the Setup

1. Start development server:
   ```bash
   npm start
   ```

2. Test public pages:
   - Visit `http://localhost:3000`
   - Products and categories should load from Firestore

3. Test admin login:
   - Visit `http://localhost:3000/admin/login`
   - Click "Đăng nhập với Google"
   - Sign in with admin email
   - Should redirect to admin dashboard

4. Test admin features:
   - Create a category
   - Create a product
   - Upload images
   - Edit/delete items

---

## 🚀 Step 10: Deploy to Production

### Update Environment Variables for Production

For GitHub Pages deployment, you need to add environment variables to GitHub Secrets:

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets:
   - `REACT_APP_FIREBASE_API_KEY`
   - `REACT_APP_FIREBASE_AUTH_DOMAIN`
   - `REACT_APP_FIREBASE_PROJECT_ID`
   - `REACT_APP_FIREBASE_STORAGE_BUCKET`
   - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
   - `REACT_APP_FIREBASE_APP_ID`
   - `REACT_APP_ADMIN_EMAILS`

### Update GitHub Actions Workflow

Update `.github/workflows/deploy.yml` to inject environment variables:

```yaml
- name: Build website
  run: npm run build
  env:
    CI: false
    REACT_APP_FIREBASE_API_KEY: ${{ secrets.REACT_APP_FIREBASE_API_KEY }}
    REACT_APP_FIREBASE_AUTH_DOMAIN: ${{ secrets.REACT_APP_FIREBASE_AUTH_DOMAIN }}
    REACT_APP_FIREBASE_PROJECT_ID: ${{ secrets.REACT_APP_FIREBASE_PROJECT_ID }}
    REACT_APP_FIREBASE_STORAGE_BUCKET: ${{ secrets.REACT_APP_FIREBASE_STORAGE_BUCKET }}
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.REACT_APP_FIREBASE_MESSAGING_SENDER_ID }}
    REACT_APP_FIREBASE_APP_ID: ${{ secrets.REACT_APP_FIREBASE_APP_ID }}
    REACT_APP_ADMIN_EMAILS: ${{ secrets.REACT_APP_ADMIN_EMAILS }}
```

---

## 🔍 Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"

**Solution**: Add your domain to Firebase Console:
1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Add your domain (e.g., `yourdomain.com`)

### "Permission denied" when accessing Firestore

**Solution**: Check security rules are published and correct.

### Images not uploading

**Solution**: 
1. Check Storage rules are published
2. Check file size (max 5MB)
3. Check file type (images only)

### Admin login not working

**Solution**:
1. Check email is in `REACT_APP_ADMIN_EMAILS`
2. Check Google Auth is enabled in Firebase Console
3. Check authorized domains include your domain

---

## 📚 Next Steps

- ✅ Test all CRUD operations
- ✅ Upload sample images
- ✅ Test on mobile devices
- ✅ Deploy to production
- ✅ Monitor Firebase usage (free tier limits)

---

## 💰 Cost Monitoring

Firebase free tier includes:
- **Firestore**: 1GB storage, 50K reads/day, 20K writes/day
- **Storage**: 5GB storage, 1GB downloads/day
- **Authentication**: Unlimited

**For your use case (~100MB images, weekly updates)**: You'll stay well within free tier! 🎉

---

**Need help?** Check Firebase documentation or review the code comments in `src/config/firebase.ts`.
