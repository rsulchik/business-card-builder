import { Link } from "react-router-dom";
import { getProductAvailability, getProductName, type Product } from "@/data/products";
import { useLanguage } from "@/i18n";

export default function ProductCard({ product }: { product: Product; index?: number }) {
  const { language, t } = useLanguage();

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden bg-warm-bg">
        <img
          src={product.image}
          alt={getProductName(product, language)}
          className="h-full w-full bg-white object-contain transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          loading="lazy"
        />
        {product.isFamilyPhoto && (
          <span className="absolute bottom-3 left-3 bg-white/95 px-2 py-1 text-xs text-foreground">
            {language === "ru" ? "Фото линейки" : language === "en" ? "Product line photo" : "Önüm tapgyrynyň suraty"}
          </span>
        )}
        <div className="absolute left-4 top-4 flex items-center gap-2">
          {product.badge === "sale" && <span className="bg-accent px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-accent-foreground">{t("sale")}</span>}
          {product.badge === "sold-out" && <span className="bg-primary px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-primary-foreground">{t("soldOut")}</span>}
        </div>
      </div>
      <div className="pt-3">
        {product.brand && <p className="mb-1 text-xs font-medium text-muted-foreground">{product.brand}</p>}
        <h3 className="text-base font-medium leading-snug group-hover:underline">{getProductName(product, language)}</h3>
        <div className="mt-3 flex items-center gap-3 text-xs">
          <span className="font-medium text-foreground">${product.price.toFixed(2)}</span>
          {product.originalPrice && <span className="text-muted-foreground/60 line-through">${product.originalPrice.toFixed(2)}</span>}
          {product.availability && <span className="ml-auto text-[10px] text-accent">{getProductAvailability(product, language)}</span>}
        </div>
      </div>
    </Link>
  );
}
