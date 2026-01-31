import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiLogOut, FiHome, FiPackage, FiTag } from 'react-icons/fi';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      // Check if on admin subdomain
      const hostname = window.location.hostname;
      const isAdminSubdomain = hostname.startsWith('admin.') || 
                               (hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname.split('.').length >= 3 && hostname.split('.')[0] === 'admin');
      
      if (isAdminSubdomain) {
        navigate('/login', { replace: true });
      } else {
        navigate('/admin/login', { replace: true });
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link 
                to={window.location.hostname.startsWith('admin.') ? '/dashboard' : '/admin'} 
                className="text-xl font-bold text-primary-600"
              >
                ATP Admin
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiLogOut />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen border-r border-gray-200">
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
