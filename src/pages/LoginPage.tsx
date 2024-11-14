import { useState } from "react";
import { useAuth } from "../utils/useAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    // if (username === "user" && password === "password") {
    //   alert("Usuario logueado");
    //   await login({ username });
    // } else {
    //   alert("Invalid username or password");
    // }
    try {
      // Enviar los datos de login al backend
      const response = await axios.post("http://localhost:3005/api/auth/login", {
        username,
        password,
      });
      console.log(response);
      // Almacenar el token en el localStorage
      localStorage.setItem("token", response.data);
      await login({ username });
      // Redirigir al perfil o a la página protegida
      navigate("/users");
    } catch (error) {
      setError("Credenciales incorrectas. Intenta de nuevo.");
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <div>{error}</div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};