import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import newsletterImage from "@/assets/newsletter-beauty.jpg";
import { useLanguage } from "@/i18n";

export default function NewsletterSignup() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log("Newsletter signup:", email);
    toast({ title: t("subscribedTitle"), description: t("subscribedText") });
    setEmail("");
    setIsSubmitting(false);
  };

  return (
    <section className="grid bg-primary text-primary-foreground lg:grid-cols-2" aria-labelledby="newsletter-title">
      <div className="min-h-[340px] lg:min-h-[520px]">
        <img src={newsletterImage} alt="Lumière Cosmetics-iň ýumşak gözellik ritually" className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="flex items-center px-6 py-16 md:px-14 lg:px-20">
        <div className="max-w-lg">
          <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.24em] text-primary-foreground/60">{t("newsletterEyebrow")}</p>
          <h2 id="newsletter-title" className="whitespace-pre-line font-display text-5xl leading-[0.95] md:text-6xl">{t("newsletterHeading")}</h2>
          <p className="mb-9 mt-6 max-w-md text-sm leading-relaxed text-primary-foreground/70">{t("newsletterText")}</p>
          <form onSubmit={handleSubmit} className="flex border-b border-primary-foreground/45">
            <input
              type="email"
              required
              autoComplete="email"
              placeholder={t("emailPlaceholder")}
              aria-label={t("emailPlaceholder")}
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="min-w-0 flex-1 bg-transparent py-4 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:ring-0"
            />
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-2 text-[10px] font-medium uppercase tracking-[0.18em] transition-opacity hover:opacity-60 disabled:opacity-40">
              {isSubmitting ? "..." : t("subscribe")}<ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-4 text-[10px] leading-relaxed text-primary-foreground/45">{t("unsubscribe")}</p>
        </div>
      </div>
    </section>
  );
}
