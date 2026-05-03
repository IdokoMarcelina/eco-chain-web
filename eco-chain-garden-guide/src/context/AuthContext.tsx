import { createContext, useContext, useState, ReactNode } from "react";
import { removeToken } from "@/services/api";

type User = { name: string; email: string };

type AuthCtx = {
  user: User | null;
  /** Called by useLogin after a successful backend login. */
  login: (name: string, email: string) => void;
  /** Called by useSignup (optimistic local state only – real auth is via OTP). */
  signup: (name: string, email: string) => void;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Start with no user; the real session is driven by the backend token.
  // Restore the user from localStorage if one was previously saved.
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("eco_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (name: string, email: string) => {
    const u = { name: name || email.split("@")[0] || "Friend", email };
    setUser(u);
    localStorage.setItem("eco_user", JSON.stringify(u));
  };

  const signup = (name: string, email: string) => {
    // Optimistic local update – actual auth is confirmed after OTP verification.
    setUser({ name: name || "Friend", email });
  };

  const logout = () => {
    setUser(null);
    removeToken();
    localStorage.removeItem("eco_user");
  };

  return (
    <Ctx.Provider value={{ user, login, signup, logout }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
