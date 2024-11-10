import { useAuth } from '../context/AuthProvider';

const DashboardPage = () => {
    const { logout } = useAuth();

    return (
        <div>
            <h1>Dashboard</h1>
            <p>¡Has iniciado sesión exitosamente!</p>
            <button onClick={logout}>Cerrar sesión</button>
        </div>
    );
};

export default DashboardPage;

