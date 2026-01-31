# 🔧 Fix: Permission Denied During Migration

## Problem

You're getting `PERMISSION_DENIED` errors because Firestore security rules require authentication, but the migration script runs without authentication.

## Solution: Temporarily Enable Test Mode

### Step 1: Set Firestore to Test Mode (Temporary)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Firestore Database** → **Rules** tab
4. **Replace** the current rules with test mode rules:

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

5. Click **Publish**

**⚠️ Warning**: These rules allow anyone to read/write. Only use temporarily for migration!

### Step 2: Run Migration Script

```bash
node scripts/migrate-to-firebase.js
```

The migration should now work without permission errors.

### Step 3: Switch Back to Production Rules (IMPORTANT!)

**After migration completes**, immediately switch back to secure rules:

1. Go to **Firestore Database** → **Rules** tab
2. Replace with production rules from `firestore.rules` file:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user is admin
    function isAdmin() {
      return isAuthenticated() && 
             request.auth.token.email != null &&
             request.auth.token.email.matches('.*@.*');
    }
    
    // Products collection
    match /products/{productId} {
      // Anyone can read products (public)
      allow read: if true;
      
      // Only authenticated admins can write
      allow create, update, delete: if isAdmin();
    }
    
    // Categories collection
    match /categories/{categoryId} {
      // Anyone can read categories (public)
      allow read: if true;
      
      // Only authenticated admins can write
      allow create, update, delete: if isAdmin();
    }
  }
}
```

3. Click **Publish**

## Why This Happens

- The migration script runs as a Node.js script (no user authentication)
- Production security rules require authenticated admin users
- Test mode temporarily allows all operations (needed for migration)

## After Migration

Once you've switched back to production rules:
- ✅ Public users can read products/categories
- ✅ Only authenticated admins can create/update/delete
- ✅ Your data is secure

---

**Quick Summary:**
1. Set Firestore to test mode → Run migration → Switch back to production rules
2. Total time: ~5 minutes
3. Your data will be secure after switching back
