import { writable } from 'svelte/store';

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  category: Category;
  inventory: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  categoryIds?: string[];
  searchQuery?: string;
  page?: number;
  limit?: number;
}

export interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategories: string[];
  currentPage: number;
  pageSize: number;
  totalProducts: number;
}

function createProductStore() {
  const initialState: ProductState = {
    products: [],
    currentProduct: null,
    isLoading: false,
    error: null,
    searchQuery: '',
    selectedCategories: [],
    currentPage: 1,
    pageSize: 12,
    totalProducts: 0,
  };

  const { subscribe, set, update } = writable<ProductState>(initialState);

  return {
    subscribe,
    setProducts: (products: Product[], total: number) =>
      update(state => ({ ...state, products, totalProducts: total })),
    setCurrentProduct: (product: Product | null) =>
      update(state => ({ ...state, currentProduct: product })),
    setLoading: (isLoading: boolean) => update(state => ({ ...state, isLoading })),
    setError: (error: string | null) => update(state => ({ ...state, error })),
    setSearchQuery: (query: string) =>
      update(state => ({ ...state, searchQuery: query, currentPage: 1 })),
    setSelectedCategories: (categoryIds: string[]) =>
      update(state => ({ ...state, selectedCategories: categoryIds, currentPage: 1 })),
    setCurrentPage: (page: number) => update(state => ({ ...state, currentPage: page })),
    clearError: () => update(state => ({ ...state, error: null })),
  };
}

export const productStore = createProductStore();
