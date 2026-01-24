import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface CategoryProductsProps {
  categoryId: number;
  categoryName: string;
  products: Product[];
}

const CategoryProducts: React.FC<CategoryProductsProps> = ({
  categoryId,
  categoryName,
  products,
}) => {
  // Get top 4 products by rating
  const topProducts = [...products]
    .filter((product) => product.categoryId === categoryId)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  if (topProducts.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <Link
          to={`/categories/${categoryId}`}
          className="text-2xl font-bold text-gray-800 hover:text-primary-600 transition-colors duration-300"
        >
          {categoryName}
        </Link>
        <Link
          to={`/categories/${categoryId}`}
          className="text-primary-600 hover:text-primary-700 flex items-center"
        >
          Xem tất cả →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
        {topProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default CategoryProducts; 