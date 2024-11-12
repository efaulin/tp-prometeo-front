import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
}

axios.defaults.baseURL = 'http://localhost:3005';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
    // Obtener usuarios al cargar la página
    useEffect(() => {
      fetchUsers();
    }, []);
  
    const fetchUsers = async () => {
      const response = await axios.get('/api/usuario');
      console.log("Respuesta")
      console.log(response)
      setUsers(response.data);
    };
  
    const handleAddUser = () => {
      setSelectedUser(null); // Limpiar selección para añadir
      setShowModal(true);
    };
  
    const handleEditUser = (user: User) => {
      setSelectedUser(user); // Seleccionar usuario para editar
      setShowModal(true);
    };
  
    const handleDeleteUser = async (userId: number) => {
      await axios.delete(`/api/usuario/${userId}`);
      fetchUsers();
    };
  
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      if (selectedUser) {
        // Editar usuario
        await axios.put(`/api/usuario/${selectedUser.id}`, selectedUser);
      } else {
        // Añadir usuario
        await axios.post('/api/usuario', selectedUser);
      }
      setShowModal(false);
      fetchUsers();
    };
  
    return (
      <div>
        <h2>Usuarios</h2>
        <Button onClick={handleAddUser}>Agregar Usuario</Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEditUser(user)}>Editar</Button>{' '}
                  <Button variant="danger" onClick={() => handleDeleteUser(user.id)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
  
        {/* Modal para añadir o editar usuario */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedUser ? 'Editar Usuario' : 'Agregar Usuario'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser?.name || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value } as User)}
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={selectedUser?.email || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value } as User)}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                {selectedUser ? 'Guardar cambios' : 'Agregar'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  };
  
  export default UsersPage;