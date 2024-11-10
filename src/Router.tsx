import {
    createBrowserRouter
  } from "react-router-dom";
import DashboardPage from './pages/DashboardPage.tsx'
import LoginPage from "./pages/LoginPage.tsx";

const PersonalBrowserRouter = createBrowserRouter([
    {
        path: "/",
        element: <DashboardPage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
]);

export default PersonalBrowserRouter
  