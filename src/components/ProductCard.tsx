import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { FaStar } from 'react-icons/fa';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <Link to={`/products/${product.id}`}>
        <div className="relative h-48">
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover relative z-10"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          {product.stock < 10 && product.stock > 0 && (
            <div className="absolute top-2 right-2 z-20">
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Sắp hết hàng
              </span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold mb-2 hover:text-primary-600 transition-colors duration-300 line-clamp-2 text-gray-800">
            {product.name || 'Tên sản phẩm'}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {product.description}
        </p>
        {/* Spacer to push bottom section down */}
        <div className="flex-grow"></div>
        <div>
          <div className="flex items-center mb-2">
            <div className="flex items-center text-yellow-400">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={index < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-gray-600 text-sm ml-2">
              ({product.reviews} đánh giá)
            </span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-bold text-primary-600">
              {product.price.toLocaleString('vi-VN')}đ
            </span>
            <span className="text-sm text-gray-500">
              {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
            </span>
          </div>
        </div>
        <Link
          to={`/products/${product.id}`}
          className={`w-full py-2 px-4 rounded-md transition-colors duration-300 text-center block ${
            product.stock > 0
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.stock > 0 ? 'Xem chi tiết' : 'Hết hàng'}
        </Link>
      </div>
    </div>
  );
};

export default ProductCard; 