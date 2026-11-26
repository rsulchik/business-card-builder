import { useEffect, useState, type ChangeEvent } from "react";
import { ArrowRight, Save, ShieldCheck } from "lucide-react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCatalog } from "@/context/CatalogContext";
import { getProductDescription, getProductName, type Product, type ProductCategory } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n";

const categories: ProductCategory[] = ["skincare", "makeup", "sets"];

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const { products, isLoading: catalogLoading, error: catalogError, saveProduct } = useCatalog();
  const { language } = useLanguage();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleLoading, setRoleLoading] = useState(true);
  const [drafts, setDrafts] = useState<Product[]>([]);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setRoleLoading(false);
      return;
    }
    let active = true;
    void supabase.from("profiles").select("role").eq("id", user.id).single().then(({ data }) => {
      if (!active) return;
      setIsAdmin(data?.role === "admin");
      setRoleLoading(false);
    });
    return () => { active = false; };
  }, [user]);

  useEffect(() => {
    if (!catalogLoading) {
      setDrafts(products.map(product => ({
        ...product,
        nameRu: product.nameRu ?? getProductName(product, "ru"),
        nameEn: product.nameEn ?? getProductName(product, "en"),
        descriptionRu: product.descriptionRu ?? getProductDescription(product, "ru"),
        descriptionEn: product.descriptionEn ?? getProductDescription(product, "en"),
      })));
    }
  }, [catalogLoading, products]);

  if (authLoading || roleLoading) return <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">Проверяем доступ...</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!isAdmin) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-6 py-20 text-center">
        <div><ShieldCheck className="mx-auto mb-5 h-10 w-10 text-accent" /><h1 className="font-display text-3xl">Доступ закрыт.</h1><p className="mt-4 text-sm text-muted-foreground">Эта страница доступна только администраторам.</p><Link to="/" className="mt-8 inline-flex items-center gap-3 border-b border-foreground pb-1 text-xs uppercase tracking-[0.15em]">На главную <ArrowRight className="h-4 w-4" /></Link></div>
      </section>
    );
  }

  const updateDraft = (slug: string, field: keyof Product, value: string | number | undefined) => {
    setDrafts(current => current.map(product => product.slug === slug ? { ...product, [field]: value } : product));
    setSavedSlug(null);
  };

  const updateText = (slug: string, field: keyof Product) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => updateDraft(slug, field, event.target.value);

  const handleSave = async (product: Product) => {
    setSavingSlug(product.slug);
    setError("");
    try {
      await saveProduct(product);
      setSavedSlug(product.slug);
    } catch {
      setError(`Не удалось сохранить «${product.name}». Проверьте применённую миграцию и права администратора.`);
    } finally {
      setSavingSlug(null);
    }
  };

  return (
    <section className="px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col justify-between gap-6 border-b border-border pb-10 md:flex-row md:items-end">
          <div><p className="text-[10px] uppercase tracking-[0.24em] text-accent">Lumière Admin</p><h1 className="mt-5 font-display text-3xl leading-tight md:text-5xl">Каталог.</h1><p className="mt-5 text-sm text-muted-foreground">Редактирование каталога для {user.email}</p></div>
          <Link to="/shop" className="inline-flex items-center gap-3 border-b border-foreground pb-1 text-[10px] uppercase tracking-[0.15em]">Открыть магазин <ArrowRight className="h-4 w-4" /></Link>
        </div>
        {catalogError && <p className="mt-8 border-l-2 border-accent pl-4 text-sm leading-6 text-muted-foreground">Каталог пока использует локальный fallback: {catalogError}</p>}
        {error && <p role="alert" className="mt-8 border-l-2 border-destructive pl-4 text-sm leading-6 text-destructive">{error}</p>}
        <div className="mt-12 space-y-8">
          {catalogLoading ? <p className="text-sm text-muted-foreground">Загружаем товары...</p> : drafts.map(product => (
            <article key={product.slug} className="border border-border bg-secondary p-6 md:p-10">
              <div className="mb-8 flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-start"><div><p className="text-[10px] uppercase tracking-[0.18em] text-accent">{product.slug}</p><h2 className="mt-3 font-display text-4xl">{language === "ru" ? product.nameRu : language === "en" ? product.nameEn : product.name}</h2></div><p className="text-sm text-muted-foreground">Изображение: {product.slug}.jpg</p></div>
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-5">
                  <label className="block text-xs uppercase tracking-[0.14em]">Название TM<input value={product.name} onChange={updateText(product.slug, "name")} className="mt-2 h-11 w-full border border-border bg-background px-3 text-sm" /></label>
                  <label className="block text-xs uppercase tracking-[0.14em]">Название RU<input value={product.nameRu ?? ""} onChange={updateText(product.slug, "nameRu")} className="mt-2 h-11 w-full border border-border bg-background px-3 text-sm" /></label>
                  <label className="block text-xs uppercase tracking-[0.14em]">Name EN<input value={product.nameEn ?? ""} onChange={updateText(product.slug, "nameEn")} className="mt-2 h-11 w-full border border-border bg-background px-3 text-sm" /></label>
                </div>
                <div className="space-y-5">
                  <label className="block text-xs uppercase tracking-[0.14em]">Описание TM<textarea value={product.description} onChange={updateText(product.slug, "description")} rows={5} className="mt-2 w-full border border-border bg-background px-3 py-2 text-sm" /></label>
                  <label className="block text-xs uppercase tracking-[0.14em]">Описание RU<textarea value={product.descriptionRu ?? ""} onChange={updateText(product.slug, "descriptionRu")} rows={5} className="mt-2 w-full border border-border bg-background px-3 py-2 text-sm" /></label>
                  <label className="block text-xs uppercase tracking-[0.14em]">Description EN<textarea value={product.descriptionEn ?? ""} onChange={updateText(product.slug, "descriptionEn")} rows={5} className="mt-2 w-full border border-border bg-background px-3 py-2 text-sm" /></label>
                </div>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4"><label className="block text-xs uppercase tracking-[0.14em]">Цена<input type="number" min="0" step="0.01" value={product.price} onChange={event => updateDraft(product.slug, "price", Number(event.target.value))} className="mt-2 h-11 w-full border border-border bg-background px-3 text-sm" /></label><label className="block text-xs uppercase tracking-[0.14em]">Старая цена<input type="number" min="0" step="0.01" value={product.originalPrice ?? ""} onChange={event => updateDraft(product.slug, "originalPrice", event.target.value ? Number(event.target.value) : undefined)} className="mt-2 h-11 w-full border border-border bg-background px-3 text-sm" /></label></div>
                  <label className="block text-xs uppercase tracking-[0.14em]">Категория<select value={product.category} onChange={updateText(product.slug, "category")} className="mt-2 h-11 w-full border border-border bg-background px-3 text-sm">{categories.map(category => <option key={category} value={category}>{category}</option>)}</select></label>
                  <label className="block text-xs uppercase tracking-[0.14em]">Статус<select value={product.badge ?? ""} onChange={event => updateDraft(product.slug, "badge", event.target.value || undefined)} className="mt-2 h-11 w-full border border-border bg-background px-3 text-sm"><option value="">Обычный</option><option value="sale">Скидка</option><option value="sold-out">Нет в наличии</option></select></label>
                  <label className="block text-xs uppercase tracking-[0.14em]">Остаток RU<input value={product.availabilityRu ?? ""} onChange={updateText(product.slug, "availabilityRu")} className="mt-2 h-11 w-full border border-border bg-background px-3 text-sm" /></label>
                  <label className="block text-xs uppercase tracking-[0.14em]">Availability EN<input value={product.availabilityEn ?? ""} onChange={updateText(product.slug, "availabilityEn")} className="mt-2 h-11 w-full border border-border bg-background px-3 text-sm" /></label>
                  <label className="block text-xs uppercase tracking-[0.14em]">Galdy TM<input value={product.availability ?? ""} onChange={updateText(product.slug, "availability")} className="mt-2 h-11 w-full border border-border bg-background px-3 text-sm" /></label>
                </div>
              </div>
              <div className="mt-8 flex items-center gap-4"><button type="button" onClick={() => void handleSave(product)} disabled={savingSlug === product.slug} className="inline-flex items-center gap-3 bg-primary px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-primary-foreground disabled:opacity-50"><Save className="h-4 w-4" />{savingSlug === product.slug ? "Сохраняем..." : "Сохранить товар"}</button>{savedSlug === product.slug && <span role="status" className="text-sm text-muted-foreground">Сохранено</span>}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
