import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useSearchParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import CategoryProducts from './components/CategoryProducts';
import ProductDetail from './components/ProductDetail';
import About from './components/About';
import Contact from './components/Contact';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import ProductManager from './components/admin/ProductManager';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { loadProducts, loadCategories, searchProducts } from './data/dataMapper';
import { Product } from './types';
import { isAdminSubdomain, getBasePath } from './utils/subdomain';


const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (searchQuery) {
        const results = await searchProducts(searchQuery);
        setProducts(results);
        setCategories([]);
      } else {
        const [allProducts, allCategories] = await Promise.all([
          loadProducts(),
          loadCategories(),
        ]);
        setProducts(allProducts);
        setCategories(allCategories);
      }
      setLoading(false);
    };
    loadData();
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Đang tải...</div>
      </div>
    );
  }

  // Show search results
  if (searchQuery) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Kết quả tìm kiếm: "{searchQuery}"
        </h1>
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Không tìm thấy sản phẩm nào với từ khóa "{searchQuery}"
            </p>
          </div>
        ) : (
          <ProductList products={products} />
        )}
      </div>
    );
  }

  // Show products grouped by categories
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Tất Cả Sản Phẩm
      </h1>
      <div className="space-y-12">
        {categories.map((category) => (
          <CategoryProducts
            key={category.id}
            categoryId={category.id}
            categoryName={category.name}
            products={products}
          />
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  // Handle GitHub Pages 404.html redirect format: /?/path
  // This happens when GitHub Pages can't find a file and serves 404.html
  // The 404.html redirects to /?/path, and we need to extract the path
  if (typeof window !== 'undefined') {
    const search = window.location.search;
    
    // Check if URL is in format /?/path (from 404.html redirect)
    if (search.startsWith('?/')) {
      // Extract the path from query string
      // Format: /?/products becomes /products
      const redirectPath = '/' + search.slice(2).split('&')[0].replace(/~and~/g, '&');
      const hash = window.location.hash;
      
      // Update URL without page reload
      window.history.replaceState(null, '', redirectPath + hash);
    }
  }
  
  // Check if we're on admin subdomain
  const onAdminSubdomain = isAdminSubdomain();
  
  // Get basename for routing
  const basename = getBasePath();

  // If on admin subdomain, show only admin routes
  if (onAdminSubdomain) {
    return (
      <Router basename={basename}>
        <Routes>
          <Route path="/" element={<AdminLogin />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ProductManager />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          {/* Redirect root to dashboard if logged in, login if not */}
          <Route path="*" element={<AdminLogin />} />
        </Routes>
      </Router>
    );
  }

  // Main website routes (localhost or main domain)
  return (
    <Router basename={basename}>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/*"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<ProductsPage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
        
        {/* Admin Routes (path-based for localhost/main domain) - No Navbar/Footer */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ProductManager />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App; 