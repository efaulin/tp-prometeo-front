import { createContext, useContext, useMemo, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";

interface UserAuthData {
  id: string;
  username: string;
  role: string;
}

export interface AuthData {
  token: string;
  user: UserAuthData;
}

interface AuthContextType {
  user: UserAuthData; // Cambia `any` al tipo específico de usuario si lo tienes
  login: (data: UserAuthData) => void; // Cambia `any` si tienes un tipo específico para `data`
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  // Llama a esta función para autenticar al usuario
  const login = async (userData: UserAuthData) => {
    setUser(userData);
  };

  // Llama a esta función para cerrar sesión
  const logout = () => {
    setUser(null);
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};
