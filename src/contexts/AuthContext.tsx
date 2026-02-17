import { createContext, useContext, useState, ReactNode } from "react";

export type Plan = "free" | "pro" | "enterprise";

interface User {
  name: string;
  email: string;
  plan: Plan;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => void;
  signUp: (name: string, email: string, password: string) => void;
  signOut: () => void;
  setPlan: (plan: Plan) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("pf_user");
    return stored ? JSON.parse(stored) : null;
  });

  const signIn = (email: string, _password: string) => {
    const stored = localStorage.getItem("pf_user");
    const existing = stored ? JSON.parse(stored) : null;
    const u = { name: existing?.name || email.split("@")[0], email, plan: (existing?.plan as Plan) || "free" };
    localStorage.setItem("pf_user", JSON.stringify(u));
    setUser(u);
  };

  const signUp = (name: string, email: string, _password: string) => {
    const u = { name, email, plan: "free" as Plan };
    localStorage.setItem("pf_user", JSON.stringify(u));
    setUser(u);
  };

  const signOut = () => {
    localStorage.removeItem("pf_user");
    setUser(null);
  };

  const setPlan = (plan: Plan) => {
    if (!user) return;
    const u = { ...user, plan };
    localStorage.setItem("pf_user", JSON.stringify(u));
    setUser(u);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, setPlan }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
