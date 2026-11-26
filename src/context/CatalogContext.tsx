import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products as fallbackProducts, type Product } from "@/data/products";
import { isRemoteCatalogImage } from "@/data/catalogImages";
import { supabase } from "@/integrations/supabase/client";

type CatalogRow = {
  brand?: string | null;
  image_kind?: string | null;
  slug: string;
  name_tm: string;
  name_ru: string;
  name_en: string;
  description_tm: string;
  description_ru: string;
  description_en: string;
  category: Product["category"];
  price: number;
  original_price: number | null;
  badge: Product["badge"] | null;
  availability_tm: string | null;
  availability_ru: string | null;
  availability_en: string | null;
  sort_order: number;
  image_key: string;
};

interface CatalogContextValue {
  products: Product[];
  isLoading: boolean;
  error: string;
  reload: () => Promise<void>;
  saveProduct: (product: Product) => Promise<void>;
}

const CatalogContext = createContext<CatalogContextValue | undefined>(undefined);

function mapRow(row: CatalogRow): Product {
  const fallback = fallbackProducts.find(product => product.slug === row.slug);
  return {
    ...(fallback ?? { slug: row.slug, image: "", category: row.category }),
    slug: row.slug,
    brand: row.brand ?? undefined,
    isFamilyPhoto: row.image_kind === "product_family",
    name: row.name_tm,
    nameRu: row.name_ru,
    nameEn: row.name_en,
    description: row.description_tm,
    descriptionRu: row.description_ru,
    descriptionEn: row.description_en,
    category: row.category,
    image: isRemoteCatalogImage(row.image_key) ? row.image_key : (fallback?.image ?? ""),
    price: Number(row.price),
    originalPrice: row.original_price === null ? undefined : Number(row.original_price),
    badge: row.badge ?? undefined,
    availability: row.availability_tm ?? undefined,
    availabilityRu: row.availability_ru ?? undefined,
    availabilityEn: row.availability_en ?? undefined,
    sortOrder: row.sort_order,
  };
}

function toRow(product: Product): CatalogRow {
  const fallback = fallbackProducts.find(candidate => candidate.slug === product.slug);
  return {
    slug: product.slug,
    name_tm: product.name,
    name_ru: product.nameRu ?? fallback?.name ?? product.name,
    name_en: product.nameEn ?? fallback?.name ?? product.name,
    description_tm: product.description,
    description_ru: product.descriptionRu ?? fallback?.description ?? product.description,
    description_en: product.descriptionEn ?? fallback?.description ?? product.description,
    category: product.category,
    price: Number(product.price),
    original_price: product.originalPrice ?? null,
    badge: product.badge ?? null,
    availability_tm: product.availability ?? null,
    availability_ru: product.availabilityRu ?? null,
    availability_en: product.availabilityEn ?? null,
    sort_order: product.sortOrder ?? fallbackProducts.findIndex(candidate => candidate.slug === product.slug),
    image_key: isRemoteCatalogImage(product.image) ? product.image : product.slug,
  };
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = async () => {
    setIsLoading(true);
    const { data, error: requestError } = await supabase.from("catalog_products").select("*").order("sort_order");
    if (requestError) {
      setError(requestError.message);
    } else {
      setError("");
      setProducts(((data ?? []) as CatalogRow[]).map(mapRow));
    }
    setIsLoading(false);
  };

  useEffect(() => { void reload(); }, []);

  const saveProduct = async (product: Product) => {
    const row = toRow(product);
    const { error: updateError } = await supabase.from("catalog_products").update(row).eq("slug", product.slug);
    if (updateError) throw updateError;
    setProducts(current => current.map(candidate => candidate.slug === product.slug ? product : candidate));
  };

  const value = useMemo(() => ({ products, isLoading, error, reload, saveProduct }), [products, isLoading, error]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error("useCatalog must be used within CatalogProvider");
  return context;
}
