import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  collection, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FiEdit, FiTrash2, FiArrowLeft } from 'react-icons/fi';

interface Category {
  id: string;
  name: string;
  description: string;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = snapshot.docs.map((doc) => {
        const data = doc.data();
        // Use Firestore document ID, ignore any numeric 'id' field from data
        return {
          id: doc.id, // Firestore document ID (string)
          name: data.name || '',
          description: data.description || '',
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
      }) as Category[];
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
      alert('Lỗi khi tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploading(true);
      
      // Validate required fields
      if (!formData.name.trim()) {
        alert('Vui lòng nhập tên danh mục');
        setUploading(false);
        return;
      }
      
      if (editingId) {
        // Update existing category
        const categoryRef = doc(db, 'categories', editingId);
        const categoryDoc = await getDoc(categoryRef);
        
        if (!categoryDoc.exists()) {
          alert('Danh mục không tồn tại');
          setUploading(false);
          return;
        }
        
        // Update existing category
        await updateDoc(categoryRef, {
          name: formData.name.trim(),
          description: formData.description.trim(),
          updated_at: Timestamp.now(),
        });
        alert('Cập nhật danh mục thành công!');
      } else {
        // Add new category - Firebase will auto-generate document ID
        await addDoc(collection(db, 'categories'), {
          name: formData.name.trim(),
          description: formData.description.trim(),
          created_at: Timestamp.now(),
          updated_at: Timestamp.now(),
        });
        alert('Thêm danh mục thành công!');
      }
      resetForm();
      loadCategories();
    } catch (error: any) {
      console.error('Error saving category:', error);
      console.error('Error details:', {
        code: error?.code,
        message: error?.message,
        stack: error?.stack,
      });
      
      let errorMessage = 'Lỗi không xác định';
      if (error?.code === 'permission-denied') {
        errorMessage = 'Không có quyền truy cập. Vui lòng đăng nhập lại.';
      } else if (error?.code === 'not-found') {
        errorMessage = 'Danh mục không tồn tại.';
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      alert('Lỗi khi lưu danh mục: ' + errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (category: Category) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      return;
    }
    try {
      // Ensure category.id is a string (Firestore document ID)
      const categoryId = typeof category.id === 'string' ? category.id : String(category.id);
      
      await deleteDoc(doc(db, 'categories', categoryId));
      alert('Xóa danh mục thành công!');
      loadCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      console.error('Category data:', category);
      const errorMessage = error?.message || String(error);
      alert('Lỗi khi xóa danh mục: ' + errorMessage);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
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
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Danh mục</h1>
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
          {editingId ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục Mới'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên danh mục *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ví dụ: Áo Bảo Hộ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Mô tả về danh mục..."
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Đang tải lên...' : (editingId ? 'Cập nhật' : 'Thêm mới')}
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

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Danh sách Danh mục ({categories.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {category.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-md truncate">
                      {category.description || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <FiEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
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
          {categories.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Chưa có danh mục nào. Hãy thêm danh mục đầu tiên!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
