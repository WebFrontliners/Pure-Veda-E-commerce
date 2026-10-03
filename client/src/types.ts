export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  rating: number;
  variants_info?: string;
  created_at?: string;
  category_name?: string;
  category_slug?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id?: number;
  order_id?: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
  product_name?: string;
  product_image?: string;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  total_amount: number;
  status: 'pending' | 'paid' | 'shipped';
  created_at: string;
  items: OrderItem[];
}

export interface FilterState {
  category: string;
  search: string;
  sort: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface DealerEnquiry {
  full_name: string;
  business_name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  pin_code: string;
  business_type: string;
  current_business: string;
  message: string;
}
