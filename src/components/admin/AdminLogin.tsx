import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FcGoogle } from 'react-icons/fc';

const AdminLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      // Check if on admin subdomain
      const hostname = window.location.hostname;
      const isAdminSubdomain = hostname.startsWith('admin.') || 
                               (hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname.split('.').length >= 3 && hostname.split('.')[0] === 'admin');
      
      if (isAdminSubdomain) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/admin', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await loginWithGoogle();
      
      // Check if on admin subdomain
      const hostname = window.location.hostname;
      const isAdminSubdomain = hostname.startsWith('admin.') || 
                               (hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname.split('.').length >= 3 && hostname.split('.')[0] === 'admin');
      
      if (isAdminSubdomain) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/admin', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập Quản trị
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Vui lòng đăng nhập bằng tài khoản Google được cấp quyền
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                <span>Đang đăng nhập...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <FcGoogle className="w-5 h-5 mr-2" />
                <span>Đăng nhập với Google</span>
              </div>
            )}
          </button>

          <div className="text-center text-sm text-gray-500">
            <p>Chỉ các tài khoản được cấp quyền mới có thể truy cập.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
