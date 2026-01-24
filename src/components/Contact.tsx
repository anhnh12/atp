import React, { useState, useEffect } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock, FiFacebook, FiYoutube, FiGlobe } from 'react-icons/fi';

interface ContactData {
  company_name: string;
  company_name_vi: string;
  address: {
    street: string;
    ward: string;
    district: string;
    city: string;
    country: string;
    postal_code: string;
  };
  contact: {
    phone: {
      primary: string;
      mobile: string;
      hotline: string;
    };
    email: {
      general: string;
      sales: string;
      support: string;
    };
    website: string;
  };
  business_hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
    timezone: string;
  };
  social_media: {
    facebook?: string;
    zalo?: string;
    youtube?: string;
  };
}

const Contact: React.FC = () => {
  const [data, setData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const contactData = await import('../data/contact.json');
        setData(contactData.default || contactData);
      } catch (error) {
        console.error('Error loading contact data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the form data to a backend
    alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Đang tải...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">Không thể tải dữ liệu</div>
      </div>
    );
  }

  const fullAddress = `${data.address.street}, ${data.address.ward}, ${data.address.district}, ${data.address.city}, ${data.address.country}`;

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Liên Hệ</h1>
          <p className="text-xl text-primary-100 max-w-3xl">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi qua bất kỳ phương thức nào bạn thuận tiện.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Thông Tin Liên Hệ</h2>

            {/* Address */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-start">
                <FiMapPin className="w-6 h-6 text-primary-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Địa Chỉ</h3>
                  <p className="text-gray-600 leading-relaxed">{fullAddress}</p>
                  <p className="text-gray-500 text-sm mt-1">Mã bưu điện: {data.address.postal_code}</p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-start">
                <FiPhone className="w-6 h-6 text-primary-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Điện Thoại</h3>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium">Điện thoại:</span>{' '}
                      <a href={`tel:${data.contact.phone.primary}`} className="text-primary-600 hover:underline">
                        {data.contact.phone.primary}
                      </a>
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Di động:</span>{' '}
                      <a href={`tel:${data.contact.phone.mobile}`} className="text-primary-600 hover:underline">
                        {data.contact.phone.mobile}
                      </a>
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Hotline:</span>{' '}
                      <a href={`tel:${data.contact.phone.hotline}`} className="text-primary-600 hover:underline">
                        {data.contact.phone.hotline}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-start">
                <FiMail className="w-6 h-6 text-primary-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Email</h3>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium">Tổng đài:</span>{' '}
                      <a href={`mailto:${data.contact.email.general}`} className="text-primary-600 hover:underline">
                        {data.contact.email.general}
                      </a>
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Bán hàng:</span>{' '}
                      <a href={`mailto:${data.contact.email.sales}`} className="text-primary-600 hover:underline">
                        {data.contact.email.sales}
                      </a>
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Hỗ trợ:</span>{' '}
                      <a href={`mailto:${data.contact.email.support}`} className="text-primary-600 hover:underline">
                        {data.contact.email.support}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-start">
                <FiClock className="w-6 h-6 text-primary-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Giờ Làm Việc</h3>
                  <div className="space-y-2 text-gray-600">
                    <p><span className="font-medium">Thứ 2 - Thứ 6:</span> {data.business_hours.weekdays}</p>
                    <p><span className="font-medium">Thứ 7:</span> {data.business_hours.saturday}</p>
                    <p><span className="font-medium">Chủ Nhật:</span> {data.business_hours.sunday}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Mạng Xã Hội</h3>
              <div className="flex space-x-4">
                {data.social_media.facebook && (
                  <a
                    href={data.social_media.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 hover:bg-primary-200 transition-colors"
                  >
                    <FiFacebook className="w-6 h-6" />
                  </a>
                )}
                {data.social_media.youtube && (
                  <a
                    href={data.social_media.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 hover:bg-primary-200 transition-colors"
                  >
                    <FiYoutube className="w-6 h-6" />
                  </a>
                )}
                {data.contact.website && (
                  <a
                    href={data.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 hover:bg-primary-200 transition-colors"
                  >
                    <FiGlobe className="w-6 h-6" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Gửi Tin Nhắn</h2>
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
              <div className="mb-6">
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  Họ và Tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                  Số Điện Thoại
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0123 456 789"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                  Chủ Đề <span className="text-red-500">*</span>
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Chọn chủ đề</option>
                  <option value="product">Tư vấn sản phẩm</option>
                  <option value="order">Đặt hàng</option>
                  <option value="support">Hỗ trợ kỹ thuật</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                  Tin Nhắn <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Nhập tin nhắn của bạn..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-300"
              >
                Gửi Tin Nhắn
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;