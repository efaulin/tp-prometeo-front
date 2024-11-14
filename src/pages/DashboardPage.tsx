import { useAuth } from "../utils/useAuth";

const DashboardPage = () => {
    const { logout } = useAuth();
    const handleLogout = () => {
        logout();
    };
    
    return (
        <div>
            <h1>Dashboard</h1>
            <p>¡Has iniciado sesión exitosamente!</p>
            <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
    );
};

export default DashboardPage;

