import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { cartStore } from '../../lib/stores/cart';
import type { Product } from '../../lib/stores/cart';

describe('cartStore', () => {
  const testProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'A test product',
    price: 100,
    categoryId: 'cat-1',
    inventory: 10,
    imageUrl: 'https://example.com/image.jpg',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  beforeEach(() => {
    localStorage.clear();
    cartStore.clearCart();
  });

  afterEach(() => {
    localStorage.clear();
    cartStore.clearCart();
  });

  it('should initialize with empty cart', () => {
    let state;
    const unsubscribe = cartStore.subscribe(s => {
      state = s;
    });

    expect(state?.items).toEqual([]);
    expect(state?.total).toBe(0);
    expect(state?.isLoading).toBe(false);
    expect(state?.error).toBeNull();

    unsubscribe();
  });

  it('should add item to cart', () => {
    let state;
    const unsubscribe = cartStore.subscribe(s => {
      state = s;
    });

    cartStore.addItem(testProduct, 2);

    expect(state?.items).toHaveLength(1);
    expect(state?.items[0].productId).toBe('1');
    expect(state?.items[0].quantity).toBe(2);
    expect(state?.items[0].subtotal).toBe(200);
    expect(state?.total).toBe(200);

    unsubscribe();
  });

  it('should increase quantity when adding duplicate item', () => {
    let state;
    const unsubscribe = cartStore.subscribe(s => {
      state = s;
    });

    cartStore.addItem(testProduct, 2);
    cartStore.addItem(testProduct, 3);

    expect(state?.items).toHaveLength(1);
    expect(state?.items[0].quantity).toBe(5);
    expect(state?.items[0].subtotal).toBe(500);
    expect(state?.total).toBe(500);

    unsubscribe();
  });

  it('should remove item from cart', () => {
    let state;
    const unsubscribe = cartStore.subscribe(s => {
      state = s;
    });

    cartStore.addItem(testProduct, 2);
    expect(state?.items).toHaveLength(1);

    cartStore.removeItem('1');

    expect(state?.items).toHaveLength(0);
    expect(state?.total).toBe(0);

    unsubscribe();
  });

  it('should update item quantity', () => {
    let state;
    const unsubscribe = cartStore.subscribe(s => {
      state = s;
    });

    cartStore.addItem(testProduct, 2);
    cartStore.updateQuantity('1', 5);

    expect(state?.items[0].quantity).toBe(5);
    expect(state?.items[0].subtotal).toBe(500);
    expect(state?.total).toBe(500);

    unsubscribe();
  });

  it('should clear cart', () => {
    let state;
    const unsubscribe = cartStore.subscribe(s => {
      state = s;
    });

    cartStore.addItem(testProduct, 2);
    expect(state?.items).toHaveLength(1);

    cartStore.clearCart();

    expect(state?.items).toHaveLength(0);
    expect(state?.total).toBe(0);
    expect(localStorage.getItem('cart')).toBeNull();

    unsubscribe();
  });

  it('should persist cart to localStorage', () => {
    let state;
    const unsubscribe = cartStore.subscribe(s => {
      state = s;
    });

    cartStore.addItem(testProduct, 2);

    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].productId).toBe('1');
    expect(stored[0].quantity).toBe(2);

    unsubscribe();
  });
});
