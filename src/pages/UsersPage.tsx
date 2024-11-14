import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axiosInstance from '../utils/axiosInstance';
import { UserInterface, UserSuscriptionInterface } from '../interfaces/userInterface'; 
import { RoleInterface } from '../interfaces/roleInterface';
import NavBar from './Navbar';
import { SuscriptionInterface } from '../interfaces/suscriptionInterface';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<UserInterface[]>([]);
    const [suscriptions, setSuscriptions] = useState<SuscriptionInterface[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);
    const [userRole, setSelectedUserRole] = useState<RoleInterface | null>({_id:"0", name:"tmp"});
    const [userSuscriptions, setSelectedUserSuscriptions] = useState<{suscripcionId:string, startDate:Date, endDate:Date}[] | null>([]);
  
    // Obtener usuarios al cargar la página
    useEffect(() => {
      fetchUsers();
    }, []);
  
    const fetchUsers = async () => {
      const response = await axiosInstance.get('/usuario');
      setUsers(response.data);
    };

    const fetchSuscriptions = async () => {
      const response = await axiosInstance.get('/suscripcion');
      setSuscriptions(response.data);
    };
  
    const handleAddUser = () => {
      if (!suscriptions) fetchSuscriptions();
      setSelectedUser({
        _id: "0",
        username: "",
        email: "",
        role: users[0].role,
        suscripcions: users[0].suscripcions,
      } as UserInterface); // Limpiar selección para añadir
      setShowModal(true);
    };
  
    const handleEditUser = (user: UserInterface) => {
      if (!suscriptions) fetchSuscriptions();
      setSelectedUser(user); // Seleccionar usuario para editar
      setSelectedUserRole(user.role);
      setSelectedUserSuscriptions(user.suscripcions.map((suscp) => ({suscripcionId:suscp.suscripcionId.toString(), startDate:suscp.startDate, endDate:suscp.endDate})) as {suscripcionId:string, startDate:Date, endDate:Date}[]);
      setShowModal(true);
    };
  
    const handleDeleteUser = async (userId: string) => {
      await axiosInstance.delete(`/usuario/${userId}`);
      fetchUsers();
    };
  
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      console.log(selectedUser);
      if (selectedUser!._id != "0") {
        // Editar usuario
        const updUser = {
          username: selectedUser!.username,
          password: selectedUser!.password,
          email: selectedUser!.email,
          role: userRole?._id,
          suscripcions: [
            {
              startDate: selectedUser!.suscripcions[0].startDate,
              endDate: selectedUser!.suscripcions[0].endDate,
              suscripcionId: "670c3b7ef2006065e258366c",
            }
          ],
        }
        await axiosInstance.put(`/usuario/${selectedUser!._id}`, updUser);
      } else {
        // Añadir usuario
        const newUser = {
          username: selectedUser!.username,
          password: selectedUser!.password,
          email: selectedUser!.email,
          role: userRole?._id,
          suscripcions: [
            {
              startDate: selectedUser!.suscripcions[0].startDate,
              endDate: selectedUser!.suscripcions[0].endDate,
              suscripcionId: "670c3b7ef2006065e258366c",
            }
          ],
        }
        await axiosInstance.post('/usuario', newUser);
      }
      setShowModal(false);
      fetchUsers();
    };
  
    return (
      <div>
        <NavBar/>
        <h2>Usuarios</h2>
        <Button onClick={handleAddUser}>Agregar Usuario</Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nombre de usuario</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.email}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEditUser(user)}>Editar</Button>{' '}
                  <Button variant="danger" onClick={() => handleDeleteUser(user._id)}>Eliminar</Button>
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
                <Form.Label>Nombre de usuario</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={selectedUser?.username || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value } as UserInterface)}
                />
              </Form.Group>
              <Form.Group controlId="formPass">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  required
                  type="password"
                  value={selectedUser?.password || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value } as UserInterface)}
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  value={selectedUser?.email || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value } as UserInterface)}
                />
              </Form.Group>
              <Form.Group controlId="formRole">
                <Form.Label>Tipo de usuario</Form.Label>
                <Form.Select aria-label="Default select example" required onChange={(e) => setSelectedUserRole({ ...setSelectedUserRole, _id: e.target.value } as RoleInterface)}>
                  <option value="673124570945b0b475fe07c8">admin</option>
                  <option value="67327c62f40be4d6fc0933ae">client</option>
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="formSuscripcionId">
                <Form.Label>Suscripcion inicial</Form.Label>
                <Form.Select aria-label="Default select example" required onChange={(e) => setSelectedUserSuscriptions([{suscripcionId:e.target.value, startDate:new Date(), endDate:new Date(2025,1,1)}])}>
                {suscriptions.map((scp) => (
                  <option value={scp._id}>{scp.type}</option>
                ))}
                </Form.Select>
              </Form.Group>
              {/*<Form.Group controlId="formSuscriptions">
                <Form.Label>Suscripciones</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser?.suscripcions.toString() || ''}
                  onChange={(e) => setSelectedUserSuscriptions({ ...setSelectedUserSuscriptions} as UserSuscriptionInterface[])}
                />
              </Form.Group>*/}
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