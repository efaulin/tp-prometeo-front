import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { Secret } from "./pages/Secret";
import { ProtectedRoute } from "./pages/ProtectedRoute";
import { AuthProvider } from "./utils/useAuth";
import UsersPage from "./pages/UsersPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/secret"
          element={
            <ProtectedRoute>
              <Secret />
            </ProtectedRoute>
            
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;