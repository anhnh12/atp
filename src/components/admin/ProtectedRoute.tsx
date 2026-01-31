import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Hooks must be called at the top level - not conditionally
  const { user, loading, isAdmin, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Check if on admin subdomain
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    const isAdminSubdomain = hostname.startsWith('admin.') || 
                             (hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname.split('.').length >= 3 && hostname.split('.')[0] === 'admin');
    
    return <Navigate to={isAdminSubdomain ? '/login' : '/admin/login'} replace />;
  }

  if (!isAdmin) {
    const handleLogout = async () => {
      try {
        await logout();
        // Check if on admin subdomain
        const hostname = window.location.hostname;
        const isAdminSubdomain = hostname.startsWith('admin.') || 
                                 (hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname.split('.').length >= 3 && hostname.split('.')[0] === 'admin');
        
        if (isAdminSubdomain) {
          window.location.href = '/login';
        } else {
          window.location.href = '/admin/login';
        }
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Không có quyền truy cập
          </h1>
          <p className="text-gray-600 mb-4">
            Bạn không có quyền truy cập trang quản trị.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Email của bạn: {user.email}
          </p>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Đăng xuất và đăng nhập tài khoản khác
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
