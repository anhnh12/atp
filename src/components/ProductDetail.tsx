import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaStar, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { getProductById, loadCategories } from '../data/dataMapper';
import { Product } from '../types';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError('ID sản phẩm không hợp lệ');
        setLoading(false);
        return;
      }

      try {
        const productId = parseInt(id, 10);
        if (isNaN(productId)) {
          setError('ID sản phẩm không hợp lệ');
          setLoading(false);
          return;
        }

        const [loadedProduct, categories] = await Promise.all([
          getProductById(productId),
          loadCategories(),
        ]);

        if (!loadedProduct) {
          setError('Không tìm thấy sản phẩm');
          setLoading(false);
          return;
        }

        setProduct(loadedProduct);
        const foundCategory = categories.find((c) => c.id === loadedProduct.categoryId);
        setCategory(foundCategory);
        setLoading(false);
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải sản phẩm');
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {error || 'Không tìm thấy sản phẩm'}
          </h1>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-gray-600 hover:text-primary-600 transition-colors"
      >
        <FaArrowLeft className="mr-2" />
        Quay lại
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative aspect-square bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/500?text=No+Image';
              }}
            />
            {product.stock < 10 && product.stock > 0 && (
              <div className="absolute top-4 right-4">
                <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                  Sắp hết hàng
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category */}
          {category && (
            <Link
              to={`/categories/${category.id}`}
              className="inline-block text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              {category.name}
            </Link>
          )}

          {/* Product Name */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={
                      index < Math.floor(product.rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                {product.rating.toFixed(1)} ({product.reviews} đánh giá)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="border-t border-b border-gray-200 py-6">
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold text-primary-600">
                {product.price.toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            {product.stock > 0 ? (
              <>
                <FaCheckCircle className="text-green-500" />
                <span className="text-green-600 font-medium">
                  Còn {product.stock} sản phẩm
                </span>
              </>
            ) : (
              <>
                <FaCheckCircle className="text-red-500" />
                <span className="text-red-600 font-medium">Hết hàng</span>
              </>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">Mô tả sản phẩm</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description || 'Chưa có mô tả cho sản phẩm này.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-4">
            {product.stock > 0 ? (
              <div className="space-y-3">
                <button
                  className="w-full py-3 px-6 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium text-lg"
                  onClick={() => {
                    // You can add contact functionality here
                    window.location.href = '/contact';
                  }}
                >
                  Liên hệ đặt hàng
                </button>
                <Link
                  to="/contact"
                  className="block w-full py-3 px-6 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium text-center"
                >
                  Xem thông tin liên hệ
                </Link>
              </div>
            ) : (
              <button
                disabled
                className="w-full py-3 px-6 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed font-medium text-lg"
              >
                Hết hàng
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Related Products Section (Optional) */}
      {category && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Sản phẩm cùng danh mục
            </h2>
            <Link
              to={`/categories/${category.id}`}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Xem tất cả →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
