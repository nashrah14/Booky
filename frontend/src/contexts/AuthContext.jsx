import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const res = await api.auth.getSession();

      if (!res?.error && res?.data?.data) {
        setUser(res.data.data);
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    restoreSession();
  }, []);

  const signUp = async (email, password, userData = {}) => {
    const res = await api.auth.signUp(email, password, userData);
    if (!res.error && res.data?.user) {
      setUser(res.data.user);
    }
    return res;
  };

  const signIn = async (email, password) => {
    const res = await api.auth.signIn(email, password);
    if (!res.error && res.data?.user) {
      setUser(res.data.user);
    }
    return res;
  };

  const signOut = async () => {
    await api.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
