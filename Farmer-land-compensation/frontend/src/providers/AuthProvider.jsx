import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const defaultUser = null;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("ldss_auth");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.user || null;
    }
    return defaultUser;
  });
  const [tokens, setTokens] = useState(() => {
    const stored = localStorage.getItem("ldss_auth");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.tokens || null;
    }
    return null;
  });

  const login = (nextUser, nextTokens) => {
    const payload = { user: nextUser, tokens: nextTokens };
    localStorage.setItem("ldss_auth", JSON.stringify(payload));
    setUser(nextUser);
    setTokens(nextTokens);
  };

  const logout = () => {
    localStorage.removeItem("ldss_auth");
    setUser(null);
    setTokens(null);
  };

  const value = useMemo(
    () => ({ user, tokens, login, logout }),
    [user, tokens]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
