import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import BeautyRecommender from "@/components/BeautyRecommender";
import { brandCollections } from "@/data/brandCollections";
import { productTypes } from "@/data/productTypes";
import { useLanguage } from "@/i18n";
import { useCatalog } from "@/context/CatalogContext";

export default function Shop() {
  const { language, t } = useLanguage();
  const { products, error, isLoading, reload } = useCatalog();
  const [searchParams, setSearchParams] = useSearchParams();
  const collection = brandCollections.find(line => line.key === searchParams.get("collection"));
  const query = searchParams.get("q")?.trim().toLocaleLowerCase() ?? "";
  const matches = query ? products.filter(p => [p.name, p.nameRu, p.nameEn, p.brand, p.productType].some(field => field?.toLocaleLowerCase().includes(query))) : products;
  const assortment = collection ? matches.filter(product => product.brand === "VEMONTES" && collection.matches.test(product.nameEn ?? product.name)) : matches;
  const requestedCategory = searchParams.get("category");
  const selectedType = productTypes.find(item => item.key === requestedCategory);
  const department = ["skincare", "makeup", "sets"].find(item => item === requestedCategory);
  const selectedCategory = selectedType?.key ?? department ?? "all";
  const [sort, setSort] = useState("default");
  const visibleProducts = assortment.filter(product =>
    selectedType ? product.productType === selectedType.ru : !department || product.category === department
  );
  if (sort === "price-asc") visibleProducts.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") visibleProducts.sort((a, b) => b.price - a.price);
  const ui = {
    ru: ["Главная", "Сортировка", "По порядку", "Сначала дешевле", "Сначала дороже", "Товаров"],
    en: ["Home", "Sort", "Featured", "Price: low to high", "Price: high to low", "Products"],
    tm: ["Baş sahypa", "Tertiplemek", "Katalog tertibi", "Arzandan gymmada", "Gymmatdan arzana", "Önümler"],
  }[language];
  const filters = [
    { value: "all", label: t("all"), count: assortment.length },
    ...productTypes.map(type => ({
      value: type.key, label: type[language], count: assortment.filter(product => product.productType === type.ru).length,
    })),
  ];
  const selectionLabel = selectedType?.[language] ?? (department ? t(department as "skincare" | "makeup" | "sets") : t("fullSelection"));
  const selectCategory = (value: string) => setSearchParams({ ...(query ? { q: query } : {}), ...(collection ? { collection: collection.key } : {}), ...(value === "all" ? {} : { category: value }) });
  return (
    <>
      <section className="catalog-shell">
        <nav className="store-crumb"><Link to="/">{ui[0]}</Link><span>/</span>{t("shop")}</nav>
        <h1>{query ? "«" + query + "»" : collection?.name ?? t("shopHeading")}</h1>
        <div className="catalog-types" aria-label={t("catalog")}>
          {filters.map(filter => (
            <button key={filter.value} type="button" onClick={() => selectCategory(filter.value)} aria-pressed={selectedCategory === filter.value}>
              {filter.label} <small>{filter.count}</small>
            </button>
          ))}
        </div>
        <div className="catalog-tools">
          <p>{selectionLabel} · {ui[5]} <b>{visibleProducts.length}</b></p>
          <select aria-label={ui[1]} value={sort} onChange={event => setSort(event.target.value)}>
            <option value="default">{ui[2]}</option><option value="price-asc">{ui[3]}</option><option value="price-desc">{ui[4]}</option>
          </select>
        </div>
          {error && <p role="alert" className="mb-6">
            {language === "ru" ? "Не удалось загрузить каталог. " : language === "en" ? "The catalog could not be loaded. " : "Katalog ýüklenmedi. "}
            <button type="button" className="underline" onClick={() => void reload()}>
              {language === "ru" ? "Повторить" : language === "en" ? "Try again" : "Gaýtadan synanyş"}
            </button>
          </p>}
          <div aria-busy={isLoading} className="catalog-grid">
            {visibleProducts.map((product, index) => <ProductCard key={product.slug} product={product} index={index} />)}
          </div>
      </section>
      <div className="catalog-advisor"><BeautyRecommender /></div>
    </>
  );
}
