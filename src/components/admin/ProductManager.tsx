import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  Timestamp,
  query,
  orderBy 
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { uploadMultipleImages, deleteImage } from '../../utils/imageUpload';
import { FiEdit, FiTrash2, FiArrowLeft, FiX } from 'react-icons/fi';
import TagInput from './TagInput';

interface Product {
  id: string;
  category_id: string; // Firestore document ID (string)
  product_code: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  views_count: number;
  images: Array<{ id: number; url: string }>;
  tags: string[];
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

interface Category {
  id: string; // Firestore document ID
  name: string;
}

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category_id: '',
    product_code: '',
    name: '',
    description: '',
    quantity: 0,
    price: 0,
    priceDisplay: '', // For formatted display
    tags: [] as string[],
    images: [] as string[],
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsSnapshot, categoriesSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'products'), orderBy('created_at', 'desc'))),
        getDocs(collection(db, 'categories')),
      ]);

      const productsData = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      const categoriesData = categoriesSnapshot.docs.map((doc) => {
        const data = doc.data();
        // Use Firestore document ID (doc.id) as the category ID
        // Ignore any numeric 'id' field in the data - we use Firestore doc IDs now
        return {
          id: doc.id, // Firestore document ID - this is what we'll use for category_id
          name: data.name || '',
        };
      }) as Category[];
      
      console.log('Loaded categories:', categoriesData.map(c => ({ id: c.id, name: c.name })));

      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const removeImageFile = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeImageUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploading(true);

      // Upload new images
      let newImageUrls: string[] = [];
      if (imageFiles.length > 0) {
        const productId = editingId || 'temp';
        newImageUrls = await uploadMultipleImages(imageFiles, `products/${productId}`);
      }

      // Combine existing and new image URLs
      const allImageUrls = [...formData.images, ...newImageUrls];
      const images = allImageUrls.map((url, index) => ({
        id: index + 1,
        url,
      }));

      // Get category - use Firestore document ID directly
      if (!formData.category_id || formData.category_id.trim() === '') {
        alert('Vui lòng chọn danh mục');
        setUploading(false);
        return;
      }
      
      const selectedCategory = categories.find(cat => cat.id === formData.category_id);
      
      if (!selectedCategory) {
        console.error('Category not found:', {
          selectedId: formData.category_id,
          availableCategories: categories.map(c => ({ id: c.id, name: c.name }))
        });
        alert('Vui lòng chọn danh mục hợp lệ. Danh mục không tồn tại.');
        setUploading(false);
        return;
      }
      
      // Use Firestore document ID as category_id (stored as string reference)
      const categoryId = selectedCategory.id;
      
      console.log('Selected category:', {
        categoryId,
        categoryName: selectedCategory.name,
        formCategoryId: formData.category_id
      });

      // Parse price (remove commas for storage)
      const priceValue = parseFloat(formData.priceDisplay.replace(/,/g, '')) || formData.price;

      // Prepare product data
      const productData = {
        category_id: categoryId, // Use Firestore document ID
        product_code: formData.product_code,
        name: formData.name,
        description: formData.description,
        quantity: formData.quantity,
        price: priceValue,
        views_count: editingId 
          ? products.find((p) => p.id === editingId)?.views_count || 0
          : 0,
        images,
        tags: formData.tags,
        updated_at: Timestamp.now(),
      };

      if (editingId) {
        // Update existing product
        const productRef = doc(db, 'products', editingId);
        await updateDoc(productRef, productData);
        alert('Cập nhật sản phẩm thành công!');
      } else {
        // Add new product
        await addDoc(collection(db, 'products'), {
          ...productData,
          created_at: Timestamp.now(),
        });
        alert('Thêm sản phẩm thành công!');
      }

      resetForm();
      loadData();
    } catch (error: any) {
      console.error('Error saving product:', error);
      alert(error.message || 'Lỗi khi lưu sản phẩm');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    
    // Find category by Firestore document ID (product.category_id is now the Firestore doc ID)
    const category = categories.find(cat => cat.id === product.category_id);
    
    setFormData({
      category_id: category?.id || '', // Use Firestore document ID for dropdown
      product_code: product.product_code,
      name: product.name,
      description: product.description,
      quantity: product.quantity,
      price: product.price,
      priceDisplay: formatPriceFromNumber(product.price),
      tags: product.tags || [],
      images: product.images.map((img) => img.url),
    });
    setImageFiles([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      return;
    }
    try {
      // Delete images from storage
      for (const image of product.images) {
        try {
          await deleteImage(image.url);
        } catch (error) {
          console.warn('Error deleting image:', error);
        }
      }

      // Delete product document
      await deleteDoc(doc(db, 'products', product.id));
      alert('Xóa sản phẩm thành công!');
      loadData();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Lỗi khi xóa sản phẩm');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      category_id: '',
      product_code: '',
      name: '',
      description: '',
      quantity: 0,
      price: 0,
      priceDisplay: '',
      tags: [],
      images: [],
    });
    setImageFiles([]);
  };

  const getCategoryName = (categoryId: string | number) => {
    // categoryId can be string (Firestore doc ID) or number (legacy)
    const category = categories.find((c) => 
      c.id === String(categoryId) || c.id === categoryId
    );
    return category?.name || 'N/A';
  };

  const formatPrice = (value: string): string => {
    // Remove all non-digit characters (including dots and commas)
    const numericValue = value.replace(/\D/g, '');
    // Format with commas
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  const formatPriceFromNumber = (value: number): string => {
    // Convert number to string and format with commas
    const numericString = Math.floor(value).toString();
    return numericString.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPrice(e.target.value);
    const numericValue = parseFloat(formatted.replace(/,/g, '')) || 0;
    setFormData({
      ...formData,
      price: numericValue,
      priceDisplay: formatted,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Sản phẩm</h1>
        <Link
          to={window.location.hostname.startsWith('admin.') ? '/dashboard' : '/admin'}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft />
          <span>Quay lại</span>
        </Link>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {editingId ? 'Chỉnh sửa Sản phẩm' : 'Thêm Sản phẩm Mới'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục *
              </label>
              <select
                required
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã sản phẩm *
              </label>
              <input
                type="text"
                required
                value={formData.product_code}
                onChange={(e) => setFormData({ ...formData, product_code: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ví dụ: ABH-001"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên sản phẩm *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ví dụ: Áo Phản Quang An Toàn"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Mô tả chi tiết về sản phẩm..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số lượng *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá (VNĐ) *
              </label>
              <input
                type="text"
                required
                value={formData.priceDisplay}
                onChange={handlePriceChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="1,000,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <TagInput
                tags={formData.tags}
                onChange={(tags) => setFormData({ ...formData, tags })}
                placeholder="Nhập tag và nhấn Enter, Tab hoặc dấu phẩy"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hình ảnh sản phẩm
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">
              Có thể chọn nhiều hình ảnh. Kích thước tối đa: 5MB mỗi hình.
            </p>

            {/* Preview new images */}
            {imageFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Hình ảnh mới:</p>
                <div className="grid grid-cols-4 gap-4">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImageFile(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Existing images */}
            {formData.images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Hình ảnh hiện có:</p>
                <div className="grid grid-cols-4 gap-4">
                  {formData.images.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Image ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImageUrl(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Đang tải lên...' : editingId ? 'Cập nhật' : 'Thêm mới'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Danh sách Sản phẩm ({products.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hình ảnh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số lượng
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="h-16 w-16 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/64?text=No+Image';
                        }}
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {product.product_code}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getCategoryName(product.category_id)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.price.toLocaleString('vi-VN')}đ
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <FiEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManager;
