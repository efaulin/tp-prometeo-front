import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { Secret } from "./pages/Secret";
import { ProtectedRoute } from "./pages/ProtectedRoute";
import { AuthProvider } from "./utils/useAuth";
import UsersPage from "./pages/UsersPage";
import IdiomaPage from "./pages/IdiomaPage";
import NarradorPage from "./pages/NarradorPage";
import ChaptersPage from "./pages/chaptersPage";

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
        />,
        <Route
          path="/idiomas"
          element={
            <ProtectedRoute>
              <IdiomaPage />
            </ProtectedRoute>
            
          }
        />
        <Route
          path="/narradores"
          element={
            <ProtectedRoute>
              <NarradorPage />
            </ProtectedRoute>
          }
        />,
        <Route
          path="/chapters"
          element={
            <ProtectedRoute>
              <ChaptersPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;