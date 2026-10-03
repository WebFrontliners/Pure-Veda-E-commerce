import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '../types';

interface CartState {
  items: CartItem[];
  wishlist: number[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isDealerModalOpen: boolean;
  isAccountModalOpen: boolean;
  activeQuickViewProduct: Product | null;
  
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  openCheckout: () => void;
  closeCheckout: () => void;

  openDealerModal: () => void;
  closeDealerModal: () => void;

  openAccountModal: () => void;
  closeAccountModal: () => void;
  
  setQuickViewProduct: (product: Product | null) => void;
  
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;

  toggleWishlist: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
  
  // Computed helpers
  getItemCount: () => number;
  getWishlistCount: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [1, 4], // Pre-populate couple items for realism
      isCartOpen: false,
      isCheckoutOpen: false,
      isDealerModalOpen: false,
      isAccountModalOpen: false,
      activeQuickViewProduct: null,

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      openCheckout: () => set({ isCheckoutOpen: true, isCartOpen: false }),
      closeCheckout: () => set({ isCheckoutOpen: false }),

      openDealerModal: () => set({ isDealerModalOpen: true }),
      closeDealerModal: () => set({ isDealerModalOpen: false }),

      openAccountModal: () => set({ isAccountModalOpen: true }),
      closeAccountModal: () => set({ isAccountModalOpen: false }),

      setQuickViewProduct: (product) => set({ activeQuickViewProduct: product }),

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            const currentItem = updated[existingIndex];
            const newQty = Math.min(
              currentItem.quantity + quantity,
              product.stock
            );
            updated[existingIndex] = {
              ...currentItem,
              quantity: newQty,
            };
            return { items: updated, isCartOpen: true };
          }

          const addQty = Math.min(quantity, product.stock);
          if (addQty <= 0) return state;

          return {
            items: [...state.items, { product, quantity: addQty }],
            isCartOpen: true,
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.product.id !== productId),
            };
          }
          return {
            items: state.items.map((item) => {
              if (item.product.id === productId) {
                const maxStock = item.product.stock;
                return {
                  ...item,
                  quantity: Math.min(quantity, maxStock),
                };
              }
              return item;
            }),
          };
        });
      },

      clearCart: () => set({ items: [] }),

      toggleWishlist: (productId) => {
        set((state) => {
          const exists = state.wishlist.includes(productId);
          return {
            wishlist: exists
              ? state.wishlist.filter((id) => id !== productId)
              : [...state.wishlist, productId],
          };
        });
      },

      isWishlisted: (productId) => {
        return get().wishlist.includes(productId);
      },

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getWishlistCount: () => {
        return get().wishlist.length;
      },

      getSubtotal: () => {
        return get().items.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0
        );
      },

      getTax: () => {
        const subtotal = get().getSubtotal();
        return Math.round(subtotal * 0.08 * 100) / 100;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const tax = get().getTax();
        const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5.99;
        return Math.round((subtotal + tax + shipping) * 100) / 100;
      },
    }),
    {
      name: 'pure_veda_ayurved_cart_v2',
      partialize: (state) => ({ items: state.items, wishlist: state.wishlist }),
    }
  )
);
