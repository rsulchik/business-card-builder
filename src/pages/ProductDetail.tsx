import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { getCategoryLabel, getProductDescription, getProductName, getProductAvailability } from "@/data/products";
import { useLanguage } from "@/i18n";
import { useCatalog } from "@/context/CatalogContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import QuantitySelector from "@/components/QuantitySelector";
import ProductCard from "@/components/ProductCard";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { products, isLoading } = useCatalog();
  const product = products.find(candidate => candidate.slug === slug);
  const { addItem } = useCart();
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const [quantity, setQuantity] = useState(1);

  if (isLoading && !product) return <main aria-busy="true" className="min-h-screen" />;
  if (!product) return <Navigate to="/shop" replace />;

  const related = products.filter(candidate => candidate.slug !== product.slug && candidate.badge !== "sold-out").slice(0, 3);
  const localizedName = getProductName(product, language);
  const isSoldOut = product.badge === "sold-out";

  const handleAddToCart = () => {
    if (isSoldOut) return;

    addItem({ slug: product.slug, name: localizedName, price: product.price, image: product.image }, quantity);
    toast({ title: language === "ru" ? "Добавлено в корзину" : language === "en" ? "Added to cart" : "Sebede goşuldy", description: language === "ru" ? `${quantity} шт. «${localizedName}» добавлено в корзину.` : language === "en" ? `${quantity} × ${localizedName} added to your cart.` : `${quantity} sany ${localizedName} sebediňize goşuldy.` });
    setQuantity(1);
  };

  return (
    <>
      <section className="px-6 pb-24 pt-8 md:px-10 md:pb-32">
        <div className="mx-auto max-w-[1400px]">
          <nav className="mb-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.13em] text-muted-foreground" aria-label="Önüm ýoly">
            <Link to="/shop" className="inline-flex items-center gap-2 transition-opacity hover:opacity-60"><ArrowLeft className="h-3.5 w-3.5" /> {t("shop")}</Link>
            <span>/</span><span>{getCategoryLabel(product.category, language)}</span>
          </nav>
          <div className="grid items-start gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:gap-20">
            <div className="relative aspect-[4/5] bg-warm-bg lg:aspect-auto lg:min-h-[720px]">
              <img src={product.image} alt={localizedName} className="absolute inset-0 h-full w-full bg-white object-contain" />
              {product.badge === "sale" && <span className="absolute left-5 top-5 bg-accent px-4 py-2 text-[9px] uppercase tracking-[0.15em] text-accent-foreground">{t("sale")}</span>}
            </div>
            <div className="lg:sticky lg:top-[140px] lg:py-8">
              <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.22em] text-accent">{[getCategoryLabel(product.category, language), product.brand].filter(Boolean).join(" · ")}</p>
              <h1 className="text-balance font-display text-5xl leading-[0.95] tracking-[-0.03em] text-foreground md:text-7xl">{getProductName(product, language)}</h1>
              <div className="mt-7 flex items-center gap-4">
                <p className="text-lg font-medium text-foreground">${product.price.toFixed(2)}</p>
                {product.originalPrice && <p className="text-sm text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</p>}
              </div>
              {product.availability && <p className="mt-3 text-xs text-accent">{getProductAvailability(product, language)}</p>}
              <p className="my-8 border-t border-border pt-8 text-sm leading-7 text-muted-foreground">{getProductDescription(product, language)}</p>

              {!isSoldOut ? (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <QuantitySelector quantity={quantity} onChange={setQuantity} />
                  <button type="button" onClick={handleAddToCart} className="flex h-12 flex-1 items-center justify-center gap-4 bg-primary px-7 text-[10px] font-medium uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-85">
                    {t("addToCart")} <Plus className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button type="button" disabled className="h-12 w-full cursor-not-allowed bg-muted text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{t("soldOut")}</button>
              )}

            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-border bg-secondary px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-12 flex items-end justify-between gap-6">
              <div><p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-accent">{language === "ru" ? "Продолжите свой ритуал" : language === "en" ? "Continue your ritual" : "Rituallyňyzy dowam etdiriň"}</p><h2 className="font-display text-4xl md:text-6xl">{language === "ru" ? "Вам также может понравиться" : language === "en" ? "You may also like" : "Şeýle hem halap bilersiňiz"}</h2></div>
              <Link to="/shop" className="hidden items-center gap-3 text-[10px] uppercase tracking-[0.15em] sm:inline-flex">{t("shop")} <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.map((item, index) => <ProductCard key={item.slug} product={item} index={index} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
