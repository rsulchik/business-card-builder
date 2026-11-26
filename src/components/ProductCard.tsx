import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getCategoryLabel, getProductAvailability, getProductName, type Product } from "@/data/products";
import { useLanguage } from "@/i18n";

export default function ProductCard({ product, index }: { product: Product; index?: number }) {
  const { language, t } = useLanguage();

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-warm-bg">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          loading="lazy"
        />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          {product.badge === "sale" && <span className="bg-accent px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-accent-foreground">{t("sale")}</span>}
          {product.badge === "sold-out" && <span className="bg-primary px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-primary-foreground">{t("soldOut")}</span>}
        </div>
        <span className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center bg-background text-foreground opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <div className="pt-5">
        <div className="mb-2 flex items-center justify-between text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <span>{getCategoryLabel(product.category, language)}</span>
          {typeof index === "number" && <span>{String(index + 1).padStart(2, "0")}</span>}
        </div>
        <h3 className="font-display text-[25px] leading-[1.08] text-foreground transition-opacity group-hover:opacity-65">{getProductName(product, language)}</h3>
        <div className="mt-3 flex items-center gap-3 text-xs">
          <span className="font-medium text-foreground">${product.price.toFixed(2)}</span>
          {product.originalPrice && <span className="text-muted-foreground/60 line-through">${product.originalPrice.toFixed(2)}</span>}
          {product.availability && <span className="ml-auto text-[10px] text-accent">{getProductAvailability(product, language)}</span>}
        </div>
      </div>
    </Link>
  );
}
