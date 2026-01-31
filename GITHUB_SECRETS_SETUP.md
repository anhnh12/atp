# 🔐 GitHub Secrets Setup for Firebase

## Overview

Since your React app uses Firebase, you need to store Firebase credentials as GitHub Secrets. These will be used during the build process to embed the Firebase configuration into your app.

## Step 1: Get Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **anphatsafety-9e49b**
3. Click the gear icon ⚙️ → **Project Settings**
4. Scroll down to **Your apps** section
5. Find your web app (or create one if needed)
6. Copy the following values from the config object:

```javascript
{
  apiKey: "AIza...",
  authDomain: "anphatsafety-9e49b.firebaseapp.com",
  projectId: "anphatsafety-9e49b",
  storageBucket: "anphatsafety-9e49b.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
}
```

## Step 2: Add Secrets to GitHub

1. Go to your GitHub repository: `https://github.com/anhnh12/atp`
2. Click **Settings** (top menu)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each of these secrets (one at a time):

### Required Secrets:

| Secret Name | Value | Example |
|------------|-------|---------|
| `REACT_APP_FIREBASE_API_KEY` | Your Firebase API Key | `AIzaSyC...` |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Your Auth Domain | `anphatsafety-9e49b.firebaseapp.com` |
| `REACT_APP_FIREBASE_PROJECT_ID` | Your Project ID | `anphatsafety-9e49b` |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Your Storage Bucket | `anphatsafety-9e49b.firebasestorage.app` |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Your Messaging Sender ID | `123456789` |
| `REACT_APP_FIREBASE_APP_ID` | Your App ID | `1:123456789:web:abc123` |
| `REACT_APP_FIREBASE_MEASUREMENT_ID` | Your Measurement ID (optional) | `G-XXXXXXXXXX` |
| `REACT_APP_ADMIN_EMAILS` | Comma-separated admin emails | `admin@example.com,admin2@example.com` |

### Steps to Add Each Secret:

1. Click **New repository secret**
2. **Name**: Enter the secret name (e.g., `REACT_APP_FIREBASE_API_KEY`)
3. **Secret**: Paste the value
4. Click **Add secret**
5. Repeat for all secrets above

## Step 3: Verify Secrets Are Added

After adding all secrets, you should see them listed under **Repository secrets**:
- ✅ `REACT_APP_FIREBASE_API_KEY`
- ✅ `REACT_APP_FIREBASE_AUTH_DOMAIN`
- ✅ `REACT_APP_FIREBASE_PROJECT_ID`
- ✅ `REACT_APP_FIREBASE_STORAGE_BUCKET`
- ✅ `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- ✅ `REACT_APP_FIREBASE_APP_ID`
- ✅ `REACT_APP_ADMIN_EMAILS`

## Step 4: Update GitHub Actions Workflow

The workflow file (`.github/workflows/deploy.yml`) has been updated to use these secrets automatically. No manual changes needed!

## Step 5: Test Deployment

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Add Firebase configuration"
   git push origin main
   ```

2. Check GitHub Actions:
   - Go to **Actions** tab in your repository
   - Watch the workflow run
   - The build will use your Firebase secrets

3. Verify the deployed site:
   - After deployment completes, visit your GitHub Pages URL
   - Check browser console (F12) for any Firebase errors
   - Test admin login to ensure Firebase Auth works

## Important Notes

### Security
- ✅ **Never commit** `.env` files to Git
- ✅ Secrets are encrypted and only available during workflow runs
- ✅ They're not visible in logs or code
- ✅ Only repository admins can view/edit secrets

### Local Development
For local development, create a `.env` file in the project root (this file is already in `.gitignore`):

```bash
# .env (DO NOT COMMIT THIS FILE)
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=anphatsafety-9e49b.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=anphatsafety-9e49b
REACT_APP_FIREBASE_STORAGE_BUCKET=anphatsafety-9e49b.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_ADMIN_EMAILS=your-admin@email.com
```

### Why REACT_APP_ Prefix?
- Create React App only exposes environment variables that start with `REACT_APP_`
- These are embedded into the JavaScript bundle at build time
- They're publicly visible in the built app (this is normal for Firebase config)

## Troubleshooting

### Build Fails with "Firebase config not found"
- ✅ Check that all secrets are added correctly
- ✅ Verify secret names match exactly (case-sensitive)
- ✅ Check GitHub Actions logs for specific errors

### Firebase Not Working After Deployment
- ✅ Check browser console for errors
- ✅ Verify Firebase project settings allow your domain
- ✅ Check Firebase Console → Authentication → Authorized domains

### Admin Login Not Working
- ✅ Verify `REACT_APP_ADMIN_EMAILS` is set correctly
- ✅ Check that your email is in the comma-separated list
- ✅ Verify Firebase Auth is enabled in Firebase Console

---

**Next Steps:**
1. Add all secrets to GitHub
2. Push your code
3. Watch the deployment
4. Test the live site!
