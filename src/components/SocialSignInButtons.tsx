import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LovableMark } from "@lovable.dev/cloud-auth-js/react";
import { Button } from "@/components/ui/button";
import { lovable } from "@/integrations/lovable";
import { sanitizeReturnPath } from "@/lib/auth";
import { useLanguage } from "@/i18n";

const POST_AUTH_PATH_KEY = "lumiere-post-auth-path";

function GoogleLogo() {
  return (
    <svg aria-hidden="true" className="h-[18px] w-[18px]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
    </svg>
  );
}

export default function SocialSignInButtons({ returnPath = "/account" }: { returnPath?: string }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [provider, setProvider] = useState<"google" | "lovable" | null>(null);
  const [error, setError] = useState("");

  const signIn = async (selectedProvider: "google" | "lovable") => {
    setError("");
    setProvider(selectedProvider);
    const destination = sanitizeReturnPath(returnPath);
    window.sessionStorage.setItem(POST_AUTH_PATH_KEY, destination);

    try {
      const result = await lovable.auth.signInWithOAuth(selectedProvider, {
        redirect_uri: `${window.location.origin}/auth/callback`,
      });
      if (result.error) {
        setError("Giriş başartmady. Gaýtadan synanyşyň.");
        setProvider(null);
        return;
      }
      if (result.redirected) return;
      navigate(destination, { replace: true });
    } catch {
      setError("Giriş başartmady. Gaýtadan synanyşyň.");
      setProvider(null);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        disabled={provider !== null}
        onClick={() => void signIn("google")}
        className="h-12 w-full rounded-none border-[var(--google-button-border)] bg-[var(--google-button-background)] px-3 text-sm font-medium leading-5 text-[var(--google-button-foreground)] hover:bg-[var(--google-button-background)] hover:opacity-85"
      >
        <GoogleLogo />
        {provider === "google" ? t("signingIn") : t("googleContinue")}
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled={provider !== null}
        onClick={() => void signIn("lovable")}
        className="h-12 w-full rounded-none"
      >
        <LovableMark className="h-[18px] w-[18px]" />
        {provider === "lovable" ? t("signingIn") : t("lovableContinue")}
      </Button>
      {error && <p role="alert" className="text-sm leading-6 text-destructive">{error}</p>}
    </div>
  );
}
