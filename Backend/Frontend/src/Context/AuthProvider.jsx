import React, { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const Authprovider = ({ children }) => {
  const [authUser, setAuthUser] = useState(() => {
    try {
      const stored = localStorage.getItem("messenger");
      return stored ? JSON.parse(stored) : null;
    } catch (_) {
      return null;
    }
  });

  return (
    <AuthContext.Provider value={[authUser, setAuthUser]}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);