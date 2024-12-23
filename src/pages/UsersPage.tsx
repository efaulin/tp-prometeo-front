import React, { useEffect, useState } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { User } from '../entities/userEntity';
//import NavBar from './Navbar';
import { UserRepository } from '../repositories/UserRepository';
import { UserDataModal } from '../components/userModal';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User>(new User());

    // Obtener usuarios al cargar la página
    useEffect(() => {
      fetchUsers();
    }, []);
  
    const fetchUsers = async () => {
      setUsers(await UserRepository.GetAll());
    };
    
    const handleAddUser = () => {
      setSelectedUser(new User()); // Limpiar selección para añadir
      setShowModal(true);
    };
  
    const handleEditUser = (user: User) => {
      setSelectedUser(user); // Seleccionar usuario para editar
      setShowModal(true);
    };

    const handleDeleteUser = async (userId: string) => {
      await UserRepository.Delete(userId);
      fetchUsers();
    };
  
    const handleSave = async (user:User) => {
      console.log("Saving user:");
      console.log(user as User);
      try {
        if (user.id) {
          console.log("Update method ->"); //TODO Borrar log; Agregar refresh de tabla
          const result = await UserRepository.Update(user);
          console.log(result);
        } else {
          await UserRepository.Create(user)
        }
      } catch (error) {
        console.log("Error: " + error);
      }
    }
  
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