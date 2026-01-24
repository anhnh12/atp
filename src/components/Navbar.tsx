import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMenu } from 'react-icons/fi';
import SearchBar from './SearchBar';
import logo from '../assets/logo.png';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="ATP Safety Gear" className="h-12 w-auto" />
          </Link>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          
          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center space-x-6 flex-1 max-w-2xl mx-4">
            <SearchBar className="flex-1" />
          </div>
          
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              to="/products"
              className="text-gray-600 hover:text-primary-600 transition-colors duration-300"
            >
              Sản phẩm
            </Link>
            <Link
              to="/categories"
              className="text-gray-600 hover:text-primary-600 transition-colors duration-300"
            >
              Danh mục
            </Link>
            <Link
              to="/about"
              className="text-gray-600 hover:text-primary-600 transition-colors duration-300"
            >
              Giới thiệu
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 hover:text-primary-600 transition-colors duration-300"
            >
              Liên hệ
            </Link>
          </div>

          {/* <div className="flex items-center space-x-4">
            <Link to="/contact" className="p-2 hover:bg-gray-100 rounded-full" title="Liên hệ">
              <FiUser className="w-6 h-6 text-gray-600" />
            </Link>
          </div> */}
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden ${
          isMenuOpen ? 'block' : 'hidden'
        } border-t border-gray-200`}
      >
        <div className="container mx-auto px-4 py-3 space-y-3">
          <SearchBar className="w-full" />
          <Link
            to="/products"
            className="block py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Sản phẩm
          </Link>
          <Link
            to="/categories"
            className="block py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Danh mục
          </Link>
          <Link
            to="/about"
            className="block py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Giới thiệu
          </Link>
          <Link
            to="/contact"
            className="block py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Liên hệ
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 