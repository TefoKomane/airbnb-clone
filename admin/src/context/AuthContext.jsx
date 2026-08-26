import { createContext, useContext, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

// the admin session is stored under its own localStorage key so logging
// in as a host here never conflicts with a guest login on the client app
export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem("airbnbAdmin");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const { data } = await api.post("/users/login", { email, password });

    if (data.role !== "host") {
      throw new Error("Only host accounts can access the admin dashboard");
    }

    localStorage.setItem("airbnbAdmin", JSON.stringify(data));
    setAdmin(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("airbnbAdmin");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
