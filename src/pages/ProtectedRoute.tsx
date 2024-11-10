import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />; // Si no está autenticado, redirige al login
    }

    return children; // Si está autenticado, muestra el contenido protegido
};

export default ProtectedRoute;
