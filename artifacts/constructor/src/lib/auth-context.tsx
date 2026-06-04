import { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  refetch: () => Promise<void>;
  signOut: (opts?: { callbackUrl?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refetch: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const signOut = async (opts?: { callbackUrl?: string }) => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {}
    setUser(null);
    window.location.href = opts?.callbackUrl || "/";
  };

  return (
    <AuthContext.Provider value={{ user, loading, refetch: fetchMe, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(AuthContext);
  return { data: ctx.user ? { user: ctx.user } : null, status: ctx.loading ? "loading" : ctx.user ? "authenticated" : "unauthenticated" };
}

export function useAuth() {
  return useContext(AuthContext);
}
