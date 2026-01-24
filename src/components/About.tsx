import React, { useState, useEffect } from 'react';
import { FiAward, FiUsers, FiPackage, FiShield, FiTruck, FiHeadphones, FiCheckCircle } from 'react-icons/fi';

interface AboutData {
  company: {
    name: string;
    name_en: string;
    established: string;
    description: string;
    mission: string;
    vision: string;
    values: Array<{
      title: string;
      description: string;
    }>;
  };
  statistics: {
    years_experience: number;
    products_sold: number;
    happy_customers: number;
    certifications: number;
  };
  certifications: Array<{
    name: string;
    description: string;
  }>;
  services: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  team: {
    description: string;
    members: Array<{
      name: string;
      position: string;
      experience: string;
    }>;
  };
}

const About: React.FC = () => {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const aboutData = await import('../data/about.json');
        setData(aboutData.default || aboutData);
      } catch (error) {
        console.error('Error loading about data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'consultation':
        return <FiUsers className="w-8 h-8" />;
      case 'delivery':
        return <FiTruck className="w-8 h-8" />;
      case 'warranty':
        return <FiShield className="w-8 h-8" />;
      case 'support':
        return <FiHeadphones className="w-8 h-8" />;
      default:
        return <FiCheckCircle className="w-8 h-8" />;
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Giới Thiệu</h1>
          <p className="text-xl text-primary-100 max-w-3xl">
            {data.company.description}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Company Info */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Về Công Ty</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Tên Công Ty</h3>
                <p className="text-gray-600 mb-4">{data.company.name}</p>
                <p className="text-gray-500 italic">{data.company.name_en}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Thành Lập</h3>
                <p className="text-gray-600">Năm {data.company.established}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <FiAward className="mr-2 text-primary-600" />
                Sứ Mệnh
              </h3>
              <p className="text-gray-600 leading-relaxed">{data.company.mission}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <FiShield className="mr-2 text-primary-600" />
                Tầm Nhìn
              </h3>
              <p className="text-gray-600 leading-relaxed">{data.company.vision}</p>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Thành Tựu</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {data.statistics.years_experience}+
              </div>
              <div className="text-gray-600">Năm Kinh Nghiệm</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {data.statistics.products_sold.toLocaleString('vi-VN')}+
              </div>
              <div className="text-gray-600">Sản Phẩm Đã Bán</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {data.statistics.happy_customers.toLocaleString('vi-VN')}+
              </div>
              <div className="text-gray-600">Khách Hàng Hài Lòng</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {data.statistics.certifications}+
              </div>
              <div className="text-gray-600">Chứng Nhận</div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Giá Trị Cốt Lõi</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.company.values.map((value, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Dịch Vụ Của Chúng Tôi</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center">
                <div className="text-primary-600 mb-4 flex justify-center">
                  {getServiceIcon(service.icon)}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Chứng Nhận & Tiêu Chuẩn</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.certifications.map((cert, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
                <FiAward className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{cert.name}</h3>
                <p className="text-gray-600 text-sm">{cert.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Đội Ngũ</h2>
          <p className="text-gray-600 text-center mb-8">{data.team.description}</p>
          <div className="grid md:grid-cols-3 gap-6">
            {data.team.members.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-24 h-24 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FiUsers className="w-12 h-12 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-2">{member.position}</p>
                <p className="text-gray-600 text-sm">{member.experience}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;