import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { useLanguage, type Language } from "@/i18n";

const navLinks = [
  { to: "/shop?category=skincare", label: "skincare" as const },
  { to: "/shop?category=makeup", label: "makeup" as const },
  { to: "/collections/core", label: "collections" as const },
  { to: "/about", label: "about" as const },
  { to: "/contact", label: "contact" as const },
];

const shopLinks = [
  { to: "/shop", label: "allProducts" as const },
  { to: "/shop?category=skincare", label: "skincare" as const },
  { to: "/shop?category=makeup", label: "makeup" as const },
  { to: "/shop?category=sets", label: "sets" as const },
  { to: "/collections/core", label: "coreCollection" as const },
];

const languageOptions: Language[] = ["ru", "en", "tm"];

export default function Header() {
  const { user } = useAuth();
  const { totalItems } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";
  const transparent = isHome && !scrolled && !mobileOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="flex h-8 items-center justify-center bg-primary px-6 text-primary-foreground">
        <Link to="/collections/sets-and-pairs" className="text-[10px] font-medium uppercase tracking-[0.2em] transition-opacity hover:opacity-75">
          {t("setsCollection")}
        </Link>
      </div>

      <div
        className={cn(
          "border-b transition-colors duration-300",
          transparent
            ? "border-primary-foreground/20 bg-transparent text-primary-foreground"
            : "border-border bg-background/95 text-foreground backdrop-blur-md"
        )}
      >
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 md:px-8 lg:px-12">
          <Link to="/" className="group flex flex-col leading-none" aria-label="Lumière Cosmetics">
            <span className="font-display text-[32px] font-medium tracking-[-0.03em]">Lumière</span>
            <span className="mt-1 text-[8px] font-medium uppercase tracking-[0.42em] opacity-75">Cosmetics</span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label={t("shop")}>
            <div className="group relative">
              <Link
                to="/shop"
                className={cn(
                  "flex h-[76px] items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.13em] transition-opacity hover:opacity-60",
                  pathname === "/shop" && "opacity-60"
                )}
              >
                {t("shop")} <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <div className="invisible absolute left-1/2 top-full w-64 -translate-x-1/2 border border-border bg-popover p-3 text-popover-foreground opacity-0 shadow-soft transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                {shopLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block px-4 py-3 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {t(link.label)}
                  </Link>
                ))}
              </div>
            </div>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex h-[76px] items-center text-[11px] font-medium uppercase tracking-[0.13em] transition-opacity hover:opacity-60",
                  pathname === link.to && "opacity-60"
                )}
              >
                {t(link.label)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-0.5 rounded-full border border-current/20 p-0.5 sm:flex" role="group" aria-label={t("language")}>
              {languageOptions.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setLanguage(option)}
                  className={cn("rounded-full px-2 py-1 text-[9px] font-medium uppercase tracking-[0.08em] transition-colors", language === option ? "bg-current/15" : "opacity-55 hover:opacity-100")}
                  aria-pressed={language === option}
                >
                  {option.toUpperCase()}
                </button>
              ))}
            </div>
            <Link to={user ? "/account" : "/login"} className="flex items-center gap-2 px-2 py-2 transition-opacity hover:opacity-60" aria-label={user ? t("account") : t("login")}>
              <UserRound className="h-[19px] w-[19px]" strokeWidth={1.5} />
              <span className="hidden text-[11px] font-medium uppercase tracking-[0.13em] sm:inline">{user ? t("account") : t("login")}</span>
            </Link>
            <Link to="/cart" className="relative flex items-center gap-2 px-2 py-2 transition-opacity hover:opacity-60" aria-label={`${t("cart")}, ${totalItems}`}>
              <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.5} />
              <span className="hidden text-[11px] font-medium uppercase tracking-[0.13em] sm:inline">{t("cart")}</span>
              {totalItems > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-accent-foreground">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(open => !open)}
              className="p-2 lg:hidden"
              aria-label={mobileOpen ? t("menuClose") : t("menuOpen")}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="max-h-[calc(100svh-108px)] overflow-y-auto border-t border-border bg-background px-6 pb-10 pt-5 text-foreground lg:hidden" aria-label={t("shop")}>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{t("shop")}</p>
              <div className="flex items-center gap-0.5 rounded-full border border-border p-0.5" role="group" aria-label={t("language")}>
                {languageOptions.map(option => (
                  <button key={option} type="button" onClick={() => setLanguage(option)} className={cn("rounded-full px-2 py-1 text-[9px] font-medium uppercase tracking-[0.08em]", language === option ? "bg-primary text-primary-foreground" : "text-muted-foreground")} aria-pressed={language === option}>{option.toUpperCase()}</button>
                ))}
              </div>
            </div>
            <div className="mb-6 border-b border-border">
              {shopLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between border-t border-border/60 py-3 font-display text-2xl"
                >
                  {t(link.label)}<span aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
            {navLinks.slice(2).map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="block py-3 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground"
              >
                {t(link.label)}
              </Link>
            ))}
            <Link
              to={user ? "/account" : "/login"}
              onClick={() => setMobileOpen(false)}
              className="mt-5 flex items-center gap-3 border-t border-border pt-5 text-xs font-medium uppercase tracking-[0.15em] text-foreground"
            >
              <UserRound className="h-4 w-4" /> {user ? t("account") : `${t("login")} / ${t("registerLink")}`}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
