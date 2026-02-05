import { writable } from 'svelte/store';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  inventory: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  isLoading: boolean;
  error: string | null;
}

function createCartStore() {
  const initialState: CartState = {
    items: JSON.parse(localStorage.getItem('cart') || '[]'),
    total: 0,
    isLoading: false,
    error: null,
  };

  const { subscribe, set, update } = writable<CartState>(initialState);

  // Calculate total whenever items change
  const calculateTotal = (items: CartItem[]) => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  return {
    subscribe,
    addItem: (product: Product, quantity: number) => {
      update(state => {
        const existingItem = state.items.find(item => item.productId === product.id);
        let newItems: CartItem[];

        if (existingItem) {
          newItems = state.items.map(item =>
            item.productId === product.id
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  subtotal: (item.quantity + quantity) * product.price,
                }
              : item
          );
        } else {
          newItems = [
            ...state.items,
            {
              productId: product.id,
              product,
              quantity,
              subtotal: quantity * product.price,
            },
          ];
        }

        localStorage.setItem('cart', JSON.stringify(newItems));
        return {
          ...state,
          items: newItems,
          total: calculateTotal(newItems),
        };
      });
    },
    removeItem: (productId: string) => {
      update(state => {
        const newItems = state.items.filter(item => item.productId !== productId);
        localStorage.setItem('cart', JSON.stringify(newItems));
        return {
          ...state,
          items: newItems,
          total: calculateTotal(newItems),
        };
      });
    },
    updateQuantity: (productId: string, quantity: number) => {
      update(state => {
        const newItems = state.items.map(item =>
          item.productId === productId
            ? {
                ...item,
                quantity,
                subtotal: quantity * item.product.price,
              }
            : item
        );
        localStorage.setItem('cart', JSON.stringify(newItems));
        return {
          ...state,
          items: newItems,
          total: calculateTotal(newItems),
        };
      });
    },
    clearCart: () => {
      localStorage.removeItem('cart');
      set({ items: [], total: 0, isLoading: false, error: null });
    },
    setLoading: (isLoading: boolean) => update(state => ({ ...state, isLoading })),
    setError: (error: string | null) => update(state => ({ ...state, error })),
  };
}

export const cartStore = createCartStore();
