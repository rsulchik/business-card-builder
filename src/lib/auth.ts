export type AuthMode = "login" | "register" | "forgot";

interface AuthFields {
  mode: AuthMode;
  fullName?: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

export function sanitizeReturnPath(path: unknown): string {
  return typeof path === "string" && path.startsWith("/") && !path.startsWith("//") ? path : "/account";
}

export function validateAuthFields({ mode, fullName = "", email, password = "", confirmPassword = "" }: AuthFields): string | null {
  if (mode === "register" && fullName.trim().length === 0) return "Adyňyzy ýazyň.";
  if (mode === "register" && fullName.trim().length > 80) return "At 80 harpdan köp bolmaly däl.";
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) return "Dogry e-poçta salgysyny ýazyň.";
  if (mode === "forgot") return null;
  if (password.length < 8) return "Açar söz azyndan 8 harpdan ybarat bolmaly.";
  if (mode === "register" && password !== confirmPassword) return "Açar sözler gabat gelmeýär.";
  return null;
}
