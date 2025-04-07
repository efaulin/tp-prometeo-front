import { useState } from "react";
import { useAuth } from "../utils/useAuth";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      // Enviar los datos de login al backend
      const response = await axiosInstance.post(`/auth/login`, {
        username,
        password,
      });
      // Almacenar el token en el localStorage
      localStorage.setItem("token", response.data.token);
      await login(response.data.user);
      // Redirigir al perfil o a la página protegida
      navigate("/users");
    } catch {
      toast.error("Credenciales incorrectas. Intenta de nuevo.");
      setPassword("");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "85vh" }}>
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
      </Form>
      </div>
    </div>
  );
};