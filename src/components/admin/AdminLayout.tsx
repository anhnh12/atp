import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiPackage, FiTag } from 'react-icons/fi';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <Link 
              to={window.location.hostname.startsWith('admin.') ? '/dashboard' : '/admin'} 
              className="text-xl font-bold text-primary-600"
            >
              ATP Admin
            </Link>
          </div>
          <nav className="p-4 space-y-2">
            <Link
              to={window.location.hostname.startsWith('admin.') ? '/dashboard' : '/admin'}
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiHome />
              <span>Tổng quan</span>
            </Link>
            <Link
              to={window.location.hostname.startsWith('admin.') ? '/categories' : '/admin/categories'}
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiTag />
              <span>Danh mục</span>
            </Link>
            <Link
              to={window.location.hostname.startsWith('admin.') ? '/products' : '/admin/products'}
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiPackage />
              <span>Sản phẩm</span>
            </Link>
            <Link
              to="/"
              target="_blank"
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiHome />
              <span>Xem website</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
