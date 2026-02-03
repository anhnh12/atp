/**
 * Data Mapper Utility
 * 
 * Maps Firestore data to frontend Product/Category types
 * This allows using the same UI components without modification
 */

import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  query,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product, Category } from '../types';
import { normalizeForSearch } from '../utils/vietnamese';

// Firestore Product Type
interface FirestoreProduct {
  id?: string;
  category_id: string; // Now uses Firestore document ID (string)
  name: string;
  description: string;
  inStock?: boolean; // Whether product is in stock (optional for backward compatibility)
  quantity?: number; // Old field for backward compatibility (if inStock is not present)
  price?: number; // Optional price
  views_count: number;
  images: Array<{ id: number; url: string }>;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

// Firestore Category Type
interface FirestoreCategory {
  id?: string;
  name: string;
  description: string;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

/**
 * Converts Firestore document ID to numeric ID
 * Uses a simple hash function to convert string IDs to numbers
 */
function docIdToNumber(docId: string): number {
  // Simple hash function to convert string to number
  let hash = 0;
  for (let i = 0; i < docId.length; i++) {
    const char = docId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Ensure positive number and reasonable range
  return Math.abs(hash) % 1000000;
}

/**
 * Maps Firestore product to frontend Product type
 */
function mapFirestoreProductToProduct(firestoreProduct: FirestoreProduct, docId: string): Product {
  // category_id is now a Firestore document ID (string), convert to number for frontend
  const categoryIdNumber = typeof firestoreProduct.category_id === 'string' 
    ? docIdToNumber(firestoreProduct.category_id)
    : firestoreProduct.category_id;

  // Handle backward compatibility: check for inStock boolean first, then fall back to quantity
  let inStock = false;
  if (firestoreProduct.inStock !== undefined) {
    // New format: boolean inStock field
    inStock = firestoreProduct.inStock;
  } else if ((firestoreProduct as any).quantity !== undefined) {
    // Old format: quantity field - if quantity > 0, then in stock
    inStock = (firestoreProduct as any).quantity > 0;
  }

  const imageUrls = firestoreProduct.images?.map((img) => img.url) ?? [];
  return {
    id: docIdToNumber(docId), // Convert Firestore string ID to numeric ID
    name: firestoreProduct.name,
    description: firestoreProduct.description,
    price: firestoreProduct.price || 0, // Default to 0 if not provided
    image: imageUrls[0] || '',
    images: imageUrls.length > 0 ? imageUrls : undefined,
    categoryId: categoryIdNumber, // Convert Firestore doc ID to number for frontend
    stock: inStock ? 1 : 0, // Convert boolean to number (1 = in stock, 0 = out of stock)
    rating: 0, // No hardcoded ratings
    reviews: 0, // No hardcoded reviews
  };
}

/**
 * Maps Firestore category to frontend Category type
 */
function mapFirestoreCategoryToCategory(
  firestoreCategory: FirestoreCategory,
  docId: string,
  productCount: number = 0
): Category {
  return {
    id: docIdToNumber(docId), // Convert Firestore string ID to numeric ID
    name: firestoreCategory.name,
    description: firestoreCategory.description,
    image: '', // No longer using category images
    productCount: productCount,
  };
}

/**
 * Counts products per category
 * Returns a map of category Firestore doc ID (string) to product count
 */
async function countProductsByCategory(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    snapshot.docs.forEach((doc) => {
      const data = doc.data() as FirestoreProduct;
      const categoryId = String(data.category_id); // Firestore doc ID (string)
      counts[categoryId] = (counts[categoryId] || 0) + 1;
  });
  } catch (error) {
    console.error('Error counting products by category:', error);
  }
  
  return counts;
}

/**
 * Loads and maps all products from Firestore
 */
export async function loadProducts(): Promise<Product[]> {
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    return snapshot.docs.map((doc) => 
      mapFirestoreProductToProduct(doc.data() as FirestoreProduct, doc.id)
    );
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

/**
 * Loads and maps all categories from Firestore
 */
export async function loadCategories(): Promise<Category[]> {
  try {
    const [categoriesSnapshot, productCounts] = await Promise.all([
      getDocs(collection(db, 'categories')),
      countProductsByCategory(),
  ]);

    // Map categories: use Firestore doc ID converted to number for frontend
    return categoriesSnapshot.docs.map((doc) => {
      const data = doc.data() as FirestoreCategory;
      const firestoreDocId = doc.id; // Firestore document ID (string)
      const categoryIdNumber = docIdToNumber(firestoreDocId); // Convert to number for frontend
      
      // Get product count using the Firestore doc ID
      const productCount = productCounts[firestoreDocId] || 0;

      return {
        id: categoryIdNumber, // Numeric ID for frontend compatibility
        name: data.name,
        description: data.description,
        image: '', // No longer using category images
        productCount: productCount,
      };
    });
  } catch (error) {
    console.error('Error loading categories:', error);
    return [];
  }
}

/**
 * Gets a single product by ID with all images
 * Note: Since we're converting Firestore string IDs to numeric IDs,
 * we need to load all products and find by the converted ID
 */
export async function getProductById(id: number): Promise<Product | null> {
  try {
    const products = await loadProducts();
    return products.find((p) => p.id === id) || null;
  } catch (error) {
    console.error('Error getting product by ID:', error);
    return null;
  }
}

/**
 * Gets a product with all images from Firestore
 */
export async function getProductWithImages(id: number): Promise<{ product: Product; images: string[] } | null> {
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    const productDoc = snapshot.docs.find((doc) => {
      const numericId = docIdToNumber(doc.id);
      return numericId === id;
    });
    
    if (!productDoc) {
      return null;
    }
    
    const firestoreProduct = productDoc.data() as FirestoreProduct;
    const product = mapFirestoreProductToProduct(firestoreProduct, productDoc.id);
    const images = firestoreProduct.images?.map(img => img.url) || [];
    
    return { product, images };
  } catch (error) {
    console.error('Error getting product with images:', error);
    return null;
  }
}

/**
 * Gets products by category ID (numeric ID from frontend)
 * Converts numeric ID to Firestore doc ID for querying
 */
export async function getProductsByCategoryId(categoryId: number): Promise<Product[]> {
  try {
    // Load all categories to find the one matching the numeric ID
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    const matchingCategory = categoriesSnapshot.docs.find(doc => {
      const numericId = docIdToNumber(doc.id);
      return numericId === categoryId;
    });
    
    if (!matchingCategory) {
      return [];
    }
    
    // Query products by Firestore document ID
    const q = query(collection(db, 'products'), where('category_id', '==', matchingCategory.id));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) =>
      mapFirestoreProductToProduct(doc.data() as FirestoreProduct, doc.id)
    );
  } catch (error) {
    console.error('Error getting products by category:', error);
    return [];
  }
}

/**
 * Searches products by name or description (tone-mark-insensitive)
 */
export async function searchProducts(queryText: string): Promise<Product[]> {
  try {
    const normalizedQuery = normalizeForSearch(queryText);
    const allProducts = await loadProducts();
    
    return allProducts.filter(
      (product) =>
        normalizeForSearch(product.name).includes(normalizedQuery) ||
        normalizeForSearch(product.description).includes(normalizedQuery)
    );
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
}
}
