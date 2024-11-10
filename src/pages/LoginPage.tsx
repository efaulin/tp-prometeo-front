import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = () => {
        login();
        navigate("/dashboard");
    };

    return (
        <div>
            <h1>Login</h1>
            <button onClick={handleLogin}>Iniciar sesión</button>
        </div>
    );
};

export default LoginPage;
