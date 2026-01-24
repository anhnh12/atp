import React from 'react';
import { useCart } from '../hooks/useCart';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';

const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart } = useCart();

  const total = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-800">Giỏ hàng trống</h2>
        <p className="text-gray-600 mt-2">Hãy thêm một số sản phẩm vào giỏ hàng của bạn</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Giỏ Hàng</h2>
        <button
          onClick={clearCart}
          className="text-red-500 hover:text-red-600 flex items-center"
        >
          <FiTrash2 className="w-5 h-5 mr-1" />
          Xóa Giỏ Hàng
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                <p className="text-gray-600">{item.product.price.toFixed(2)}đ</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    updateQuantity(item.product.id, Math.max(0, item.quantity - 1))
                  }
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <FiMinus className="w-5 h-5" />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.product.id, item.quantity + 1)
                  }
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <FiPlus className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={() => removeItem(item.product.id)}
                className="text-red-500 hover:text-red-600"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-800">Tổng cộng:</span>
          <span className="text-2xl font-bold text-primary-600">
            {total.toFixed(2)}đ
          </span>
        </div>
        <button className="w-full bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 transition-colors duration-300">
          Tiến Hành Thanh Toán
        </button>
      </div>
    </div>
  );
};

export default Cart; 