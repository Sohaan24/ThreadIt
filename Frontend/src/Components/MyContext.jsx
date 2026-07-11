import { useContext, useState } from "react";
import { createContext } from "react";
import api from "./axiosConfig";

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  const handleAuthentication = async (formData, isLoginMode) => {
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = isLoginMode ? "/api/auth/login" : "/api/auth/signup";

      const response = await api.post(endpoint, formData);
      setUser(response.data.user);
      return true;
    } catch (e) {
      setError(e.response?.data.error || e.response?.data.message || "Authentication Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await api.post("/api/auth/logout");

      setUser(null);

      console.log("Successfully logged out");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const providerValues = {
    handleAuthentication,
    isLoading,
    setIsLoading,
    setError,
    handleLogout,
    error,
    user,
  };

  return (
    <MyContext.Provider value={providerValues}>{children}</MyContext.Provider>
  );
};

export const useCont = () => {
  return useContext(MyContext);
};
