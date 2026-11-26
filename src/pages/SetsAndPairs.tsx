import ProductCard from "@/components/ProductCard";
import setsImg from "@/assets/collections/beauty-sets.jpg";
import { useLanguage } from "@/i18n";
import { useCatalog } from "@/context/CatalogContext";

export default function SetsAndPairs() {
  const { t } = useLanguage();
  const { products } = useCatalog();
  const setsProducts = products.filter(product => product.category === "sets");

  return (
    <>
      <section className="relative -mt-[108px] h-[72svh] min-h-[600px] bg-primary">
        <img src={setsImg} alt="Lumière Cosmetics gözellik sowgat toplumlary" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-foreground/35" />
        <div className="relative mx-auto flex h-full max-w-[1400px] items-end px-6 pb-16 pt-40 text-primary-foreground md:px-10 md:pb-20">
          <div>
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.24em] text-primary-foreground/75">{t("setsCollection")}</p>
            <h1 className="whitespace-pre-line font-display text-7xl leading-[0.85] tracking-[-0.04em] md:text-9xl">{t("beautySets")}</h1>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-2 lg:items-start">
          <h2 className="whitespace-pre-line font-display text-5xl leading-[0.95] md:text-7xl">{t("togetherHeading")}</h2>
          <div className="space-y-6 text-sm leading-7 text-muted-foreground lg:pt-3">
            <p>{t("setsText1")}</p>
            <p>{t("setsText2")}</p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 md:px-10 md:pb-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10 flex items-center justify-between border-t border-border pt-5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground"><span>{t("selectedSets")}</span><span>{setsProducts.length}</span></div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">{setsProducts.map((product, index) => <ProductCard key={product.slug} product={product} index={index} />)}</div>
        </div>
      </section>

      <section className="bg-primary px-6 py-20 text-primary-foreground md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1100px] gap-8 md:grid-cols-[0.7fr_1.3fr]">
          <p className="text-[10px] uppercase tracking-[0.22em] text-primary-foreground/55">{t("giftPrinciple")}</p>
          <div>
            <h2 className="whitespace-pre-line font-display text-5xl leading-none md:text-7xl">{t("perfectGift")}</h2>
            <p className="mt-7 max-w-2xl text-sm leading-7 text-primary-foreground/65">{t("perfectGiftText")}</p>
          </div>
        </div>
      </section>
    </>
  );
}
