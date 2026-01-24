import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useSearchParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import CategoryList from './components/CategoryList';
import HeroCarousel from './components/HeroCarousel';
import CategoryProducts from './components/CategoryProducts';
import About from './components/About';
import Contact from './components/Contact';
import { loadProducts, loadCategories, searchProducts } from './data/dataMapper';
import { Product } from './types';

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const categoryId = parseInt(id || '0', 10);
  const [category, setCategory] = useState<any>(null);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [loadedProducts, loadedCategories] = await Promise.all([
        loadProducts(),
        loadCategories(),
      ]);
      const foundCategory = loadedCategories.find((c) => c.id === categoryId);
      const filtered = loadedProducts.filter((p) => p.categoryId === categoryId);
      setCategory(foundCategory);
      setCategoryProducts(filtered);
      setLoading(false);
    };
    loadData();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Đang tải...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Không tìm thấy danh mục
        </h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        {category.name}
      </h1>
      <p className="text-gray-600 mb-8">{category.description}</p>
      <ProductList products={categoryProducts} />
    </div>
  );
};

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const loadedCategories = await loadCategories();
      setCategories(loadedCategories);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Tất Cả Danh Mục
      </h1>
      <CategoryList categories={categories} />
    </div>
  );
};

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
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<ProductsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route
              path="/categories"
              element={
                <CategoriesPage />
              }
            />
            <Route path="/categories/:id" element={<CategoryPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App; 