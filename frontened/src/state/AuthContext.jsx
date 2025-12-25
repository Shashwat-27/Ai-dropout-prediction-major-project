import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* 🔁 Restore session on refresh */
  useEffect(() => {
    const raw = localStorage.getItem("ai_drop_auth");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        localStorage.removeItem("ai_drop_auth");
      }
    }
    setLoading(false);
  }, []);

  /* 💾 Persist session */
  useEffect(() => {
    if (user) {
      localStorage.setItem("ai_drop_auth", JSON.stringify(user));
    } else {
      localStorage.removeItem("ai_drop_auth");
    }
  }, [user]);

  /* 🔐 Login handler */
  const login = ({ id, role }) => {
    setUser({ id, role });
  };

  /* 🚪 Logout handler */
  const logout = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      role: user?.role || null,
      isAuthenticated: Boolean(user),
      loading,
      login,
      logout,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
