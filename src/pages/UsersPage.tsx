import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Row } from 'react-bootstrap';
import axiosInstance from '../utils/axiosInstance';
import { User, UserInterface, UserSubscription, UserSubscriptionInterface } from '../entities/userEntity'; 
import { Role, RoleInterface } from '../entities/roleEntity';
import NavBar from './Navbar';
import { Subscription, SubscriptionInterface } from '../entities/subscriptionEntity';
import { UserRepository } from '../repositories/UserRepository.ts';
import { SubscriptionRepository } from '../repositories/SubscriptionRepository.ts';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User>(new User());
    const [userRole, setSelectedUserRole] = useState<Role | null>(new Role({_id:"0", name:"tmp"}));
    const [userSubscriptions, setSelectedUserSubscriptions] = useState<UserSubscription>(new UserSubscription());
    const [userSubscriptionId, setSelectedUserSubscriptionId] = useState<string>("");
    const [fecha, setFecha] = useState<string>("");
    const [fechaFinish, setFechaFinish] = useState<string>("");

    const handleFechaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setFecha(event.target.value);
    };
    const handleFechaFinishChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setFechaFinish(event.target.value);
    };

    // Obtener usuarios al cargar la página
    useEffect(() => {
      fetchUsers();
      fetchSubscriptions()
    }, []);
  
    const fetchUsers = async () => {
      setUsers(await UserRepository.GetAll());
    };

    const fetchSubscriptions = async () => {
      setSubscriptions(await SubscriptionRepository.GetAll());
    };
    
    const handleAddUser = () => {
      setSelectedUser(new User()); // Limpiar selección para añadir
      setShowModal(true);
    };
  
    const handleEditUser = (user: User) => {
      setSelectedUser(user); // Seleccionar usuario para editar
      setSelectedUserRole(user.role);
      //TODO Falta implementar el manejo de subscriptiones, se parchea para pasar las validaciones del back.
      setSelectedUserSubscriptions(user.subscriptions[0]);
      setFecha(`${user.subscriptions[0].startDate.getFullYear()}-${String(user.subscriptions[0].startDate.getMonth() + 1).padStart(2, '0')}-${String(user.subscriptions[0].startDate.getDate()).padStart(2, '0')}T${String(user.subscriptions[0].startDate.getHours()).padStart(2, '0')}:${String(user.subscriptions[0].startDate.getMinutes()).padStart(2, '0')}`)
      setFechaFinish(`${user.subscriptions[0].endDate.getFullYear()}-${String(user.subscriptions[0].endDate.getMonth() + 1).padStart(2, '0')}-${String(user.subscriptions[0].endDate.getDate()).padStart(2, '0')}T${String(user.subscriptions[0].endDate.getHours()).padStart(2, '0')}:${String(user.subscriptions[0].endDate.getMinutes()).padStart(2, '0')}`);
      console.log(user);
      console.log(user.subscriptions[0]);
      console.log(userSubscriptions);
      setShowModal(true);
    };

    const handleDeleteUser = async (userId: string) => {
      await UserRepository.Delete(userId);
      fetchUsers();
    };
  
    const handleSubmit = async (event: React.FormEvent) => {
      //TODO Cambiar los eventos del modal y aplicar los cambios aca o en "applyingCahnges()". Problemas al usar "onChange()".
      event.preventDefault();
      applyingChanges();
      console.log(selectedUser);
      if (selectedUser?.id) {
        // Editar usuario
        console.log("Pre-UpdateUsr:");
        console.log(selectedUser);
        const result = await UserRepository.Update(selectedUser!);
        console.log("UpdateUsr:");
        console.log(result);
      } else {
        // Añadir usuario
        console.log("Pre-CreateUsr:");
        console.log(selectedUser);
        const result = await UserRepository.Create(selectedUser!);
        console.log("CreateUsr:");
        console.log(result);
      }
      setShowModal(false);
      fetchUsers();
    };

    const applyingChanges = () => {
      selectedUser.role = userRole;
      const tmpScrp = new Subscription({_id:userSubscriptionId, type:"xd"});
      const newUsrScrp = new UserSubscription(undefined, new Date(fecha), new Date(fechaFinish), tmpScrp);
      console.log("scrpId: "+ userSubscriptionId +" - tmpScrp:");
      console.log(tmpScrp);
      console.log("newUsrScrp:");
      console.log(newUsrScrp);
      selectedUser.subscriptions[0] = newUsrScrp;
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
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.email}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role ? user.role.name : "RoleDeleted"}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEditUser(user)}>Editar</Button>{' '}
                  <Button variant="danger" onClick={() => handleDeleteUser(user.id!)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
  
        {/* Modal para añadir o editar usuario */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedUser.id ? 'Editar Usuario' : 'Agregar Usuario'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Nombre de usuario</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={selectedUser.username || ''}
                  onChange={(e) => {
                    selectedUser.username = e.target.value;
                    //setSelectedUser({ ...selectedUser, username:  } as UserInterface)
                  }}
                />
              </Form.Group>
              <Form.Group controlId="formPass">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  required
                  type="password"
                  value={selectedUser.password || ''}
                  onChange={(e) => {
                    selectedUser.password = e.target.value;
                    //setSelectedUser({ ...selectedUser, password: e.target.value } as UserInterface)
                  }}
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  value={selectedUser.email || ''}
                  onChange={(e) => {
                    selectedUser.email = e.target.value;
                    //setSelectedUser({ ...selectedUser, email: e.target.value } as UserInterface)
                  }}
                />
              </Form.Group>
              <Form.Group controlId="formRole">
                <Form.Label>Tipo de usuario</Form.Label>
                <Form.Select aria-label="Seleccione rol del usuario" value={userRole?.id} required onChange={(e) => setSelectedUserRole(new Role({ ...setSelectedUserRole, _id: e.target.value } as RoleInterface))}>
                  <option value="673124570945b0b475fe07c8">admin</option>
                  <option value="67327c62f40be4d6fc0933ae">client</option>
                </Form.Select>
              </Form.Group>
              <br/>
              <Form.Group controlId="formSubscriptionId">
                <Form.Label>subscription inicial</Form.Label>
                <Form.Select aria-label="Seleccione tipo de subscription" value={userSubscriptions.subscription?.id} required onChange={(e) => setSelectedUserSubscriptionId(e.target.value)}>
                {subscriptions.map((scp) => (
                  <option value={scp.id!}>{scp.type}</option>
                ))}
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="formStartDate">
                <Form.Label>Fecha inico</Form.Label>
                <Row>
                <label>
                    Selecciona una fecha Inicial:
                    <input 
                        type="datetime-local" 
                        value={fecha} 
                        onChange={handleFechaChange} 
                        required 
                    />
                </label>
                </Row>
              </Form.Group>
              <Form.Group controlId="formEndDate">
                <Form.Label>Fecha fin</Form.Label>
                <Row>
                  <label>
                      Selecciona una fecha Final:
                      <input 
                          type="datetime-local" 
                          value={fechaFinish}
                          onChange={handleFechaFinishChange} 
                          required 
                      />
                  </label>
                </Row>
              </Form.Group>
              <br/>
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