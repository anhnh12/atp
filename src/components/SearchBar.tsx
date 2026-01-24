import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import { Product } from '../types';
import { loadProducts, loadCategories } from '../data/dataMapper';
import { normalizeForSearch } from '../utils/vietnamese';

interface SearchBarProps {
  onSearch?: (results: Product[]) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load products and categories
    const loadData = async () => {
      const [loadedProducts, loadedCategories] = await Promise.all([
        loadProducts(),
        loadCategories(),
      ]);
      setProducts(loadedProducts);
      setCategories(loadedCategories);
    };
    loadData();
  }, []);

  // Sync search query with URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlQuery = params.get('search') || '';
    setSearchQuery(urlQuery);
  }, [location.search]);

  const performSearch = (query: string) => {
    if (!query.trim()) {
      // Show all products when search is empty
      if (onSearch) {
        onSearch(products);
      }
      // Update URL to remove search param
      navigate('/products', { replace: true });
      return;
    }

    const normalizedQuery = normalizeForSearch(query);
    
    // Search in products (tone-mark-insensitive)
    const productResults = products.filter(
      (product) =>
        normalizeForSearch(product.name).includes(normalizedQuery) ||
        normalizeForSearch(product.description).includes(normalizedQuery)
    );

    // Search in categories and include their products (tone-mark-insensitive)
    const categoryResults = categories.filter((category) =>
      normalizeForSearch(category.name).includes(normalizedQuery)
    );

    const categoryProductIds = new Set(
      categoryResults.map((cat) => cat.id)
    );
    
    const categoryProducts = products.filter((product) =>
      categoryProductIds.has(product.categoryId)
    );

    // Combine and deduplicate results
    const allResults = [
      ...productResults,
      ...categoryProducts.filter(
        (p) => !productResults.some((pr) => pr.id === p.id)
      ),
    ];

    if (onSearch) {
      onSearch(allResults);
    }

    // Update URL with search query
    navigate(`/products?search=${encodeURIComponent(query)}`, { replace: true });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer for debounced search
    debounceTimer.current = setTimeout(() => {
      performSearch(query);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Clear debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    // Perform search immediately
    performSearch(searchQuery);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSearchQuery('');
    // Clear debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    // Show all products
    performSearch('');
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative ${className}`}
      onFocus={() => setIsOpen(true)}
      onBlur={(e) => {
        // Don't close if clicking on results
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setTimeout(() => setIsOpen(false), 200);
        }
      }}
    >
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Tìm kiếm sản phẩm hoặc danh mục..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;