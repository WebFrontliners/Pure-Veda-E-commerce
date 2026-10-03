import { Category, Product, FilterState, Order } from '../types';
import { fallbackCategories, fallbackProducts } from '../data/fallbackData';

const API_BASE = '/api';

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
  } catch (err) {
    console.warn('[API] Using local fallback categories for Vercel/offline deployment:', err);
    return fallbackCategories;
  }
}

export async function fetchProducts(filters: Partial<FilterState> = {}): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'all') {
      params.append('category', filters.category);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.sort) {
      params.append('sort', filters.sort);
    }
    if (filters.minPrice !== undefined) {
      params.append('minPrice', filters.minPrice.toString());
    }
    if (filters.maxPrice !== undefined) {
      params.append('maxPrice', filters.maxPrice.toString());
    }

    const queryString = params.toString();
    const url = `${API_BASE}/products${queryString ? `?${queryString}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
  } catch (err) {
    console.warn('[API] Using local fallback products for Vercel/offline deployment:', err);
    return fallbackProducts;
  }
}

export async function fetchProductById(idOrSlug: string | number): Promise<Product> {
  try {
    const res = await fetch(`${API_BASE}/products/${idOrSlug}`);
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
  } catch (err) {
    const found = fallbackProducts.find((p) => p.id === Number(idOrSlug) || p.slug === idOrSlug);
    if (found) return found;
    return fallbackProducts[0];
  }
}

export interface PlaceOrderPayload {
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  items: { product_id: number; quantity: number }[];
}

export async function submitOrder(payload: PlaceOrderPayload): Promise<{ message: string; order: Order }> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to submit order');
  }
  return data;
}

// ================= ADMIN CLIENT API ================= //

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  lowStockCount: number;
  shippedOrders: number;
  paidOrders: number;
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const res = await fetch(`${API_BASE}/admin/stats`);
  if (!res.ok) throw new Error('Failed to fetch admin stats');
  return res.json();
}

export async function fetchAdminOrders(): Promise<Order[]> {
  const res = await fetch(`${API_BASE}/admin/orders`);
  if (!res.ok) throw new Error('Failed to fetch admin orders');
  return res.json();
}

export async function updateOrderStatusApi(orderId: number, status: 'pending' | 'paid' | 'shipped'): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update order status');
}

export async function createAdminProductApi(product: Partial<Product>): Promise<Product> {
  const res = await fetch(`${API_BASE}/admin/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create product');
  return data.product;
}

export async function updateAdminProductApi(id: number, updates: Partial<Product>): Promise<Product> {
  const res = await fetch(`${API_BASE}/admin/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update product');
  return data.product;
}

export async function deleteAdminProductApi(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/products/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete product');
}

