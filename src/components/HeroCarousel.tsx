import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const slides = [
  {
    id: 1,
    image: '/images/hero/slide1.jpg',
    title: 'Thiết Bị Bảo Hộ Chất Lượng Cao',
    description: 'Đảm bảo an toàn tối đa cho người lao động',
  },
  {
    id: 2,
    image: '/images/hero/slide2.jpg',
    title: 'Đa Dạng Sản Phẩm',
    description: 'Phù hợp cho mọi ngành nghề và môi trường làm việc',
  },
  {
    id: 3,
    image: '/images/hero/slide3.jpg',
    title: 'Tiêu Chuẩn An Toàn Quốc Tế',
    description: 'Đạt các chứng nhận an toàn hàng đầu thế giới',
  },
];

const HeroCarousel: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: true,
  };

  return (
    <div className="relative">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id} className="relative">
            <div className="aspect-w-16 aspect-h-7">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white text-center px-4">
                <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
                <p className="text-xl max-w-2xl">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroCarousel; 