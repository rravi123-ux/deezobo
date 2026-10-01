import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { BasketItem } from '../types/catalog';
import { parseBasket, validQuantity } from '../lib/catalog';

const STORAGE_KEY = 'deezobo:inquiry-basket:v1';
type Cart = {
  items: BasketItem[];
  count: number;
  add: (item: BasketItem) => void;
  update: (productId: string, optionId: string, quantity: number) => void;
  remove: (productId: string, optionId: string) => void;
};
const CartContext = createContext<Cart | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>(() => {
    try {
      return parseBasket(localStorage.getItem(STORAGE_KEY));
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* In-memory cart still works. */
    }
  }, [items]);
  const remove = (productId: string, optionId: string) =>
    setItems((prev) =>
      prev.filter(
        (i) => !(i.productId === productId && i.optionId === optionId),
      ),
    );
  const update = (productId: string, optionId: string, quantity: number) => {
    if (!validQuantity(quantity)) return;
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.optionId === optionId
          ? { ...i, quantity }
          : i,
      ),
    );
  };
  const add = (item: BasketItem) => {
    if (!validQuantity(item.quantity)) return;
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === item.productId && i.optionId === item.optionId,
      );
      return existing
        ? prev.map((i) =>
            i === existing
              ? { ...i, quantity: Math.min(999, i.quantity + item.quantity) }
              : i,
          )
        : [...prev, item];
    });
  };
  return (
    <CartContext.Provider
      value={{
        items,
        count: items.reduce((n, i) => n + i.quantity, 0),
        add,
        update,
        remove,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('CartProvider is required.');
  return context;
}
