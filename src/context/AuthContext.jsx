import { createContext, useContext, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // App load hote hi localStorage se user info restore karte hain (cookies already
  // browser mein hain, ye sirf UI ke liye "kaun logged in hai" yaad rakhne ke liye hai)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("apiobs_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const { data } = await client.post("/auth/login", { email, password });
    setUser(data.data);
    localStorage.setItem("apiobs_user", JSON.stringify(data.data));
    return data;
  };

  const register = async (userName, email, password) => {
    const { data } = await client.post("/auth/register", { userName, email, password });
    return data;
  };

  const verifyEmail = async (email, otp) => {
    const { data } = await client.post("/auth/verify-email", { email, otp });
    setUser(data.data);
    localStorage.setItem("apiobs_user", JSON.stringify(data.data));
    return data;
  };

  const logout = async () => {
    try {
      await client.post("/auth/logout");
    } finally {
      setUser(null);
      localStorage.removeItem("apiobs_user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, verifyEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
