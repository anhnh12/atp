# Static Data Files

This folder contains static JSON data files for the ATP Safety Equipment website.

## File Structure

```
data/
├── categories.json    # Product categories
├── products.json      # Product listings
├── contact.json       # Company contact information
└── README.md         # This file
```

## Data Format

### Categories (`categories.json`)

Matches the API `CategoryResponse` structure:

```json
{
  "categories": [
    {
      "id": 1,
      "name": "Áo Bảo Hộ",
      "description": "...",
      "thumbnail": "https://...",
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Products (`products.json`)

Matches the API `ProductResponse` structure:

```json
{
  "products": [
    {
      "id": 1,
      "category_id": 1,
      "product_code": "ABH-001",
      "name": "Áo Phản Quang An Toàn Loại 1",
      "description": "...",
      "quantity": 45,
      "price": 250000,
      "views_count": 1250,
      "images": [
        {
          "id": 1,
          "url": "https://..."
        }
      ],
      "tags": ["phản quang", "an toàn"],
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-20T14:30:00Z"
    }
  ]
}
```

### Contact (`contact.json`)

Company contact information:

```json
{
  "company_name": "ATP Safety Equipment",
  "address": {...},
  "contact": {...},
  "business_hours": {...},
  "social_media": {...}
}
```

## Usage

### Import in TypeScript/JavaScript

```typescript
import categoriesData from './data/categories.json';
import productsData from './data/products.json';
import contactData from './data/contact.json';

const categories = categoriesData.categories;
const products = productsData.products;
const contact = contactData;
```

### Mapping to Frontend Types

If you need to map from API structure to frontend `Product` type:

```typescript
import { Product } from '../types';
import productsData from './data/products.json';

function mapToFrontendProduct(apiProduct: any): Product {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    description: apiProduct.description,
    price: apiProduct.price,
    image: apiProduct.images[0]?.url || '',
    categoryId: apiProduct.category_id,
    stock: apiProduct.quantity,
    rating: 4.5, // Default or calculate from reviews
    reviews: Math.floor(apiProduct.views_count * 0.1) // Estimate from views
  };
}

const products: Product[] = productsData.products.map(mapToFrontendProduct);
```

## Updating Data

1. Edit the JSON files directly
2. Ensure JSON syntax is valid
3. Maintain the structure matching API responses
4. Commit changes to Git
5. Static site will rebuild automatically

## Image URLs

Currently using placeholder images from Unsplash. Replace with actual product images:

1. Upload images to your CDN (Cloudinary, S3, etc.)
2. Update the `url` field in `images` array
3. Ensure images are optimized (WebP format, appropriate sizes)

## Notes

- All content is in Vietnamese
- Prices are in Vietnamese Dong (VND)
- Product codes follow pattern: `[Category]-[Number]`
  - ABH = Áo Bảo Hộ
  - MBH = Mũ Bảo Hộ
  - GBH = Giày Bảo Hộ