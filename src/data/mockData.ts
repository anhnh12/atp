import { Product, Category } from "../types";

export const products: Product[] = [
  {
    id: 1,
    name: "Mũ Bảo Hộ Công Nghiệp",
    description:
      "Mũ bảo hộ chất lượng cao, đạt tiêu chuẩn an toàn quốc tế, chống va đập mạnh",
    price: 250000,
    image: "/images/products/helmet.jpg",
    categoryId: 1,
    stock: 50,
    rating: 4.5,
    reviews: 128,
  },
  {
    id: 2,
    name: "Găng Tay Bảo Hộ Chống Cắt",
    description:
      "Găng tay bảo hộ chống cắt, chống trượt, phù hợp cho công việc cơ khí và xây dựng",
    price: 120000,
    image: "/images/products/gloves.jpg",
    categoryId: 2,
    stock: 100,
    rating: 4.8,
    reviews: 95,
  },
  {
    id: 3,
    name: "Giày Bảo Hộ Thép",
    description:
      "Giày bảo hộ mũi thép, đế chống trượt, chống đinh, phù hợp cho công trường",
    price: 850000,
    image: "/images/products/boots.jpg",
    categoryId: 3,
    stock: 30,
    rating: 4.7,
    reviews: 76,
  },
  {
    id: 4,
    name: "Kính Bảo Hộ Trong Suốt",
    description:
      "Kính bảo hộ chống bụi, chống tia UV, chống trầy xước, tầm nhìn rõ ràng",
    price: 180000,
    image: "/images/products/goggles.jpg",
    categoryId: 4,
    stock: 75,
    rating: 4.6,
    reviews: 64,
  },
  {
    id: 5,
    name: "Áo Phản Quang An Toàn",
    description:
      "Áo phản quang chất lượng cao, tăng khả năng nhìn thấy trong điều kiện thiếu sáng",
    price: 200000,
    image: "/images/products/vest.jpg",
    categoryId: 5,
    stock: 60,
    rating: 4.4,
    reviews: 89,
  },
];

export const categories: Category[] = [
  {
    id: 1,
    name: "Bảo Vệ Đầu",
    description:
      "Các sản phẩm bảo vệ đầu chất lượng cao, đạt tiêu chuẩn an toàn",
    image: "/images/categories/head-protection.jpg",
    productCount: 15,
  },
  {
    id: 2,
    name: "Bảo Vệ Tay",
    description:
      "Găng tay bảo hộ đa dạng cho nhiều môi trường làm việc khác nhau",
    image: "/images/categories/hand-protection.jpg",
    productCount: 25,
  },
  {
    id: 3,
    name: "Bảo Vệ Chân",
    description: "Giày và ủng bảo hộ chất lượng cao cho mọi điều kiện làm việc",
    image: "/images/categories/foot-protection.jpg",
    productCount: 18,
  },
  {
    id: 4,
    name: "Bảo Vệ Mắt",
    description: "Kính và tấm chắn bảo vệ mắt khỏi các tác nhân gây hại",
    image: "/images/categories/eye-protection.jpg",
    productCount: 12,
  },
  {
    id: 5,
    name: "Quần Áo Bảo Hộ",
    description: "Trang phục bảo hộ chuyên dụng cho nhiều ngành nghề",
    image: "/images/categories/protective-clothing.jpg",
    productCount: 30,
  },
];
