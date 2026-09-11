import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const restore = async () => {
      try {
        const raw = await AsyncStorage.getItem("ecotracker_session");
        if (!raw) return;
        const session = JSON.parse(raw);
        if (!session?.access) return;
        if (active) setUser(session.user || null);
        try {
          const response = await client.get("/me/");
          if (active) setUser(response.data);
          await AsyncStorage.setItem(
            "ecotracker_session",
            JSON.stringify({ ...session, user: response.data })
          );
        } catch {
          if (active) setUser(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    restore();
    return () => {
      active = false;
    };
  }, []);

  const saveSession = async session => {
    await AsyncStorage.setItem("ecotracker_session", JSON.stringify(session));
    setUser(session?.user || null);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("ecotracker_session");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, saveSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
