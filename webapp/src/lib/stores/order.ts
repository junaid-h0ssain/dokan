import { writable } from 'svelte/store';

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilters {
  statuses?: OrderStatus[];
  page?: number;
  limit?: number;
}

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  statusFilter: OrderStatus[];
  currentPage: number;
  pageSize: number;
  totalOrders: number;
}

function createOrderStore() {
  const initialState: OrderState = {
    orders: [],
    currentOrder: null,
    isLoading: false,
    error: null,
    statusFilter: [],
    currentPage: 1,
    pageSize: 10,
    totalOrders: 0,
  };

  const { subscribe, set, update } = writable<OrderState>(initialState);

  return {
    subscribe,
    setOrders: (orders: Order[], total: number) =>
      update(state => ({ ...state, orders, totalOrders: total })),
    setCurrentOrder: (order: Order | null) =>
      update(state => ({ ...state, currentOrder: order })),
    setLoading: (isLoading: boolean) => update(state => ({ ...state, isLoading })),
    setError: (error: string | null) => update(state => ({ ...state, error })),
    setStatusFilter: (statuses: OrderStatus[]) =>
      update(state => ({ ...state, statusFilter: statuses, currentPage: 1 })),
    setCurrentPage: (page: number) => update(state => ({ ...state, currentPage: page })),
    clearError: () => update(state => ({ ...state, error: null })),
  };
}

export const orderStore = createOrderStore();
