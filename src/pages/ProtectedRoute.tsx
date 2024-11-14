import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../utils/useAuth";
interface ProtectedRouteProps {
    children: ReactNode;
  }

  export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user } = useAuth();
    if (!user) {
      // user is not authenticated
      return <Navigate to="/login" />;
    }
    return <>{children}</>;
  };