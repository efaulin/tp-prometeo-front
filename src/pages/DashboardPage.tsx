import { useAuth } from "../utils/useAuth";
import NavBar from "./Navbar";
import { Link } from 'react-router-dom';

const DashboardPage = () => {
    const { user } = useAuth();
    return (
        <div>
            <NavBar/>
            <h1>Home Page Dashboard</h1>
            {user && user.username ? (
                <div>
                    <h2>Bienvenido {user.username}</h2>
                    <h2>{user.role.name}</h2>
                    <p>¡Has iniciado sesión exitosamente!</p>
                </div>

            ) : (
                <Link className="btn btn-primary" to="/login">Loguearse</Link>
            )}
        </div>
    );
};

export default DashboardPage;

