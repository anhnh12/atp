import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getProductById, getProductWithImages, loadCategories } from '../data/dataMapper';
import { Product } from '../types';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
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

        const [productData, categories] = await Promise.all([
          getProductWithImages(productId),
          loadCategories(),
        ]);

        if (!productData) {
          setError('Không tìm thấy sản phẩm');
          setLoading(false);
          return;
        }

        setProduct(productData.product);
        setImages(productData.images.length > 0 ? productData.images : [productData.product.image]);
        setSelectedImageIndex(0);
        const foundCategory = categories.find((c) => c.id === productData.product.categoryId);
        setCategory(foundCategory);
        setLoading(false);
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải sản phẩm');
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // Keyboard navigation for image carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (images.length <= 1) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length]);

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
        {/* Product Images Carousel */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-100 overflow-hidden">
            {images.length > 0 ? (
              <>
                <img
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/500?text=No+Image';
                  }}
                />
                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-3 shadow-xl border-2 border-gray-200 transition-all hover:scale-110"
                      aria-label="Previous image"
                    >
                      <FaChevronLeft className="w-6 h-6 text-gray-900" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-3 shadow-xl border-2 border-gray-200 transition-all hover:scale-110"
                      aria-label="Next image"
                    >
                      <FaChevronRight className="w-6 h-6 text-gray-900" />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Không có hình ảnh
              </div>
            )}
            {product.stock === 0 && (
              <div className="absolute top-4 right-4">
                <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                  Hết hàng
                </span>
              </div>
            )}
            {product.stock > 0 && (
              <div className="absolute top-4 right-4">
                <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full">
                  Còn hàng
                </span>
              </div>
            )}
          </div>
          
          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-primary-600 ring-2 ring-primary-300'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/80?text=No+Image';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category */}
          {category && (
            <span className="inline-block text-primary-600 text-sm font-medium">
              {category.name}
            </span>
          )}

          {/* Product Name */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            {product.name}
          </h1>

          {/* Price */}
          {product.price > 0 && (
            <div className="border-t border-b border-gray-200 py-6">
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold text-primary-600">
                  {product.price.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          )}

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            {product.stock > 0 ? (
              <>
                <FaCheckCircle className="text-green-500" />
                <span className="text-green-600 font-medium">
                  Còn hàng
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
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
