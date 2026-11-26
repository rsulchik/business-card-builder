import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import SocialSignInButtons from "@/components/SocialSignInButtons";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeReturnPath, validateAuthFields, type AuthMode } from "@/lib/auth";
import { useLanguage } from "@/i18n";

export default function AuthPage({ mode }: { mode: AuthMode }) {
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  const [notice, setNotice] = useState("");
  const returnPath = sanitizeReturnPath((location.state as { from?: string; message?: string } | null)?.from);

  useEffect(() => {
    const message = (location.state as { message?: string } | null)?.message;
    if (message) setNotice(message);
  }, [location.state]);

  if (!isLoading && user && mode !== "forgot") return <Navigate to={returnPath} replace />;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const validationError = validateAuthFields({ mode, fullName, email, password, confirmPassword });
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setNotice("");
    setIsSubmitting(true);

    if (mode === "login") {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (signInError) {
        setError(signInError.message.includes("Email not confirmed")
          ? "E-poçtaňyz heniz tassyklanmady. Hatyňyzy barlap, tassyklaýyş baglanyşygyny açyň."
          : "E-poçta ýa-da açar söz nädogry. Maglumatlary barlap, gaýtadan synanyşyň.");
      } else {
        navigate(returnPath, { replace: true });
      }
    } else if (mode === "register") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { full_name: fullName.trim(), email_notifications: emailNotifications },
        },
      });
      if (signUpError) {
        setError(signUpError.message.includes("not allowed")
          ? "Bu e-poçta salgysyny ulanyp bolmaýar. Dogry işleýän salgyňyzy giriziň."
          : "Hasap döretmek başartmady. Maglumatlary barlap, gaýtadan synanyşyň.");
      }
      else if (data.session) navigate(returnPath, { replace: true });
      else setComplete(true);
    } else {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) setError("Baglanyşyk ugradylmady. Biraz garaşyp, gaýtadan synanyşyň.");
      else setComplete(true);
    }
    setIsSubmitting(false);
  };

  const copy = {
    login: { eyebrow: t("loginEyebrow"), title: t("loginTitle"), intro: t("loginIntro"), submit: t("login") },
    register: { eyebrow: t("registerEyebrow"), title: t("registerTitle"), intro: t("registerIntro"), submit: t("createAccount") },
    forgot: { eyebrow: t("forgotEyebrow"), title: t("forgotTitle"), intro: t("forgotIntro"), submit: t("getNewLink") },
  }[mode];
  const labelClass = "mb-2 block text-[10px] font-medium uppercase tracking-[0.15em] text-foreground";
  const inputClass = "h-12 w-full border-0 border-b border-border bg-transparent px-0 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-0";

  return (
    <section className="mx-auto min-h-[65vh] max-w-xl px-6 py-14 md:py-20">
      <div className="border-t border-foreground pt-8">
        <div className="mx-auto w-full max-w-md">
          {complete ? (
            <div>
              <span className="mb-7 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-accent"><Check className="h-5 w-5" /></span>
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-accent">{copy.eyebrow}</p>
              <h1 className="mt-5 font-display text-3xl leading-[0.95] tracking-[-0.035em]">{mode === "register" ? t("checkEmail") : t("resetEmailSent")}</h1>
              <p className="mt-6 text-sm leading-7 text-muted-foreground">
                {mode === "register"
                  ? t("emailConfirmation", { email })
                  : t("resetEmailSent")}
              </p>
              <Link to="/login" className="mt-8 inline-flex items-center gap-3 border-b border-foreground pb-1 text-[10px] font-medium uppercase tracking-[0.16em]">{t("backToLogin")} <ArrowRight className="h-4 w-4" /></Link>
            </div>
          ) : (
            <>
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-accent">{copy.eyebrow}</p>
              <h1 className="mt-5 font-display text-3xl leading-[0.92] tracking-[-0.04em] md:text-5xl">{copy.title}</h1>
              <p className="mt-6 text-sm leading-7 text-muted-foreground">{copy.intro}</p>

              {mode !== "forgot" && import.meta.env.VITE_AUTH_MODE !== "email" && (
                <div className="mt-9">
                  <SocialSignInButtons returnPath={returnPath} />
                  <div className="my-7 flex items-center gap-4"><span className="h-px flex-1 bg-border" /><span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">ýa-da e-poçta bilen</span><span className="h-px flex-1 bg-border" /></div>
                </div>
              )}

              <form onSubmit={handleSubmit} className={mode === "forgot" ? "mt-9 space-y-6" : "space-y-6"} noValidate>
                {mode === "register" && (
                  <div><label htmlFor="fullName" className={labelClass}>{t("name")}</label><input id="fullName" name="name" autoComplete="name" maxLength={80} value={fullName} onChange={event => setFullName(event.target.value)} className={inputClass} placeholder={t("name")} /></div>
                )}
                <div><label htmlFor="email" className={labelClass}>{t("email")}</label><input id="email" name="email" type="email" inputMode="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} className={inputClass} placeholder="you@example.com" /></div>
                {mode !== "forgot" && (
                  <div>
                    <div className="flex items-center justify-between gap-4"><label htmlFor="password" className={labelClass}>{t("password")}</label>{mode === "login" && <Link to="/forgot-password" className="mb-2 text-[10px] text-muted-foreground underline underline-offset-4">{t("forgotPassword")}</Link>}</div>
                    <input id="password" name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={event => setPassword(event.target.value)} className={inputClass} placeholder={t("passwordHint")} />
                  </div>
                )}
                {mode === "register" && (
                  <>
                    <div><label htmlFor="confirmPassword" className={labelClass}>{t("confirmPassword")}</label><input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} className={inputClass} /></div>
                    <label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-muted-foreground"><Checkbox checked={emailNotifications} onCheckedChange={checked => setEmailNotifications(checked === true)} className="mt-0.5" />{t("emailUpdates")}</label>
                  </>
                )}
                {notice && <p role="status" className="border-l-2 border-accent pl-4 text-sm leading-6 text-muted-foreground">{notice}</p>}
                {error && <p role="alert" className="border-l-2 border-destructive pl-4 text-sm leading-6 text-destructive">{error}</p>}
                <button type="submit" disabled={isSubmitting} className="inline-flex h-12 w-full items-center justify-center gap-3 bg-primary px-7 text-[10px] font-medium uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? t("wait") : copy.submit}<ArrowRight className="h-4 w-4" /></button>
              </form>

              <p className="mt-8 text-center text-xs leading-6 text-muted-foreground">
                {mode === "login" ? <>{t("noAccount")} <Link to="/register" state={{ from: returnPath }} className="text-foreground underline underline-offset-4">{t("registerLink")}</Link></> : mode === "register" ? <>{t("haveAccount")} <Link to="/login" state={{ from: returnPath }} className="text-foreground underline underline-offset-4">{t("loginLink")}</Link></> : <>{t("forgotRemembered")} <Link to="/login" className="text-foreground underline underline-offset-4">{t("backToLogin")}</Link></>}
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
