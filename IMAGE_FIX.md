# 🖼️ Fix: Random Images on Reload

## Problem

Products show different images every time you reload because the image URLs in Firestore are using `picsum.photos` with random parameters, which generates a new random image on each request.

## Solution

### Option 1: Update Images in Firestore (Recommended)

1. Go to Firebase Console → Firestore Database → `products` collection
2. For each product, update the `images` array:
   - Replace `https://picsum.photos/800/600?random=1` 
   - With a fixed URL like: `https://picsum.photos/seed/product1/800/600`
   - Or use your actual product images

**Using Picsum with Seed (Fixed Images)**:
- `https://picsum.photos/seed/product1/800/600` - Always shows same image
- `https://picsum.photos/seed/product2/800/600` - Different but consistent image
- Change `product1`, `product2` for each product

### Option 2: Upload Real Images

1. Use the admin panel to upload product images
2. Images will be stored in Firebase Storage
3. URLs will be permanent and consistent

### Option 3: Use Placeholder Service with Fixed IDs

Replace random URLs with fixed placeholder services:
- `https://via.placeholder.com/800x600?text=Product+1`
- `https://placehold.co/800x600/0066CC/FFFFFF?text=Product+1`

---

## Quick Fix Script

If you want to update all products at once, you can use this in Firebase Console → Firestore:

1. Go to each product document
2. Update the `images` array
3. Change `random=1` to `seed=product1` (or use actual image URLs)

**Example**:
```json
// Before
"images": [{"id": 1, "url": "https://picsum.photos/800/600?random=1"}]

// After (using seed for consistency)
"images": [{"id": 1, "url": "https://picsum.photos/seed/product1/800/600"}]

// Or use actual images
"images": [{"id": 1, "url": "https://your-cdn.com/products/product1.jpg"}]
```

---

## Best Practice

**For Production**: Upload real product images using the admin panel. They'll be stored in Firebase Storage with permanent URLs.

**For Development**: Use Picsum with seeds for consistent placeholder images.
