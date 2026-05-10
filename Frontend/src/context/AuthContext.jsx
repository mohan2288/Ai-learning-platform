import { useEffect, useMemo, useState } from "react";
import { getProfile, loginUser, registerUser } from "../services/authService";
import { clearAuth, getStoredUser, saveAuth } from "../utils/storage";
import { AuthContext } from "./authContextValue";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("token")));

  useEffect(() => {
    const hydrateUser = async () => {
      if (!localStorage.getItem("token")) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await getProfile();
        setUser(data.user);
        saveAuth({ token: localStorage.getItem("token"), user: data.user });
      } catch {
        clearAuth();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    hydrateUser();
  }, []);

  const login = async (credentials) => {
    const { data } = await loginUser(credentials);
    saveAuth(data);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await registerUser(payload);
    saveAuth(data);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
