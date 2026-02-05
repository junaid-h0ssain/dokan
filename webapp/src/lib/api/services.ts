import { get, post, put, del, type ApiResponse } from './client';
import type { User, AuthState } from '../stores/auth';
import type { Product, Category, ProductFilters } from '../stores/product';
import type { Order, OrderFilters, OrderStatus } from '../stores/order';
import type { CartItem } from '../stores/cart';

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

// Authentication endpoints
export async function register(
  email: string,
  password: string
): Promise<ApiResponse<AuthResponse>> {
  return post<AuthResponse>('/auth/register', { email, password });
}

export async function login(
  email: string,
  password: string
): Promise<ApiResponse<AuthResponse>> {
  return post<AuthResponse>('/auth/login', { email, password });
}

// Logout is handled client-side by clearing the token
export async function logout(): Promise<void> {
  // Client-side logout - clear token from localStorage
  localStorage.removeItem('auth_token');
}

// Product endpoints
export async function getProducts(
  page: number = 1,
  limit: number = 12,
  filters?: ProductFilters
): Promise<ApiResponse<ProductListResponse>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filters?.searchQuery) {
    params.append('search', filters.searchQuery);
  }

  if (filters?.categoryIds && filters.categoryIds.length > 0) {
    params.append('categories', filters.categoryIds.join(','));
  }

  return get<ProductListResponse>(`/public/products?${params.toString()}`);
}

export async function getProductById(id: string): Promise<ApiResponse<Product>> {
  return get<Product>(`/public/products/${id}`);
}

export async function searchProducts(query: string): Promise<ApiResponse<Product[]>> {
  return get<Product[]>(`/public/products/search?q=${encodeURIComponent(query)}`);
}

// Category endpoints
export async function getCategories(): Promise<ApiResponse<Category[]>> {
  return get<Category[]>('/public/categories');
}

export async function createCategory(name: string): Promise<ApiResponse<Category>> {
  return post<Category>('/public/categories', { name });
}

export async function updateCategory(
  id: string,
  name: string
): Promise<ApiResponse<Category>> {
  return put<Category>(`/public/categories/${id}`, { name });
}

export async function deleteCategory(id: string): Promise<ApiResponse<void>> {
  return del<void>(`/public/categories/${id}`);
}

// Order endpoints
export async function getOrders(
  page: number = 1,
  limit: number = 10,
  filters?: OrderFilters
): Promise<ApiResponse<OrderListResponse>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filters?.statuses && filters.statuses.length > 0) {
    params.append('statuses', filters.statuses.join(','));
  }

  return get<OrderListResponse>(`/public/orders?${params.toString()}`);
}

export async function getOrderById(id: string): Promise<ApiResponse<Order>> {
  return get<Order>(`/public/orders/${id}`);
}

export async function createOrder(items: CartItem[]): Promise<ApiResponse<Order>> {
  return post<Order>('/public/orders', { items });
}

export async function cancelOrder(id: string): Promise<ApiResponse<void>> {
  return put<void>(`/public/orders/${id}/cancel`, {});
}

// Cart endpoints
export async function getCart(): Promise<ApiResponse<{ items: CartItem[] }>> {
  return get<{ items: CartItem[] }>('/public/cart');
}

export async function addToCart(
  productId: string,
  quantity: number
): Promise<ApiResponse<{ items: CartItem[] }>> {
  return post<{ items: CartItem[] }>('/public/cart/items', { productId, quantity });
}

export async function removeFromCart(productId: string): Promise<ApiResponse<void>> {
  return del<void>(`/public/cart/items/${productId}`);
}

export async function updateCartItem(
  productId: string,
  quantity: number
): Promise<ApiResponse<{ items: CartItem[] }>> {
  return put<{ items: CartItem[] }>(`/public/cart/items/${productId}`, { quantity });
}

export async function clearCart(): Promise<ApiResponse<void>> {
  return del<void>('/public/cart');
}
