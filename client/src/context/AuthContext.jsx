import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

// wraps the whole app so any component can read who is logged in
// and call login / register / logout without prop drilling
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("airbnbUser");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const { data } = await api.post("/users/login", { email, password });
    localStorage.setItem("airbnbUser", JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (username, email, password) => {
    const { data } = await api.post("/users/register", {
      username,
      email,
      password,
