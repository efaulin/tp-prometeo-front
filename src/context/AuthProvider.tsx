// import React, { createContext, useState, useContext, ReactNode } from 'react';
// // Definición de los tipos
// interface AuthContextType {
//     token: string | null;
//     login: (token: string) => void;
//     logout: () => void;
// }
// interface AuthProviderProps {
//     children: ReactNode;
//   }

// // Crear el contexto de autenticación
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

//   const login = (token: string) => {
//     setToken(token);
//     localStorage.setItem('token', token); // Guarda el token
//   };

//   const logout = () => {
//     setToken(null);
//     localStorage.removeItem('token');
//   };

//   return (
//     <AuthContext.Provider value={{ token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within an AuthProvider");
//   return context;
// };
