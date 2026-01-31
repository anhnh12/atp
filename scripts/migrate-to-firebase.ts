/**
 * Migration Script: JSON to Firestore
 * 
 * This script migrates data from JSON files to Firestore.
 * 
 * Usage:
 * 1. Make sure Firebase is configured in src/config/firebase.ts
 * 2. Set environment variables or update firebaseConfig below
 * 3. Run: npx ts-node --esm scripts/migrate-to-firebase.ts
 * 
 * Note: This script should be run once to migrate existing data.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get current directory (ES module compatible)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase config - Replace with your actual config or use environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || 'YOUR_MESSAGING_SENDER_ID',
  appId: process.env.FIREBASE_APP_ID || 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface Product {
  id: number;
  category_id: number;
  product_code: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  views_count: number;
  images: Array<{ id: number; url: string }>;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
  created_at: string;
  updated_at: string;
}

async function migrateCategories() {
  console.log('Migrating categories...');
  
  const categoriesPath = path.join(__dirname, '../src/data/categories.json');
  const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));
  
  for (const category of categoriesData.categories) {
    try {
      await addDoc(collection(db, 'categories'), {
        name: category.name,
        description: category.description,
        thumbnail: category.thumbnail,
        created_at: Timestamp.fromDate(new Date(category.created_at)),
        updated_at: Timestamp.fromDate(new Date(category.updated_at)),
      });
      console.log(`✓ Migrated category: ${category.name}`);
    } catch (error) {
      console.error(`✗ Error migrating category ${category.name}:`, error);
    }
  }
  
  console.log('Categories migration complete!\n');
}

async function migrateProducts() {
  console.log('Migrating products...');
  
  const productsPath = path.join(__dirname, '../src/data/products.json');
  const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
  
  for (const product of productsData.products) {
    try {
      await addDoc(collection(db, 'products'), {
        category_id: product.category_id,
        product_code: product.product_code,
        name: product.name,
        description: product.description,
        quantity: product.quantity,
        price: product.price,
        views_count: product.views_count,
        images: product.images,
        tags: product.tags,
        created_at: Timestamp.fromDate(new Date(product.created_at)),
        updated_at: Timestamp.fromDate(new Date(product.updated_at)),
      });
      console.log(`✓ Migrated product: ${product.name}`);
    } catch (error) {
      console.error(`✗ Error migrating product ${product.name}:`, error);
    }
  }
  
  console.log('Products migration complete!\n');
}

async function main() {
  console.log('Starting migration to Firestore...\n');
  
  // Check if config is set
  if (firebaseConfig.apiKey === 'YOUR_API_KEY') {
    console.error('❌ Error: Firebase configuration not set!');
    console.log('\nPlease either:');
    console.log('1. Set environment variables:');
    console.log('   export FIREBASE_API_KEY=your_key');
    console.log('   export FIREBASE_PROJECT_ID=your_project_id');
    console.log('   # ... etc');
    console.log('\n2. Or edit this script and update firebaseConfig directly');
    process.exit(1);
  }
  
  try {
    await migrateCategories();
    await migrateProducts();
    
    console.log('✅ Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Verify data in Firebase Console');
    console.log('2. Update your app to use Firestore');
    console.log('3. Test the application');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
