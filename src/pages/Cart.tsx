import { ArrowRight, ShoppingBag, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { getCategoryLabel, getProductName } from "@/data/products";
import { useLanguage } from "@/i18n";
import { useCatalog } from "@/context/CatalogContext";
import QuantitySelector from "@/components/QuantitySelector";

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const { language, t } = useLanguage();
  const { products } = useCatalog();
  const getItemName = (item: { slug: string; name: string }) => {
    const product = products.find(candidate => candidate.slug === item.slug);
    return product ? getProductName(product, language) : item.name;
  };

  if (items.length === 0) {
    return (
      <section className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1400px]">
          <p className="mb-5 text-[10px] uppercase tracking-[0.22em] text-accent">{t("selectionLabel")}</p>
          <h1 className="font-display text-3xl leading-none md:text-5xl">{t("basket")}</h1>
          <div className="mt-16 flex flex-col items-center border-y border-border px-6 py-20 text-center">
            <ShoppingBag className="mb-6 h-8 w-8 text-muted-foreground" strokeWidth={1.2} />
            <h2 className="font-display text-4xl">{t("emptyCart")}</h2>
            <p className="mb-8 mt-4 max-w-md text-sm leading-7 text-muted-foreground">{t("emptyCartText")}</p>
            <Link to="/shop" className="inline-flex items-center gap-4 bg-primary px-7 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-85">{t("continueShopping")} <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <p className="mb-5 text-[10px] uppercase tracking-[0.22em] text-accent">{t("selectionLabel")}</p>
        <h1 className="font-display text-3xl leading-none md:text-5xl">{t("basket")}</h1>
        <div className="mt-14 grid items-start gap-14 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="border-t border-border">
            {items.map(item => {
              const product = products.find(candidate => candidate.slug === item.slug);
              return (
                <article key={item.slug} className="grid grid-cols-[96px_1fr] gap-5 border-b border-border py-7 sm:grid-cols-[144px_1fr] sm:gap-7">
                  <Link to={`/product/${item.slug}`} className="aspect-[4/5] bg-warm-bg"><img src={item.image} alt={getItemName(item)} className="h-full w-full object-cover" /></Link>
                  <div className="flex flex-col justify-between gap-6 py-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link to={`/product/${item.slug}`} className="font-display text-2xl leading-tight transition-opacity hover:opacity-60 sm:text-3xl">{getItemName(item)}</Link>
                        {product && <p className="mt-2 text-[9px] uppercase tracking-[0.16em] text-muted-foreground">{getCategoryLabel(product.category, language)}</p>}
                      </div>
                      <button type="button" onClick={() => removeItem(item.slug)} className="p-1 text-muted-foreground transition-opacity hover:opacity-55" aria-label={t("removeProduct", { product: getItemName(item) })}><X className="h-4 w-4" /></button>
                    </div>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                      <QuantitySelector quantity={item.quantity} onChange={q => updateQuantity(item.slug, q)} />
                      <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <aside className="bg-secondary p-7 md:p-9 lg:sticky lg:top-[140px]">
            <h2 className="font-display text-4xl">{t("total")}</h2>
            <div className="mt-8 space-y-4 border-y border-border py-6 text-sm">
              <div className="flex justify-between gap-4"><span className="text-muted-foreground">{t("subtotal")}</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between gap-4"><span className="text-muted-foreground">{t("shipping")}</span><span className="text-xs">{t("calculatedAtCheckout")}</span></div>
            </div>
            <div className="my-6 flex items-baseline justify-between gap-4"><span className="text-sm">{t("subtotal")}</span><span className="font-display text-3xl">${subtotal.toFixed(2)}</span></div>
            <button type="button" disabled className="w-full cursor-not-allowed bg-muted px-6 py-4 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">{t("checkoutSoon")}</button>
            <Link to="/shop" className="mt-6 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-opacity hover:opacity-60">{t("continueShopping")} <ArrowRight className="h-3.5 w-3.5" /></Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
