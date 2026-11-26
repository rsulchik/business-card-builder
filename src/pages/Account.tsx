import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, LogOut } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n";

const skinTypes = [
  { value: "dry", label: "dry" as const },
  { value: "oily", label: "oily" as const },
  { value: "combination", label: "combination" as const },
  { value: "normal", label: "normal" as const },
  { value: "sensitive", label: "sensitive" as const },
];

const favoriteCategoryOptions = [
  { value: "skincare", label: "skincare" as const },
  { value: "makeup", label: "makeup" as const },
  { value: "sets", label: "sets" as const },
];

export default function Account() {
  const { user, isLoading, signOut } = useAuth();
  const { t, language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [skinType, setSkinType] = useState("");
  const [favoriteCategories, setFavoriteCategories] = useState<string[]>([]);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsProfileLoading(false);
      return;
    }
    let active = true;
    setIsProfileLoading(true);
    void supabase.from("profiles").select("full_name, email_notifications, skin_type, favorite_categories").eq("id", user.id).single().then(({ data, error: profileError }) => {
      if (!active) return;
      if (profileError) setError("Profil maglumatlaryny ýükläp bolmady. Sahypany täzeläň.");
      if (data) {
        setFullName(data.full_name);
        setEmailNotifications(data.email_notifications);
        setSkinType(data.skin_type ?? "");
        setFavoriteCategories(data.favorite_categories);
      }
      setIsProfileLoading(false);
    });
    return () => { active = false; };
  }, [user]);

  if (isLoading) return <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">{t("accountLoading")}</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = fullName.trim();
    if (!trimmedName) return setError("Adyňyzy ýazyň.");
    if (trimmedName.length > 80) return setError("At 80 harpdan köp bolmaly däl.");
    setError("");
    setSaved(false);
    setIsSaving(true);
    const { error: updateError } = await supabase.from("profiles").update({ full_name: trimmedName, email_notifications: emailNotifications, skin_type: skinType || null, favorite_categories: favoriteCategories }).eq("id", user.id);
    if (updateError) setError("Sazlamalary saklap bolmady. Gaýtadan synanyşyň.");
    else {
      setFullName(trimmedName);
      setSaved(true);
    }
    setIsSaving(false);
  };

  const handleSignOut = async () => {
    setError("");
    try {
      await signOut();
      navigate("/", { replace: true });
    } catch {
      setError("Hasapdan çykmak başartmady. Gaýtadan synanyşyň.");
    }
  };

  return (
    <section className="px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1200px]">
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-accent">{t("accountCommunity")}</p>
        <div className="mt-5 flex flex-col justify-between gap-7 border-b border-border pb-10 md:flex-row md:items-end">
          <div><h1 className="font-display text-3xl leading-tight tracking-[-0.04em] md:text-5xl">{t("accountTitle")}</h1><p className="mt-6 text-sm text-muted-foreground">{user.email}</p></div>
          <button type="button" onClick={() => void handleSignOut()} className="inline-flex w-fit items-center gap-3 border-b border-foreground pb-1 text-[10px] font-medium uppercase tracking-[0.15em]"><LogOut className="h-4 w-4" /> {t("logout")}</button>
        </div>

        <div className="mt-14 grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <form onSubmit={handleSave} className="bg-secondary p-7 md:p-10">
            <h2 className="font-display text-4xl">{t("profileSettings")}</h2>
            {isProfileLoading ? <p className="mt-10 text-sm text-muted-foreground">{t("settingsLoading")}</p> : (
              <div className="mt-9 space-y-8">
                <div><label htmlFor="profileName" className="mb-2 block text-[10px] uppercase tracking-[0.15em]">{t("name")}</label><input id="profileName" autoComplete="name" maxLength={80} value={fullName} onChange={event => setFullName(event.target.value)} className="h-12 w-full border-0 border-b border-border bg-transparent px-0 py-3 text-sm outline-none focus:border-accent focus:ring-0" /></div>
                <div><p className="mb-2 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{t("email")}</p><p className="border-b border-border py-3 text-sm">{user.email}</p></div>
                <div>
                  <label htmlFor="skinType" className="mb-2 block text-[10px] uppercase tracking-[0.15em]">{t("skinTypeLabel")}</label>
                  <select id="skinType" value={skinType} onChange={event => setSkinType(event.target.value)} className="h-12 w-full border-0 border-b border-border bg-transparent px-0 py-3 text-sm text-foreground outline-none focus:border-accent focus:ring-0">
                    <option value="">{t("notSelected")}</option>
                    {skinTypes.map(option => <option key={option.value} value={option.value}>{t(option.label)}</option>)}
                  </select>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{t("skinTypeHelp")}</p>
                </div>
                <fieldset className="border-t border-border pt-7">
                  <legend className="text-sm font-medium">{t("favoriteCategories")}</legend>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{t("favoriteCategoriesHelp")}</p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    {favoriteCategoryOptions.map(option => (
                      <label key={option.value} htmlFor={`category-${option.value}`} className="flex cursor-pointer items-center gap-3 text-sm">
                        <Checkbox
                          id={`category-${option.value}`}
                          checked={favoriteCategories.includes(option.value)}
                          onCheckedChange={checked => setFavoriteCategories(current => checked === true ? [...current.filter(value => value !== option.value), option.value] : current.filter(value => value !== option.value))}
                        />
                        {t(option.label)}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="flex items-start justify-between gap-6 border-t border-border pt-7">
                  <div><label htmlFor="emailNotifications" className="text-sm font-medium">{t("updatesAndOffers")}</label><p className="mt-2 max-w-sm text-xs leading-5 text-muted-foreground">{t("updatesAndOffersHelp")}</p></div>
                  <Switch id="emailNotifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} aria-label="Täzelikler we teklip e-poçtalary" />
                </div>
                {error && <p role="alert" className="border-l-2 border-destructive pl-4 text-sm leading-6 text-destructive">{error}</p>}
                {saved && <p role="status" className="border-l-2 border-accent pl-4 text-sm leading-6 text-muted-foreground">Sazlamalaryňyz saklandy.</p>}
                <button type="submit" disabled={isSaving} className="inline-flex h-12 items-center gap-3 bg-primary px-7 text-[10px] uppercase tracking-[0.16em] text-primary-foreground disabled:opacity-50">{isSaving ? t("saving") : t("saveChanges")}<ArrowRight className="h-4 w-4" /></button>
              </div>
            )}
          </form>

          <aside>
            <Link to="/orders" className="mb-8 block border-b border-border pb-6 text-2xl">{language === "ru" ? "Мои заказы" : language === "en" ? "My orders" : "Sargytlarym"}</Link>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{t("madeForYou")}</p>
            <h2 className="mt-4 font-display text-3xl leading-[1.02]">{t("refreshRoutine")}</h2>
            <p className="mt-6 text-sm leading-7 text-muted-foreground">{t("accountAdvice")}</p>
            <Link to="/shop#beauty-recommender" className="mt-8 inline-flex items-center gap-3 border-b border-foreground pb-1 text-[10px] uppercase tracking-[0.15em]">{t("getAdvice")} <ArrowRight className="h-4 w-4" /></Link>
            <div className="mt-12 border-t border-border pt-7"><Link to="/cart" className="flex items-center justify-between gap-4 font-display text-3xl">{t("myCart")} <ArrowRight className="h-5 w-5" /></Link></div>
          </aside>
        </div>
      </div>
    </section>
  );
}
