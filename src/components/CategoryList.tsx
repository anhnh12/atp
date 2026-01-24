import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';

interface CategoryListProps {
  categories: Category[];
}

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/categories/${category.id}`}
          className="group block"
        >
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48">
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover relative z-10"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary-600 transition-colors duration-300">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {category.description}
              </p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {category.productCount} sản phẩm
                </span>
                <span className="text-primary-600 group-hover:text-primary-700">
                  Xem chi tiết →
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList; 