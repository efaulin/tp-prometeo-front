import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Row } from 'react-bootstrap';
import axiosInstance from '../utils/axiosInstance';
import { User, UserInterface, UserSuscription, UserSuscriptionInterface } from '../entities/userEntity'; 
import { Role, RoleInterface } from '../entities/roleEntity';
import NavBar from './Navbar';
import { Suscription, SuscriptionInterface } from '../entities/suscriptionEntity';
import { UserRepository } from '../repositories/UserRepository.ts';
import { SuscriptionRepository } from '../repositories/SuscriptionRepository.ts';
import { UserDataModal } from '../components/userModal.tsx';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [suscriptions, setSuscriptions] = useState<Suscription[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User>(new User());
    const [userRole, setSelectedUserRole] = useState<Role | null>(new Role({_id:"0", name:"tmp"}));
    const [userSuscriptions, setSelectedUserSuscriptions] = useState<UserSuscription>(new UserSuscription());
    const [userSuscriptionId, setSelectedUserSuscriptionId] = useState<string>("");
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
      fetchSuscriptions()
    }, []);
  
    const fetchUsers = async () => {
      setUsers(await UserRepository.GetAll());
    };

    const fetchSuscriptions = async () => {
      setSuscriptions(await SuscriptionRepository.GetAll());
    };
    
    const handleAddUser = () => {
      setSelectedUser(new User()); // Limpiar selección para añadir
      setShowModal(true);
    };
  
    const handleEditUser = (user: User) => {
      setSelectedUser(user); // Seleccionar usuario para editar
      setSelectedUserRole(user.role);
      //TODO Falta implementar el manejo de suscripciones, se parchea para pasar las validaciones del back.
      setSelectedUserSuscriptions(user.suscripcions[0]);
      setFecha(`${user.suscripcions[0].startDate.getFullYear()}-${String(user.suscripcions[0].startDate.getMonth() + 1).padStart(2, '0')}-${String(user.suscripcions[0].startDate.getDate()).padStart(2, '0')}T${String(user.suscripcions[0].startDate.getHours()).padStart(2, '0')}:${String(user.suscripcions[0].startDate.getMinutes()).padStart(2, '0')}`)
      setFechaFinish(`${user.suscripcions[0].endDate.getFullYear()}-${String(user.suscripcions[0].endDate.getMonth() + 1).padStart(2, '0')}-${String(user.suscripcions[0].endDate.getDate()).padStart(2, '0')}T${String(user.suscripcions[0].endDate.getHours()).padStart(2, '0')}:${String(user.suscripcions[0].endDate.getMinutes()).padStart(2, '0')}`);
      console.log(user);
      console.log(user.suscripcions[0]);
      console.log(userSuscriptions);
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
      const tmpScrp = new Suscription({_id:userSuscriptionId, type:"xd"});
      const newUsrScrp = new UserSuscription(undefined, new Date(fecha), new Date(fechaFinish), tmpScrp);
      console.log("scrpId: "+ userSuscriptionId +" - tmpScrp:");
      console.log(tmpScrp);
      console.log("newUsrScrp:");
      console.log(newUsrScrp);
      selectedUser.suscripcions[0] = newUsrScrp;
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