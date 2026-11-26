import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/i18n";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary px-6 py-20">
      <div className="text-center">
        <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.24em] text-accent">Lumière Cosmetics</p>
        <h1 className="font-display text-[140px] leading-none tracking-[-0.05em] md:text-[200px]">404</h1>
        <h2 className="font-display text-4xl md:text-5xl">{t("pageNotFound")}</h2>
        <p className="mx-auto mb-8 mt-4 max-w-md text-sm leading-7 text-muted-foreground">{t("pageNotFoundText")}</p>
        <Link to="/" className="inline-flex items-center gap-3 bg-primary px-7 py-4 text-[10px] font-medium uppercase tracking-[0.15em] text-primary-foreground transition-opacity hover:opacity-85"><ArrowLeft className="h-4 w-4" /> {t("backHome")}</Link>
      </div>
    </main>
  );
};

export default NotFound;
