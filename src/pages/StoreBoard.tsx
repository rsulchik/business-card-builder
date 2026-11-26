import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n";
import { useCatalog } from "@/context/CatalogContext";
import ProductCard from "@/components/ProductCard";

const copy = {
  ru: { promotion: ["Акции", "Сейчас нет активных акций."], reviews: ["Отзывы", "Пока нет опубликованных отзывов."], events: ["События", "Новые события пока не объявлены."] },
  en: { promotion: ["Promotion", "There are no current promotions."], reviews: ["Review", "No reviews have been published yet."], events: ["Event", "No upcoming events have been announced."] },
  tm: { promotion: ["Arzanladyşlar", "Häzir arzanladyş ýok."], reviews: ["Synlar", "Entek syn çap edilmedi."], events: ["Çäreler", "Täze çäre yglan edilmedi."] },
};
export default function StoreBoard({ page }: { page: keyof typeof copy.ru }) {
  const { language, t } = useLanguage();
  const { products, isLoading, error } = useCatalog();
  const [title, empty] = copy[language][page];
  const deals = page === "promotion" ? products.filter(p => p.badge === "sale" || (p.originalPrice ?? 0) > p.price) : [];
  return <section className="catalog-shell min-h-[58vh] py-12 text-center">
    <h1>{title}</h1>
    {deals.length ? <div className="catalog-grid text-left">{deals.map(p => <ProductCard key={p.slug} product={p}/>)}</div> :
      <p className="border-y py-10">{page === "promotion" && (isLoading || error) ? (error || "…") : empty}</p>}
    <Link className="mt-8 inline-block underline" to="/shop">{t("allProducts")}</Link>
  </section>;
}
