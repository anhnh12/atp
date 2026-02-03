export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  /** All image URLs for carousel; if not set, only `image` is used */
  images?: string[];
  categoryId: number;
  stock: number;
  rating: number;
  reviews: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
