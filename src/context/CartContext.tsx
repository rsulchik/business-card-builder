import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface CartItem {
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removePurchased: (purchased: { slug: string; quantity: number }[]) => void;
  totalItems: number;
  subtotal: number;
}

const CART_STORAGE_KEY = "terra-studios-cart";

const retiredDemoSlugs = new Set([
  "radiance-renewal-serum",
  "velvet-cloud-moisturizer",
  "rose-quartz-facial-oil",
  "botanical-clay-mask",
  "silk-veil-lip-tint",
  "mineral-glow-highlighter",
  "petal-soft-cream-blush",
  "botanical-lash-brow-serum",
  "daily-dew-skin-set",
]);

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Partial<CartItem>;
  return (
    typeof item.slug === "string" &&
    typeof item.name === "string" &&
    typeof item.price === "number" &&
    typeof item.image === "string" &&
    typeof item.quantity === "number" &&
    Number.isFinite(item.price) && item.price >= 0 &&
    Number.isInteger(item.quantity) && item.quantity <= 99 &&
    item.quantity > 0
  );
}

function readStoredCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCartItem).filter(item => !retiredDemoSlugs.has(item.slug));
  } catch {
    return [];
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readStoredCart);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage full or unavailable — the cart still works for this visit.
    }
  }, [items]);

  const addItem = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99 || !Number.isFinite(item.price) || item.price < 0) return;
    setItems(prev => {
      const existing = prev.find(i => i.slug === item.slug);
      if (existing) {
        return prev.map(i => i.slug === item.slug ? { ...i, quantity: Math.min(99, i.quantity + quantity) } : i);
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeItem = (slug: string) => setItems(prev => prev.filter(i => i.slug !== slug));

  const updateQuantity = (slug: string, quantity: number) => {
    if (!Number.isInteger(quantity) || quantity > 99) return;
    if (quantity <= 0) return removeItem(slug);
    setItems(prev => prev.map(i => i.slug === slug ? { ...i, quantity } : i));
  };

  const removePurchased = (purchased: { slug: string; quantity: number }[]) => setItems(current => current.map(item => ({ ...item, quantity: item.quantity - (purchased.find(p => p.slug === item.slug)?.quantity ?? 0) })).filter(item => item.quantity > 0));

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, removePurchased, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
