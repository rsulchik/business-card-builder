import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  const { t } = useLanguage();
  const isRecovery = new URLSearchParams(window.location.hash.replace(/^#/, "")).get("type") === "recovery";

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (password.length < 8) return setError("Açar söz azyndan 8 harpdan ybarat bolmaly.");
    if (password !== confirmPassword) return setError("Açar sözler gabat gelmeýär.");
    setError("");
    setIsSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError("Açar söz täzelenmedi. Täze dikeltme baglanyşygyny soraň.");
      setIsSubmitting(false);
      return;
    }
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setError("Açar söz täzelendi, ýöne sessiýany ýapmak başartmady. Sahypany täzeläň.");
    } else {
      setComplete(true);
    }
    setIsSubmitting(false);
  };

  const inputClass = "h-12 w-full border-0 border-b border-border bg-transparent px-0 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-0";

  return (
    <section className="flex min-h-[calc(100svh-108px)] items-center justify-center bg-secondary px-6 py-16">
      <div className="w-full max-w-lg bg-background p-7 shadow-soft md:p-12">
        {!isRecovery ? (
          <>
            <p className="text-[10px] uppercase tracking-[0.24em] text-accent">{t("forgotEyebrow")}</p>
            <h1 className="mt-5 font-display text-5xl leading-none">{t("invalidResetLink")}</h1>
            <p className="mt-6 text-sm leading-7 text-muted-foreground">{t("invalidResetText")}</p>
            <Link to="/forgot-password" className="mt-8 inline-flex items-center gap-3 bg-primary px-7 py-4 text-[10px] uppercase tracking-[0.16em] text-primary-foreground">{t("getNewLink")} <ArrowRight className="h-4 w-4" /></Link>
          </>
        ) : complete ? (
          <>
            <Check className="mb-7 h-8 w-8 text-accent" />
            <h1 className="font-display text-5xl leading-none">{t("passwordUpdated")}</h1>
            <p className="mt-6 text-sm leading-7 text-muted-foreground">{t("passwordUpdatedText")}</p>
            <Link to="/login" className="mt-8 inline-flex items-center gap-3 bg-primary px-7 py-4 text-[10px] uppercase tracking-[0.16em] text-primary-foreground">{t("backToLogin")} <ArrowRight className="h-4 w-4" /></Link>
          </>
        ) : (
          <>
            <p className="text-[10px] uppercase tracking-[0.24em] text-accent">{t("security")}</p>
            <h1 className="mt-5 font-display text-5xl leading-none md:text-6xl">{t("newPassword")}</h1>
            <p className="mt-6 text-sm leading-7 text-muted-foreground">{t("passwordHint")}</p>
            <form onSubmit={handleSubmit} className="mt-9 space-y-6">
              <div><label htmlFor="newPassword" className="mb-2 block text-[10px] uppercase tracking-[0.15em]">{t("newPassword")}</label><input id="newPassword" type="password" autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} className={inputClass} /></div>
              <div><label htmlFor="confirmNewPassword" className="mb-2 block text-[10px] uppercase tracking-[0.15em]">{t("repeatPassword")}</label><input id="confirmNewPassword" type="password" autoComplete="new-password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} className={inputClass} /></div>
              {error && <p role="alert" className="border-l-2 border-destructive pl-4 text-sm leading-6 text-destructive">{error}</p>}
              <button type="submit" disabled={isSubmitting} className="inline-flex h-12 w-full items-center justify-center gap-3 bg-primary px-7 text-[10px] uppercase tracking-[0.16em] text-primary-foreground disabled:opacity-50">{isSubmitting ? t("updating") : t("updatePassword")}<ArrowRight className="h-4 w-4" /></button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
