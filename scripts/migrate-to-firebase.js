/**
 * Migration Script: JSON to Firestore (CommonJS Version)
 * 
 * This script migrates data from JSON files to Firestore.
 * 
 * Usage:
 * 1. Make sure Firebase is configured in .env file (with REACT_APP_ prefix)
 * 2. Run: node scripts/migrate-to-firebase.js
 * 
 * Note: This script automatically reads from .env file
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Load .env file if it exists
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf-8');
  envFile.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
        // Support both REACT_APP_ prefix and without prefix
        const envKey = key.replace(/^REACT_APP_/, '');
        if (!process.env[envKey]) {
          process.env[envKey] = value;
        }
      }
    }
  });
}

// Firebase config - Reads from .env file (supports REACT_APP_ prefix)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || 'YOUR_MESSAGING_SENDER_ID',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateCategories() {
  console.log('Migrating categories...');
  
  const categoriesPath = path.join(__dirname, '../src/data/categories.json');
  const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));
  
  for (const category of categoriesData.categories) {
    try {
      await addDoc(collection(db, 'categories'), {
        id: category.id, // Preserve original numeric ID for matching with products
        name: category.name,
        description: category.description,
        thumbnail: category.thumbnail,
        created_at: Timestamp.fromDate(new Date(category.created_at)),
        updated_at: Timestamp.fromDate(new Date(category.updated_at)),
      });
      console.log(`✓ Migrated category: ${category.name} (ID: ${category.id})`);
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
    console.error('❌ Error: Firebase configuration not found!');
    console.log('\nPlease make sure your .env file exists with:');
    console.log('   REACT_APP_FIREBASE_API_KEY=your_api_key');
    console.log('   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com');
    console.log('   REACT_APP_FIREBASE_PROJECT_ID=your_project_id');
    console.log('   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com');
    console.log('   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id');
    console.log('   REACT_APP_FIREBASE_APP_ID=your_app_id');
    console.log('\nThe script will automatically read from .env file.');
    console.log('Then run: node scripts/migrate-to-firebase.js');
    process.exit(1);
  }
  
  try {
    await migrateCategories();
    await migrateProducts();
    
    console.log('✅ Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Verify data in Firebase Console → Firestore Database');
    console.log('2. Your app is already configured to use Firestore');
    console.log('3. Test the application');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
