import React, { useState, useRef, useEffect } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FiEdit, FiTrash2, FiPlus, FiChevronDown } from 'react-icons/fi';

export interface CategoryOption {
  id: string;
  name: string;
}

interface CategoryDropdownProps {
  categories: CategoryOption[];
  onCategoriesChange: () => Promise<void>;
  value: string;
  onChange: (categoryId: string) => void;
  onShowToast?: (message: string, type: 'success' | 'error') => void;
  disabled?: boolean;
  required?: boolean;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  categories,
  onCategoriesChange,
  value,
  onChange,
  onShowToast,
  disabled = false,
  required = false,
}) => {
  const showToast = (message: string, type: 'success' | 'error') => {
    if (onShowToast) onShowToast(message, type);
    else alert(message);
  };
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryNameInput, setCategoryNameInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCategory = categories.find((c) => c.id === value);
  const displayLabel = selectedCategory ? selectedCategory.name : 'Chọn danh mục';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openCreateModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen(false);
    setModalMode('create');
    setEditingCategoryId(null);
    setCategoryNameInput('');
    setModalOpen(true);
  };

  const openEditModal = (e: React.MouseEvent, category: CategoryOption) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen(false);
    setModalMode('edit');
    setEditingCategoryId(category.id);
    setCategoryNameInput(category.name);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategoryId(null);
    setCategoryNameInput('');
  };

  const saveCategory = async () => {
    const name = categoryNameInput.trim();
    if (!name) {
      showToast('Vui lòng nhập tên danh mục', 'error');
      return;
    }
    try {
      setSaving(true);
      if (modalMode === 'edit' && editingCategoryId) {
        await updateDoc(doc(db, 'categories', editingCategoryId), {
          name,
          updated_at: Timestamp.now(),
        });
        showToast('Cập nhật danh mục thành công!', 'success');
      } else {
        const ref = await addDoc(collection(db, 'categories'), {
          name,
          description: '',
          created_at: Timestamp.now(),
          updated_at: Timestamp.now(),
        });
        onChange(ref.id);
        showToast('Thêm danh mục thành công!', 'success');
      }
      await onCategoriesChange();
      closeModal();
    } catch (error: any) {
      console.error('Error saving category:', error);
      showToast(error?.message || 'Lỗi khi lưu danh mục', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, categoryId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen(false);
    setDeleteConfirmId(categoryId);
  };

  const handleDeleteConfirm = async (confirmed: boolean) => {
    if (!deleteConfirmId) return;
    if (!confirmed) {
      setDeleteConfirmId(null);
      return;
    }
    try {
      await deleteDoc(doc(db, 'categories', deleteConfirmId));
      if (value === deleteConfirmId) {
        onChange('');
      }
      await onCategoriesChange();
      showToast('Xóa danh mục thành công!', 'success');
    } catch (error: any) {
      console.error('Error deleting category:', error);
      showToast(error?.message || 'Lỗi khi xóa danh mục', 'error');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleSelectCategory = (categoryId: string) => {
    onChange(categoryId);
    setDropdownOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setDropdownOpen((o) => !o)}
        disabled={disabled}
        className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-left flex items-center justify-between ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
        } ${required && !value ? 'border-amber-400' : ''}`}
      >
        <span className={!value ? 'text-gray-500' : ''}>{displayLabel}</span>
        <FiChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {dropdownOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg flex flex-col max-h-64">
          <div className="overflow-y-auto flex-1 min-h-0">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between group px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => handleSelectCategory(category.id)}
                  className="flex-1 text-left py-1 pr-2"
                >
                  {category.name}
                </button>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => openEditModal(e, category)}
                    className="p-1.5 text-primary-600 hover:bg-primary-50 rounded"
                    title="Chỉnh sửa"
                  >
                    <FiEdit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteClick(e, category.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                    title="Xóa"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="w-full flex items-center gap-2 px-4 py-3 text-primary-600 hover:bg-primary-50 font-medium border-t border-gray-200 rounded-b-md flex-shrink-0 bg-white"
          >
            <FiPlus className="w-4 h-4" />
            Thêm danh mục
          </button>
        </div>
      )}

      {/* Create/Edit category modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={closeModal}>
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {modalMode === 'edit' ? 'Chỉnh sửa danh mục' : 'Thêm danh mục'}
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục *</label>
              <input
                type="text"
                value={categoryNameInput}
                onChange={(e) => setCategoryNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    void saveCategory();
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-4"
                placeholder="Ví dụ: Áo Bảo Hộ"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => void saveCategory()}
                  disabled={saving}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  {saving ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
            <p className="text-gray-800 mb-4">
              Bạn có chắc chắn muốn xóa danh mục này?
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => handleDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => handleDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
