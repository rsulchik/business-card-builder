import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import BeautyRecommender from "@/components/BeautyRecommender";
import { categoryLabels, type ProductCategory } from "@/data/products";
import { useLanguage } from "@/i18n";
import { useCatalog } from "@/context/CatalogContext";

const filters: { value: "all" | ProductCategory; label: string }[] = [
  { value: "all", label: "all" },
  { value: "skincare", label: "skincare" },
  { value: "makeup", label: "makeup" },
  { value: "sets", label: "sets" },
];

export default function Shop() {
  const { language, t } = useLanguage();
  const { products, error, isLoading, reload } = useCatalog();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedCategory = searchParams.get("category");
  const selectedCategory = filters.some(filter => filter.value === requestedCategory) ? requestedCategory as "all" | ProductCategory : "all";
  const visibleProducts = selectedCategory === "all" ? products : products.filter(product => product.category === selectedCategory);

  const selectCategory = (category: "all" | ProductCategory) => {
    setSearchParams(category === "all" ? {} : { category });
  };

  return (
    <>
      <section className="border-b border-border px-6 pb-14 pt-16 md:px-10 md:pb-20 md:pt-24">
        <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
          <div>
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.24em] text-accent">{t("catalog")}</p>
            <h1 className="font-display text-7xl leading-[0.85] tracking-[-0.04em] md:text-9xl">{t("shopHeading")}</h1>
          </div>
          <p className="max-w-md text-sm leading-7 text-muted-foreground lg:ml-auto">{t("shopDescription")}</p>
        </div>
      </section>

      <div className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <BeautyRecommender />

          <div className="mb-10 flex flex-col gap-6 border-b border-border pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2" aria-label="Önüm kategoriýalary">
              {filters.map(filter => {
                const count = filter.value === "all" ? products.length : products.filter(product => product.category === filter.value).length;
                const active = selectedCategory === filter.value;
                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => selectCategory(filter.value)}
                    aria-pressed={active}
                    className={`border px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.13em] transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-transparent text-muted-foreground hover:border-foreground hover:text-foreground"}`}
                  >
                    {t(filter.label as "all" | "skincare" | "makeup" | "sets")} <span className="ml-1 opacity-55">{String(count).padStart(2, "0")}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{selectedCategory === "all" ? t("fullSelection") : language === "tm" ? categoryLabels[selectedCategory] : t(selectedCategory)} — {visibleProducts.length} {language === "ru" ? "продуктов" : language === "en" ? "products" : "önüm"}</p>
          </div>

          {error && <p role="alert" className="mb-6">
            {language === "ru" ? "Не удалось загрузить каталог. " : language === "en" ? "The catalog could not be loaded. " : "Katalog ýüklenmedi. "}
            <button type="button" className="underline" onClick={() => void reload()}>
              {language === "ru" ? "Повторить" : language === "en" ? "Try again" : "Gaýtadan synanyş"}
            </button>
          </p>}
          <div aria-busy={isLoading} className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product, index) => <ProductCard key={product.slug} product={product} index={index} />)}
          </div>
        </div>
      </div>
    </>
  );
}
