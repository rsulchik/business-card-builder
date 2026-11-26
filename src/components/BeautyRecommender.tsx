import { FormEvent, useState } from "react";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { type Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n";
import { useCatalog } from "@/context/CatalogContext";

const skinTypeOptions = ["dry", "oily", "combination", "normal", "sensitive"] as const;

const concernOptions = ["hydration", "glow", "gentle-care", "even-tone", "lip-color", "cheek-color", "daily-routine", "gift"] as const;

interface RecommendationItem {
  slug: string;
  reason: string;
}

interface RecommendationResponse {
  summary: string;
  recommendations: RecommendationItem[];
}

interface ResolvedRecommendation extends RecommendationItem {
  product: Product;
}

const fieldClass = "w-full border border-border bg-background px-4 py-3.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-60";

export default function BeautyRecommender() {
  const { addItem } = useCart();
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const { products } = useCatalog();
  const [skinType, setSkinType] = useState("dry");
  const [concern, setConcern] = useState("hydration");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<RecommendationResponse | null>(null);

  const recommendations: ResolvedRecommendation[] = result?.recommendations.flatMap(item => {
    const product = products.find(candidate => candidate.slug === item.slug && candidate.badge !== "sold-out");
    return product ? [{ ...item, product }] : [];
  }) ?? [];

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setResult(null);

    const { data, error: requestError } = await supabase.functions.invoke<RecommendationResponse>("recommend-products", {
      body: { skinType, concern, note },
    });

    if (requestError || !data) {
      setError(t("recommendationError"));
      setIsLoading(false);
      return;
    }

    setResult(data);
    setIsLoading(false);
  };

  const handleAdd = (product: Product) => {
    addItem({ slug: product.slug, name: product.name, price: product.price, image: product.image });
    const name = language === "tm" ? product.name : product.name;
    toast({ title: language === "ru" ? "Добавлено в корзину" : language === "en" ? "Added to cart" : "Sebede goşuldy", description: `${name} — ${t("addToCart")}.` });
  };

  return (
    <section id="beauty-recommender" aria-labelledby="beauty-recommender-title" className="mb-24 scroll-mt-[132px] scroll-smooth border border-border bg-secondary">
      <div className="grid grid-cols-1 gap-10 p-6 md:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:p-14">
        <div>
          <div className="mb-6 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-accent">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span>{t("recommenderEyebrow")}</span>
          </div>
          <h2 id="beauty-recommender-title" className="whitespace-pre-line font-display text-5xl leading-[0.95] tracking-[-0.03em] text-foreground md:text-6xl">{t("recommenderHeading")}</h2>
          <p className="mb-5 mt-6 max-w-md text-sm leading-7 text-muted-foreground">{t("recommenderText")}</p>
          <p className="max-w-md text-[11px] leading-relaxed text-muted-foreground">{t("medicalDisclaimer")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 lg:pt-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="recommender-skin-type" className="mb-2 block text-[10px] font-medium uppercase tracking-[0.12em] text-foreground">{t("skinType")}</label>
              <select id="recommender-skin-type" value={skinType} onChange={event => setSkinType(event.target.value)} disabled={isLoading} className={fieldClass}>
                {skinTypeOptions.map(option => <option key={option} value={option}>{t(option)}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="recommender-concern" className="mb-2 block text-[10px] font-medium uppercase tracking-[0.12em] text-foreground">{t("mainGoal")}</label>
              <select id="recommender-concern" value={concern} onChange={event => setConcern(event.target.value)} disabled={isLoading} className={fieldClass}>
                {concernOptions.map(option => <option key={option} value={option}>{t(option === "gentle-care" ? "gentleCare" : option === "even-tone" ? "evenTone" : option === "lip-color" ? "lipColor" : option === "cheek-color" ? "cheekColor" : option === "daily-routine" ? "dailyRoutine" : option)}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="recommender-note" className="mb-2 block text-[10px] font-medium uppercase tracking-[0.12em] text-foreground">{t("extraPreferences")} <span className="text-muted-foreground">({t("optional")})</span></label>
            <textarea id="recommender-note" value={note} onChange={event => setNote(event.target.value)} disabled={isLoading} maxLength={500} rows={3} placeholder={t("preferencePlaceholder")} className={`${fieldClass} resize-vertical placeholder:text-muted-foreground`} />
            <p className="mt-1 text-right text-[10px] text-muted-foreground">{note.length}/500</p>
          </div>
          <button type="submit" disabled={isLoading} className="inline-flex w-full items-center justify-center gap-4 bg-primary px-7 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ArrowRight className="h-4 w-4" />}
            {isLoading ? t("loadingRecommendation") : result || error ? t("retryRecommendation") : t("getRecommendation")}
          </button>
          <div aria-live="polite">{error && <p role="alert" className="text-sm text-accent">{error}</p>}</div>
        </form>
      </div>

      {result && recommendations.length > 0 && (
        <div className="border-t border-border bg-background p-6 md:p-10 lg:p-14" aria-live="polite">
          <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-accent">{t("yourSelection")}</p>
          <h3 className="font-display text-4xl text-foreground md:text-5xl">{t("recommendationsTitle")}</h3>
          <p className="mb-10 mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">{result.summary}</p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {recommendations.map(({ product, reason }, index) => (
              <article key={product.slug} className="flex flex-col border border-border bg-background">
                <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
                <div className="flex flex-1 flex-col p-6">
                  <p className="mb-4 text-[10px] tracking-[0.18em] text-accent">{String(index + 1).padStart(2, "0")}</p>
                  <h4 className="font-display text-2xl leading-tight text-foreground">{product.name}</h4>
                  <p className="mb-5 mt-3 text-xs font-medium text-foreground">${product.price.toFixed(2)}</p>
                  <p className="mb-7 flex-1 text-sm leading-6 text-muted-foreground">{reason}</p>
                  <button type="button" onClick={() => handleAdd(product)} className="w-full border border-primary py-3.5 text-[10px] font-medium uppercase tracking-[0.15em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground">{t("addToCart")}</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
