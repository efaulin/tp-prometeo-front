import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Row } from 'react-bootstrap';
import { User, UserInterface, UserSubscription, UserSubscriptionInterface } from '../entities/userEntity'; 
import { Role, RoleInterface } from '../entities/roleEntity';
//import NavBar from './Navbar';
import { Subscription, SubscriptionInterface } from '../entities/subscriptionEntity';
import { UserRepository } from '../repositories/UserRepository';
import { SubscriptionRepository } from '../repositories/SuscriptionRepository';
import { UserDataModal } from '../components/userModal';

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
  
    const handleSave = (user:User) => {
      //Do something
    }

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
        {/* <NavBar/> */}
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
              <tr key={user.id}>
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
        <UserDataModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          handleSave={handleSave}
          initialData={selectedUser}
        />
      </div>
    );
  };
  
  export default UsersPage;