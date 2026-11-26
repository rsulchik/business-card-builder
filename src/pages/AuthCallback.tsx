import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { sanitizeReturnPath } from "@/lib/auth";

const POST_AUTH_PATH_KEY = "lumiere-post-auth-path";

export default function AuthCallback() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      const destination = sanitizeReturnPath(window.sessionStorage.getItem(POST_AUTH_PATH_KEY));
      window.sessionStorage.removeItem(POST_AUTH_PATH_KEY);
      navigate(destination, { replace: true });
    } else {
      navigate("/login", { replace: true, state: { message: "Giriş tamamlanmady. Gaýtadan synanyşyň." } });
    }
  }, [isLoading, user, navigate]);

  return <div className="flex min-h-[60vh] items-center justify-center px-6 text-sm text-muted-foreground">Hasabyňyz taýýarlanýar...</div>;
}
