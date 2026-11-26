import { ArrowUpRight, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n";

const shopLinks = [
  { to: "/shop", label: "allProducts" as const },
  { to: "/shop?category=skincare", label: "skincare" as const },
  { to: "/shop?category=makeup", label: "makeup" as const },
  { to: "/shop?category=sets", label: "sets" as const },
];

const aboutLinks = [
  { to: "/about", label: "about" as const },
  { to: "/collections/core", label: "coreCollection" as const },
  { to: "/collections/sets-and-pairs", label: "sets" as const },
  { to: "/contact", label: "contact" as const },
];

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary px-6 pb-8 pt-16 text-primary-foreground md:px-10 md:pt-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-14 border-b border-primary-foreground/20 pb-16 md:grid-cols-2 lg:grid-cols-[1.6fr_0.8fr_0.8fr_1fr]">
          <div>
            <Link to="/" className="inline-flex flex-col leading-none">
              <span className="font-display text-5xl font-medium tracking-[-0.03em]">Lumière</span>
              <span className="mt-2 text-[9px] uppercase tracking-[0.48em] opacity-70">Cosmetics</span>
            </Link>
            <p className="mt-7 max-w-sm font-display text-3xl leading-tight text-primary-foreground/90">
              {t("footerTagline")}
            </p>
          </div>
          <div>
            <h2 className="mb-5 text-[10px] font-medium uppercase tracking-[0.22em] text-primary-foreground/60">{t("shop")}</h2>
            <div className="flex flex-col gap-3">
              {shopLinks.map(link => (
                <Link key={link.to} to={link.to} className="w-fit text-sm text-primary-foreground/80 transition-opacity hover:opacity-60">{t(link.label)}</Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-5 text-[10px] font-medium uppercase tracking-[0.22em] text-primary-foreground/60">Lumière</h2>
            <div className="flex flex-col gap-3">
              {aboutLinks.map(link => (
                <Link key={link.to} to={link.to} className="w-fit text-sm text-primary-foreground/80 transition-opacity hover:opacity-60">{t(link.label)}</Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-5 text-[10px] font-medium uppercase tracking-[0.22em] text-primary-foreground/60">{t("footerHelp")}</h2>
            <p className="mb-5 text-sm leading-relaxed text-primary-foreground/70">{t("footerHelpText")}</p>
            <Link to="/shop#beauty-recommender" className="inline-flex items-center gap-2 border-b border-primary-foreground/50 pb-1 text-xs uppercase tracking-[0.15em] transition-opacity hover:opacity-60">
              {t("getAdvice")} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-5 pt-7 text-[10px] uppercase tracking-[0.15em] text-primary-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Lumière Cosmetics. {t("rights")}</p>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-2 transition-opacity hover:opacity-60" aria-label="Instagram">
            <Instagram className="h-4 w-4" /> Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
