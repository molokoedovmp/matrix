import { useState, useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  memory?: string;
  color?: string;
}

interface CartStore {
  items: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (product) => {
        const { items } = get();
        const existingItem = items.find(item => item.id === product.id);
        
        if (existingItem) {
          set({
            items: items.map(item => 
              item.id === product.id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            )
          });
        } else {
          set({
            items: [...items, { 
              id: product.id,
              name: product.name,
              price: product.price,
              image_url: product.image_url,
              quantity: 1,
              memory: product.memory,
              color: product.color
            }]
          });
        }
      },
      
      removeFromCart: (productId) => {
        const { items } = get();
        set({ items: items.filter(item => item.id !== productId) });
      },
      
      updateQuantity: (productId, quantity) => {
        const { items } = get();
        set({
          items: items.map(item => 
            item.id === productId 
              ? { ...item, quantity } 
              : item
          )
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'cart-storage'
    }
  )
);

export const useCart = () => {
  const cartStore = useCartStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return {
    ...cartStore,
    isReady: mounted
  };
}; 