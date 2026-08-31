import React, { createContext, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const saveSession = async session => {
    await AsyncStorage.setItem("ecotracker_session", JSON.stringify(session));
    setUser(session);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("ecotracker_session");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, saveSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
