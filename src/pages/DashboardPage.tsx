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
                    <p>¡Has iniciado sesión exitosamente!</p>
                    <h2>Bienvenido {user.username}</h2>
                </div>

            ) : (
                <Link className="btn btn-primary" to="/login">Loguearse</Link>
            )}
        </div>
    );
};

export default DashboardPage;

