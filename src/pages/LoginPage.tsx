import { useState } from "react";
import { useAuth } from "../utils/useAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';


export const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      // Enviar los datos de login al backend
      const response = await axios.post("http://localhost:3005/api/auth/login", {
        username,
        password,
      });
      console.log(response);
      // Almacenar el token en el localStorage
      localStorage.setItem("token", response.data.data.token);
      await login(response.data.data.user);
      // Redirigir al perfil o a la página protegida
      navigate("/users");
    } catch (error) {
      setError("Credenciales incorrectas. Intenta de nuevo.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="w-100" style={{ maxWidth: "400px" }}>
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3">
          <Form.Label>Usuario</Form.Label>
          <Form.Control 
            id="username"
            placeholder="Ingrese un usuario" 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control 
             id="password"
             type="password"
             value={password}
             placeholder="Contraseña" 
             onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
        <br />
        <Badge bg="danger">{error}</Badge>
      </Form>
      </div>
    </div>
  );
};