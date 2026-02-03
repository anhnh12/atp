import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

const SLIDE_INTERVAL_MS = 2000;
const SLIDE_DURATION_MS = 1000;

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const images = product.images && product.images.length > 1 ? product.images : [product.image].filter(Boolean);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [product.id]);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % images.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(t);
  }, [images.length]);

  const isMultiImage = images.length > 1;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <Link to={`/products/${product.id}`}>
        <div className="relative h-48 overflow-hidden bg-gray-200">
          {isMultiImage ? (
            <div
              className="flex h-full"
              style={{
                width: `${images.length * 100}%`,
                transform: `translateX(-${currentIndex * (100 / images.length)}%)`,
                transition: `transform ${SLIDE_DURATION_MS}ms ease-in-out`,
              }}
            >
              {images.map((url, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 h-full"
                  style={{ width: `${100 / images.length}%` }}
                >
                  <img
                    src={url}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <img
              src={images[0] || product.image}
              alt={product.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          )}
          {product.stock > 0 ? (
            <div className="absolute top-2 right-2 z-20">
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Còn hàng
              </span>
            </div>
          ) : (
            <div className="absolute top-2 right-2 z-20">
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Hết hàng
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
          <div className="flex justify-between items-center mb-3">
            {product.price > 0 ? (
            <span className="text-lg font-bold text-primary-600">
              {product.price.toLocaleString('vi-VN')}đ
            </span>
            ) : (
              <span className="text-sm text-gray-500">Liên hệ</span>
            )}
          </div>
        </div>
        <Link
          to={`/products/${product.id}`}
          className="w-full py-2 px-4 rounded-md transition-colors duration-300 text-center block bg-primary-600 text-white hover:bg-primary-700"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
};

export default ProductCard; 