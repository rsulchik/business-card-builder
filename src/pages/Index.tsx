import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Feather, Leaf, Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-beauty.jpg";
import coreCollection from "@/assets/collections/core-beauty.jpg";
import setsAndPairs from "@/assets/collections/beauty-sets.jpg";
import NewsletterSignup from "@/components/NewsletterSignup";
import ProductCard from "@/components/ProductCard";
import { getProductName } from "@/data/products";
import { useLanguage } from "@/i18n";
import { useCatalog } from "@/context/CatalogContext";

const values = [
  { icon: Leaf, title: "naturalFormulas" as const, text: "naturalFormulasText" as const },
  { icon: Feather, title: "lightTextures" as const, text: "lightTexturesText" as const },
  { icon: Sparkles, title: "personalChoice" as const, text: "personalChoiceText" as const },
];

export default function Index() {
  const { language, t } = useLanguage();
  const { products } = useCatalog();
  const bestProducts = products.filter(product => product.badge !== "sold-out").slice(0, 6);
  const productPages = [bestProducts.slice(0, 3), bestProducts.slice(3, 6)];
  const ritualProducts = ["radiance-renewal-serum", "velvet-cloud-moisturizer", "silk-veil-lip-tint"]
    .map(slug => products.find(product => product.slug === slug)!);
  const dailySet = products.find(product => product.slug === "daily-dew-skin-set") ?? products[0];
  const [activePage, setActivePage] = useState(0);
  const changePage = (direction: number) => {
    setActivePage(current => (current + direction + productPages.length) % productPages.length);
  };

  return (
    <>
      <section className="relative -mt-[108px] h-[92svh] min-h-[680px] max-h-[960px] overflow-hidden bg-primary">
        <img src={heroBg} alt="Lumière Cosmetics ýüz kremini ulanýan zenan" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-hero" />
        <div className="relative mx-auto flex h-full max-w-[1440px] items-end justify-between gap-10 px-6 pb-16 pt-40 md:px-10 md:pb-20 lg:px-14">
          <div className="max-w-4xl animate-fade-up text-primary-foreground">
            <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.3em] text-primary-foreground/75">{t("newCollection")}</p>
            <h1 className="text-balance font-display text-[68px] leading-[0.82] tracking-[-0.045em] sm:text-[88px] md:text-[112px] lg:text-[132px]">
              {t("heroTitle").split("\n")[0]}<br /><em className="font-normal">{t("heroTitle").split("\n")[1]}</em>
            </h1>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-primary-foreground/80">{t("heroDescription")}</p>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <Link to="/shop" className="inline-flex items-center gap-5 bg-primary-foreground px-7 py-4 text-[10px] font-medium uppercase tracking-[0.18em] text-primary transition-opacity hover:opacity-85">
                {t("exploreCollection")} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/shop#beauty-recommender" className="border-b border-primary-foreground/50 pb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-65">
                {t("findProduct")}
              </Link>
            </div>
          </div>
          {dailySet && <Link to={`/product/${dailySet.slug}`} className="group hidden w-72 shrink-0 bg-background/95 p-4 text-foreground backdrop-blur-sm xl:block">
            <div className="flex items-center gap-4">
              <img src={dailySet.image} alt={getProductName(dailySet, language)} className="h-20 w-20 object-cover" />
              <div>
                <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{t("newSetLabel")}</p>
                <p className="font-display text-xl leading-tight">{getProductName(dailySet, language)}</p>
                <p className="mt-2 text-xs">${dailySet.price.toFixed(2)}</p>
              </div>
              <ArrowUpRight className="ml-auto h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </div>
          </Link>}
        </div>
      </section>

      <section className="border-b border-border px-6 md:px-10" aria-label={t("valuesLabel")}>
        <div className="mx-auto grid max-w-[1400px] md:grid-cols-3">
          {values.map(({ icon: Icon, title, text }, index) => (
            <div key={title} className={`flex gap-5 py-8 md:px-8 md:py-10 ${index > 0 ? "border-t border-border md:border-l md:border-t-0" : ""}`}>
              <Icon className="mt-1 h-5 w-5 shrink-0 text-accent" strokeWidth={1.4} />
              <div>
                <h2 className="mb-2 text-[11px] font-medium uppercase tracking-[0.15em]">{t(title)}</h2>
                <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">{t(text)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-24 md:px-10 md:py-32" aria-labelledby="best-products-title">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.24em] text-accent">{t("lumiereSelection")}</p>
              <h2 id="best-products-title" className="font-display text-5xl leading-none tracking-[-0.03em] md:text-7xl">{t("bestSelected")}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => changePage(-1)} className="flex h-12 w-12 items-center justify-center border border-border transition-colors hover:bg-primary hover:text-primary-foreground" aria-label={t("previousProducts")}>
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => changePage(1)} className="flex h-12 w-12 items-center justify-center border border-border transition-colors hover:bg-primary hover:text-primary-foreground" aria-label={t("nextProducts")}>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div key={activePage} className="grid animate-fade-up grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {productPages[activePage].map((product, index) => <ProductCard key={product.slug} product={product} index={activePage * 3 + index} />)}
          </div>
          <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
            <div className="flex gap-2" aria-label={t("bestSelected")}>
              {productPages.map((_, index) => (
                <button key={index} type="button" onClick={() => setActivePage(index)} className={`h-1.5 transition-all ${index === activePage ? "w-10 bg-accent" : "w-5 bg-border"}`} aria-label={t("productPage", { number: index + 1 })} aria-pressed={index === activePage} />
              ))}
            </div>
            <Link to="/shop" className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] transition-opacity hover:opacity-60">{t("viewAll")} <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section className="grid border-y border-border lg:grid-cols-2">
        <div className="relative min-h-[480px] overflow-hidden lg:min-h-[700px]">
          <img src={coreCollection} alt="Lumière deri ideginiň Esasy kolleksiýasy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 hover:scale-[1.02]" loading="lazy" />
          <span className="absolute left-6 top-6 bg-background px-3 py-2 text-[9px] uppercase tracking-[0.2em] md:left-10 md:top-10">01 — {t("skincare")}</span>
        </div>
        <div className="flex items-center bg-secondary px-6 py-16 md:px-14 lg:px-20">
          <div className="max-w-lg">
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.22em] text-accent">{t("coreCollection")}</p>
            <h2 className="whitespace-pre-line font-display text-5xl leading-[0.95] tracking-[-0.03em] md:text-7xl">{t("skincareHeading")}</h2>
            <p className="my-7 text-sm leading-7 text-muted-foreground">{t("skincareText")}</p>
            <Link to="/collections/core" className="inline-flex items-center gap-5 border border-foreground px-6 py-4 text-[10px] font-medium uppercase tracking-[0.18em] transition-colors hover:bg-primary hover:text-primary-foreground">{t("explore")} <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section className="grid border-b border-border lg:grid-cols-2">
        <div className="flex items-center px-6 py-16 md:px-14 lg:order-2 lg:px-20">
          <div className="max-w-lg">
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.22em] text-accent">{t("makeupSets")}</p>
            <h2 className="whitespace-pre-line font-display text-5xl leading-[0.95] tracking-[-0.03em] md:text-7xl">{t("pairsHeading")}</h2>
            <p className="my-7 text-sm leading-7 text-muted-foreground">{t("pairsText")}</p>
            <Link to="/collections/sets-and-pairs" className="inline-flex items-center gap-5 border border-foreground px-6 py-4 text-[10px] font-medium uppercase tracking-[0.18em] transition-colors hover:bg-primary hover:text-primary-foreground">{t("chooseSets")} <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
        <div className="relative min-h-[480px] overflow-hidden lg:order-1 lg:min-h-[700px]">
          <img src={setsAndPairs} alt="Lumière Cosmetics gözellik sowgat toplumy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 hover:scale-[1.02]" loading="lazy" />
          <span className="absolute left-6 top-6 bg-background px-3 py-2 text-[9px] uppercase tracking-[0.2em] md:left-10 md:top-10">{t("giftLabel")}</span>
        </div>
      </section>

      <section className="bg-secondary px-6 py-20 md:px-10 md:py-24">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex max-w-3xl gap-6">
            <Sparkles className="mt-2 hidden h-8 w-8 shrink-0 text-accent sm:block" strokeWidth={1.2} />
            <div>
              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.22em] text-accent">{t("aiEyebrow")}</p>
              <h2 className="whitespace-pre-line font-display text-4xl leading-tight md:text-6xl">{t("aiHeading")}</h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">{t("aiText")}</p>
            </div>
          </div>
          <Link to="/shop#beauty-recommender" className="inline-flex shrink-0 items-center gap-4 bg-primary px-6 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-85">{t("getAdvice")} <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="bg-primary px-6 py-24 text-primary-foreground md:px-10 md:py-32" aria-labelledby="ritual-title">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-14 grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="mb-4 text-[10px] uppercase tracking-[0.24em] text-primary-foreground/55">{t("ritualEyebrow")}</p>
              <h2 id="ritual-title" className="whitespace-pre-line font-display text-5xl leading-none md:text-7xl">{t("ritualHeading")}</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-primary-foreground/65 lg:ml-auto">{t("ritualText")}</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {ritualProducts.map((product, index) => (
              <Link key={product.slug} to={`/product/${product.slug}`} className="group">
                <div className="aspect-[5/4] overflow-hidden bg-primary-foreground/10">
                  <img src={product.image} alt={getProductName(product, language)} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy" />
                </div>
                <div className="mt-5 flex items-start gap-5 border-t border-primary-foreground/25 pt-5">
                  <span className="text-[10px] tracking-[0.2em] text-primary-foreground/50">0{index + 1}</span>
                  <div>
                    <h3 className="font-display text-2xl leading-tight">{getProductName(product, language)}</h3>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-primary-foreground/55">{[t("prep"), t("hydrate"), t("finish")][index]}</p>
                  </div>
                  <ArrowUpRight className="ml-auto h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <NewsletterSignup />
    </>
  );
}
