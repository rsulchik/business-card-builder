import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage, type Language } from "@/i18n";
import { productTypes } from "@/data/productTypes";
import { brandCollections } from "@/data/brandCollections";
import "./Header.css";

const words = {
  ru: ["Продукты", "По типу", "По назначению", "Акции", "Отзывы", "Вопросы", "События", "Поиск"],
  en: ["Product", "by type", "by function", "Promotion", "Review", "Q&A", "Event", "Search"],
  tm: ["Önümler", "Görnüşi boýunça", "Maksady boýunça", "Arzanladyşlar", "Synlar", "Soraglar", "Çäreler", "Gözleg"],
};
export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobile, setMobile] = useState(false);
  const [panel, setPanel] = useState("");
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const root = useRef<HTMLElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const labels = words[language];
  const groups = [
    [{ to: "/shop", label: t("allProducts") }, ...brandCollections.map(x => ({ to: "/shop?collection=" + x.key, label: x.name }))],
    productTypes.map(x => ({ to: "/shop?category=" + x.key, label: x[language] })),
  ];
  const close = () => { setPanel(""); setMobile(false); };
  useEffect(() => { close(); }, [location.key]);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 24);
    const outside = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) close(); };
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    scroll(); window.addEventListener("scroll", scroll, { passive: true });
    document.addEventListener("pointerdown", outside); document.addEventListener("keydown", escape);
    return () => { window.removeEventListener("scroll", scroll); document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, []);
  useEffect(() => { if (panel === "search") search.current?.focus(); }, [panel]);
  const toggle = (key: string) => setPanel(current => current === key ? "" : key);
  return <header ref={root} className={"vm-header" + (location.pathname === "/" && !scrolled && !mobile && !panel ? " over-film" : "")}>
    <div className="vm-bar">
      <Link className="vm-logo" to="/" onClick={close}>Lumière<small>COSMETICS</small></Link>
      <nav aria-label={t("shop")} className={mobile ? "open" : ""}>
        {groups.map((links, i) => <div className="vm-group" key={i}>
          <button aria-expanded={panel === String(i)} onClick={() => toggle(String(i))}>{labels[i]}</button>
          {panel === String(i) && <div className="vm-sub">{links.map(x => <Link key={x.to} to={x.to} onClick={close}>{x.label}</Link>)}</div>}
        </div>)}
        {["/shop#beauty-recommender", "/promotion", "/reviews", "/contact", "/events"].map((to, i) => <Link key={to} to={to} onClick={close}>{labels[i+2]}</Link>)}
      </nav>
      <div className="vm-actions">
        <select aria-label={t("language")} value={language} onChange={e => setLanguage(e.target.value as Language)}>{["ru","en","tm"].map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}</select>
        <button aria-label={labels[7]} aria-expanded={panel === "search"} onClick={() => { setMobile(false); toggle("search"); }}><Search/></button>
        <Link to={user ? "/account" : "/login"} aria-label={t("account")}><UserRound/></Link>
        <Link to="/cart" aria-label={t("basket")}><ShoppingBag/>{totalItems > 0 && <small>{totalItems}</small>}</Link>
        <button className="vm-menu" aria-label={mobile ? t("menuClose") : t("menuOpen")} aria-expanded={mobile} onClick={() => { setMobile(!mobile); setPanel(""); }}>{mobile ? <X/> : <Menu/>}</button>
      </div>
    </div>
    {panel === "search" && <form className="vm-search" onSubmit={e => { e.preventDefault(); navigate("/shop?q=" + encodeURIComponent(query.trim())); close(); }}>
      <input ref={search} type="search" aria-label={labels[7]} placeholder={labels[7]} value={query} onChange={e=>setQuery(e.target.value)}/><button>{labels[7]}</button>
    </form>}
  </header>;
}
