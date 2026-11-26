import ProductCard from "@/components/ProductCard";
import coreCollectionImg from "@/assets/collections/core-beauty.jpg";
import { useLanguage } from "@/i18n";
import { useCatalog } from "@/context/CatalogContext";

const process = ["selection", "formula", "finishProcess"] as const;

export default function CoreCollection() {
  const { language, t } = useLanguage();
  const { products } = useCatalog();
  const coreProducts = products.filter(product => ["radiance-renewal-serum", "velvet-cloud-moisturizer", "rose-quartz-facial-oil", "petal-soft-cream-blush"].includes(product.slug));
  const processText = {
    selection: t("selectionText"),
    formula: t("formulaText"),
    finishProcess: t("finishText"),
  };
  return (
    <>
      <section className="relative -mt-[108px] h-[72svh] min-h-[600px] bg-primary">
        <img src={coreCollectionImg} alt="Lumière deri ideginiň Esasy kolleksiýasy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-foreground/35" />
        <div className="relative mx-auto flex h-full max-w-[1400px] items-end px-6 pb-16 pt-40 text-primary-foreground md:px-10 md:pb-20">
          <div>
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.24em] text-primary-foreground/75">{t("skincareCollection")}</p>
            <h1 className="whitespace-pre-line font-display text-7xl leading-[0.85] tracking-[-0.04em] md:text-9xl">{t("core")}</h1>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-2 lg:items-start">
          <h2 className="whitespace-pre-line font-display text-5xl leading-[0.95] md:text-7xl">{t("coreHeading")}</h2>
          <div className="space-y-6 text-sm leading-7 text-muted-foreground lg:pt-3">
            <p>{t("coreText1")}</p>
            <p>{t("coreText2")}</p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 md:px-10 md:pb-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10 flex items-center justify-between border-t border-border pt-5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground"><span>{t("collectionProducts")}</span><span>04 {language === "ru" ? "продукта" : language === "en" ? "products" : "önüm"}</span></div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">{coreProducts.map((product, index) => <ProductCard key={product.slug} product={product} index={index} />)}</div>
        </div>
      </section>

      <section className="bg-secondary px-6 py-20 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="mb-12 font-display text-5xl md:text-6xl">{t("processTitle")}</h2>
          <div className="grid gap-10 md:grid-cols-3">{process.map((step, index) => <article key={step} className="border-t border-foreground/25 pt-5"><p className="mb-8 text-[10px] tracking-[0.2em] text-accent">0{index + 1}</p><h3 className="font-display text-3xl">{t(step)}</h3><p className="mt-4 text-sm leading-7 text-muted-foreground">{processText[step]}</p></article>)}</div>
        </div>
      </section>
    </>
  );
}
