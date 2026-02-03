import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FiPackage, FiTag, FiTrendingUp } from 'react-icons/fi';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    loading: true,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [productsSnapshot, categoriesSnapshot] = await Promise.all([
          getDocs(collection(db, 'products')),
          getDocs(collection(db, 'categories')),
        ]);

        setStats({
          products: productsSnapshot.size,
          categories: categoriesSnapshot.size,
          loading: false,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    loadStats();
  }, []);

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tổng quan</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Products Card */}
        <Link
          to={window.location.hostname.startsWith('admin.') ? '/products' : '/admin/products'}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Tổng sản phẩm</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {stats.products}
              </p>
            </div>
            <div className="bg-primary-100 rounded-full p-3">
              <FiPackage className="w-8 h-8 text-primary-600" />
            </div>
          </div>
        </Link>

        {/* Categories Card (display only; categories managed from product form) */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Tổng danh mục</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {stats.categories}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <FiTag className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Thao tác nhanh</p>
              <p className="text-lg font-semibold text-gray-800 mt-2">
                Quản lý dữ liệu
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <FiTrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Thao tác nhanh
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to={window.location.hostname.startsWith('admin.') ? '/products' : '/admin/products'}
            className="px-4 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-center font-medium"
          >
            Thêm sản phẩm mới
          </Link>
          <p className="text-sm text-gray-500 self-center">
            Danh mục thêm/chỉnh sửa từ dropdown trong form sản phẩm.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
