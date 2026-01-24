/**
 * Data Mapper Utility
 * 
 * Maps API response structure to frontend Product/Category types
 * This allows using the same UI components without modification
 */

import { Product, Category } from '../types';
import { normalizeForSearch } from '../utils/vietnamese';

// API Response Types (matching backend DTOs)
interface ApiProductImage {
  id: number;
  url: string;
}

interface ApiProduct {
  id: number;
  category_id: number;
  product_code: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  views_count: number;
  images: ApiProductImage[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface ApiCategory {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
  created_at: string;
  updated_at: string;
}

/**
 * Maps API product to frontend Product type
 */
export function mapApiProductToProduct(apiProduct: ApiProduct): Product {
  // Calculate rating and reviews from views_count
  // This is a simple estimation - you can adjust based on actual data
  const baseRating = 4.0;
  const ratingVariation = (apiProduct.views_count % 10) / 10; // 0.0 to 0.9
  const rating = Math.min(5.0, baseRating + ratingVariation);
  const reviews = Math.floor(apiProduct.views_count * 0.08); // Estimate 8% of views are reviews

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    description: apiProduct.description,
    price: apiProduct.price,
    image: apiProduct.images[0]?.url || '', // Use first image as main image
    categoryId: apiProduct.category_id,
    stock: apiProduct.quantity,
    rating: Math.round(rating * 10) / 10, // Round to 1 decimal
    reviews: Math.max(0, reviews), // Ensure non-negative
  };
}

/**
 * Maps API category to frontend Category type
 */
export function mapApiCategoryToCategory(
  apiCategory: ApiCategory,
  productCount: number = 0
): Category {
  return {
    id: apiCategory.id,
    name: apiCategory.name,
    description: apiCategory.description,
    image: apiCategory.thumbnail,
    productCount: productCount,
  };
}

/**
 * Counts products per category
 */
export function countProductsByCategory(
  products: ApiProduct[]
): Record<number, number> {
  const counts: Record<number, number> = {};
  
  products.forEach((product) => {
    counts[product.category_id] = (counts[product.category_id] || 0) + 1;
  });
  
  return counts;
}

/**
 * Loads and maps all products from JSON
 */
export async function loadProducts(): Promise<Product[]> {
  const productsData = await import('./products.json');
  return productsData.products.map(mapApiProductToProduct);
}

/**
 * Loads and maps all categories from JSON
 */
export async function loadCategories(): Promise<Category[]> {
  const [categoriesData, productsData] = await Promise.all([
    import('./categories.json'),
    import('./products.json'),
  ]);

  const productCounts = countProductsByCategory(productsData.products);

  return categoriesData.categories.map((category) =>
    mapApiCategoryToCategory(category, productCounts[category.id] || 0)
  );
}

/**
 * Gets a single product by ID
 */
export async function getProductById(id: number): Promise<Product | null> {
  const productsData = await import('./products.json');
  const product = productsData.products.find((p) => p.id === id);
  
  if (!product) {
    return null;
  }
  
  return mapApiProductToProduct(product);
}

/**
 * Gets products by category ID
 */
export async function getProductsByCategoryId(
  categoryId: number
): Promise<Product[]> {
  const productsData = await import('./products.json');
  const filtered = productsData.products.filter(
    (p) => p.category_id === categoryId
  );
  
  return filtered.map(mapApiProductToProduct);
}

/**
 * Searches products by name or description (tone-mark-insensitive)
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const productsData = await import('./products.json');
  const normalizedQuery = normalizeForSearch(query);
  
  const filtered = productsData.products.filter(
    (p) =>
      normalizeForSearch(p.name).includes(normalizedQuery) ||
      normalizeForSearch(p.description).includes(normalizedQuery) ||
      p.tags.some((tag) => normalizeForSearch(tag).includes(normalizedQuery))
  );
  
  return filtered.map(mapApiProductToProduct);
}