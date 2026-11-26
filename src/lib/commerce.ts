import type { Language } from "@/i18n";
import type { Product } from "@/data/products";

export const money = (value: number) => `${value.toFixed(2)} TMT`;
export const textFor = (language: Language, ru: string, en: string, tm: string) => language === "ru" ? ru : language === "en" ? en : tm;
export const priceLabel = (product: Product, language: Language) => product.priceNeedsReview
  ? textFor(language, "Цена уточняется", "Price on request", "Bahasy anyklanýar") : money(product.price);
export type Customer = { name: string; phone: string; email: string; country: string; city: string; address: string; note: string; consent: boolean };
export function validCustomer(c: Customer) {
  return c.name.trim().length >= 2 && c.name.trim().length <= 100 && /^\+?[0-9 ()-]{7,24}$/.test(c.phone)
    && c.phone.replace(/\D/g, "").length >= 7 && c.phone.replace(/\D/g, "").length <= 15
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email) && c.email.length <= 254
    && c.country.trim().length >= 2 && c.country.length <= 80 && c.city.trim().length >= 2 && c.city.length <= 100
    && c.address.trim().length >= 5 && c.address.length <= 300 && c.note.length <= 1000 && c.consent;
}
export type OrderItem = { slug: string; name_ru: string; name_en: string; name_tm: string; image: string; quantity: number; unit_price: number };
export type OrderReceipt = { id: string; order_number: number; subtotal: number };
export function reconcileCart(items: {slug: string; quantity: number}[], products: Product[]) {
  return items.map(item => {
    const product = products.find(p => p.slug === item.slug);
    return { ...item, product, unavailable: !product || product.badge === "sold-out" || product.priceNeedsReview || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99 };
  });
}
