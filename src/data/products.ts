import type { Language } from "@/i18n";
import { importedCatalog } from "@/data/catalogImport";

export type ProductCategory = "skincare" | "makeup" | "sets";

export interface Product {
  productType?: string;
  brand?: string;
  isFamilyPhoto?: boolean;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  category: ProductCategory;
  badge?: "sale" | "sold-out";
  availability?: string;
  nameRu?: string;
  nameEn?: string;
  descriptionRu?: string;
  descriptionEn?: string;
  availabilityRu?: string;
  availabilityEn?: string;
  sortOrder?: number;
}

export const categoryLabels: Record<ProductCategory, string> = {
  skincare: "Deri idegi",
  makeup: "Makýaž",
  sets: "Gözelik toplumlary",
};

export function getProductName(product: Product, language: Language) {
  if (language === "tm") return product.name;
  return language === "ru"
    ? product.nameRu ?? product.name
    : product.nameEn ?? product.name;
}

export function getProductDescription(product: Product, language: Language) {
  if (language === "tm") return product.description;
  return language === "ru"
    ? product.descriptionRu ?? product.description
    : product.descriptionEn ?? product.description;
}

export function getProductAvailability(product: Product, language: Language) {
  if (!product.availability) return undefined;
  if (language === "tm") return product.availability;
  return language === "ru"
    ? product.availabilityRu ?? product.availability
    : product.availabilityEn ?? product.availability;
}

export function getCategoryLabel(category: ProductCategory, language: Language) {
  if (language === "tm") return categoryLabels[category];
  return language === "ru"
    ? { skincare: "Уход за кожей", makeup: "Макияж", sets: "Наборы красоты" }[category]
    : { skincare: "Skincare", makeup: "Makeup", sets: "Beauty sets" }[category];
}

export const products: Product[] = importedCatalog;
