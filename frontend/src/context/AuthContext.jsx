import { createContext, useContext, useEffect, useState } from "react";
import { fetchMe } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const { user } = await fetchMe(token);
        if (!cancelled) setUser(user);
      } catch (err) {
        if (!cancelled) {
          console.error("Auth init failed:", err);
          setError(err.message);
          setToken(null);
          localStorage.removeItem("authToken");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = ({ token, user }) => {
    setToken(token);
    setUser(user);
    setError(null);
    localStorage.setItem("authToken", token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

