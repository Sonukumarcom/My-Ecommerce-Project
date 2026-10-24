import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: number;
  productId: number;
  sku: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  imageUrl: string;
  quantity: number;
  maxStock: number;
}

interface ToastData {
  name: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Add-to-cart toast
  toast: ToastData | null;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  addItem: (
    item: Omit<CartItem, 'quantity'>,
    quantity?: number
  ) => void;

  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;

  getSubtotal: () => number;
  getItemCount: () => number;

  clearToast: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      toast: null,

      openCart: () =>
        set({
          isOpen: true,
        }),

      closeCart: () =>
        set({
          isOpen: false,
        }),

      toggleCart: () =>
        set((state) => ({
          isOpen: !state.isOpen,
        })),

      addItem: (item, quantity = 1) => {
        const { items } = get();

        const existingIndex = items.findIndex(
          (i) => i.productId === item.productId
        );

        if (existingIndex > -1) {
          const updated = [...items];

          const currentQuantity =
            updated[existingIndex].quantity;

          const newQty = Math.min(
            currentQuantity + quantity,
            item.maxStock
          );

          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
          };

          set({
            items: updated,
            isOpen: true,
            toast: {
              name: item.name,
            },
          });
        } else {
          set({
            items: [
              ...items,
              {
                ...item,
                quantity: Math.min(quantity, item.maxStock),
              },
            ],
            isOpen: true,
            toast: {
              name: item.name,
            },
          });
        }

        // Automatically remove toast after 2.5 seconds
        window.setTimeout(() => {
          set({
            toast: null,
          });
        }, 2500);
      },

      removeItem: (productId) =>
        set({
          items: get().items.filter(
            (item) => item.productId !== productId
          ),
        }),

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  quantity: Math.min(
                    quantity,
                    item.maxStock
                  ),
                }
              : item
          ),
        });
      },

      clearCart: () =>
        set({
          items: [],
        }),

      getSubtotal: () =>
        get().items.reduce((total, item) => {
          const activePrice =
            item.salePrice && item.salePrice > 0
              ? item.salePrice
              : item.price;

          return (
            total + activePrice * item.quantity
          );
        }, 0),

      getItemCount: () =>
        get().items.reduce(
          (count, item) => count + item.quantity,
          0
        ),

      clearToast: () =>
        set({
          toast: null,
        }),
    }),

    {
      name: 'aurastore-cart-storage',

      storage: createJSONStorage(() => localStorage),

      // Only cart items should persist.
      // Toast should disappear when the page is refreshed.
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);