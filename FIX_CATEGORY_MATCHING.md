# 🔧 Fix: Categories Not Matching Products

## Problem

Products reference categories by numeric `category_id` (1, 2, 3), but categories in Firestore only have string document IDs, so they don't match. This causes:
- Products not showing under their categories
- Category product counts showing 0
- Empty product lists

## Solution

You have two options:

### Option 1: Re-migrate Categories (Recommended)

The migration script has been updated to preserve the original `id` field. Re-migrate categories:

1. **Delete existing categories in Firestore**:
   - Go to Firebase Console → Firestore Database
   - Select all category documents
   - Delete them

2. **Re-run migration** (only categories):
   - The updated script now includes the `id` field
   - Run: `node scripts/migrate-to-firebase.js`
   - Or manually run just the categories part

### Option 2: Manually Add ID Field

If you don't want to re-migrate, manually add the `id` field to each category:

1. Go to Firebase Console → Firestore Database → `categories` collection
2. For each category, add a field:
   - **Field name**: `id`
   - **Field type**: `number`
   - **Value**: 
     - First category: `1`
     - Second category: `2`
     - Third category: `3`
     - (Match the order from your original JSON)

## Updated Code

The `dataMapper.ts` has been updated to:
- Check for `id` field in categories
- Use it to match with products' `category_id`
- Fallback to index-based matching if `id` doesn't exist

## After Fix

Once categories have the `id` field:
- ✅ Products will match to their categories
- ✅ Category product counts will be correct
- ✅ Products will display on the homepage

---

**Quick Fix**: Re-migrate categories with the updated script, or manually add `id` field in Firestore console.
