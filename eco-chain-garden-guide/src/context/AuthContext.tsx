import { createContext, useContext, useState, ReactNode } from "react";

type User = { name: string; email: string };
type AuthCtx = {
  user: User | null;
  login: (email: string) => void;
  signup: (name: string, email: string) => void;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Pre-authenticate so dashboard/green-match are immediately viewable
  const [user, setUser] = useState<User | null>({ name: "Amara", email: "amara@eco-chain.app" });

  const login = (email: string) => setUser({ name: email.split("@")[0] || "Friend", email });
  const signup = (name: string, email: string) => setUser({ name: name || "Friend", email });
  const logout = () => setUser(null);

  return <Ctx.Provider value={{ user, login, signup, logout }}>{children}</Ctx.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
