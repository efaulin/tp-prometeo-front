import {
    createBrowserRouter
  } from "react-router-dom";
import DashboardPage from './pages/DashboardPage.tsx'
import LoginPage from "./pages/LoginPage.tsx";
import UsersPage from "./pages/UsersPage.tsx";


const PersonalBrowserRouter = createBrowserRouter([
    {
        path: "/",
        element: <DashboardPage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/dashboard",
        element: <DashboardPage />,
    },
    {
        path: "/users",
        element: <UsersPage />,
    }
]);

export default PersonalBrowserRouter
  