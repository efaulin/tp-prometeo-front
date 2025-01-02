import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { User } from '../entities/userEntity';
import NavBar from './Navbar';
import { UserRepository } from '../repositories/UserRepository';
import { UserDataModal } from '../components/userModal';
import { NotificationToast } from '../components/notificationToast';
import { ConfirmationModal } from '../components/confirmationModal';

const UsersPage: React.FC = () => {
    //Variables para el manejo de la tabla de usuarios
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User>(new User());
    //Variables para el manejo de aparacion de modals o toasts
    const [showUserModal, setShowUserModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    //Variables para el manejo de toasts
    const [toastText, setToastText] = useState("");
    const [toastVariant, setToastVariant] = useState<'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'>("light");

    // Obtener usuarios al cargar la página
    useEffect(() => {
      fetchUsers().catch((error) => {
        console.log(error);
        showError("Error al obtener los usuarios: " + error.response.data.message);
      });
    }, []);
  
    const fetchUsers = async () => {
      setUsers(await UserRepository.GetAll());
    };
    
    const handleAddUser = () => {
      setSelectedUser(new User()); // Limpiar selección para añadir
      setShowUserModal(true);
    };
  
    const handleEditUser = (user: User) => {
      setSelectedUser(user); // Seleccionar usuario para editar
      setShowUserModal(true);
    };

    const handleDeleteModal = (user:User) => {
      setSelectedUser(user);
      setShowDeleteModal(true);
    }

    const handleDeleteUser = async (userId: string) => {
      try {
        await UserRepository.Delete(userId);
        showSuccess("Peticion realizada correctamente");
        fetchUsers();
      } catch (error) {
        console.log("Error: " + error);
        showError("Error al realizar la peticion");
      }
    };
  
    const handleSave = async (user:User) => {
      try {
        if (user.id) {
          await UserRepository.Update(user);
        } else {
          await UserRepository.Create(user);
        }
        showSuccess("Peticion realizada correctamente");
        fetchUsers();
      } catch (error) {
        console.log("Error: " + error);
        showError("Error al realizar la peticion: " + error);
      }
    }

    const showError = (text:string) => {
      setToastText(text);
      setToastVariant("danger");
      setShowToast(true);
    }

    const showSuccess = (text:string) => {
      setToastText(text);
      setToastVariant("success");
      setShowToast(true);
    }
  
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
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role ? user.role.name : "RoleDeleted"}</td>
                <td>
                  <Button variant="light" style={{backgroundColor:'#ced4da'}} onClick={() => handleEditUser(user)}>Editar</Button>{' '}
                  <Button variant="danger" onClick={() => handleDeleteModal(user)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
  
        {/* Modal para añadir o editar usuario */}
        <UserDataModal
          show={showUserModal}
          handleClose={() => setShowUserModal(false)}
          handleSave={handleSave}
          initialData={selectedUser}
        />

        {/* Toast para notificar al usuario cuando cree, modifique o borre un usuario */}
        <NotificationToast
          show={showToast}
          handleClose={() => setShowToast(false)}
          delayInSec={undefined}
          header={undefined}
          body={toastText}
          variant={toastVariant}
        />

        {/* Modal para solicitar confirmacion al borrar un usuario */}
        <ConfirmationModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          handleSubmit={(e:React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            handleDeleteUser(selectedUser.id ? selectedUser!.id! : "0");
            setShowDeleteModal(false);
          }}
          question='¿Esta seguro que desea borrar el usuario?'
          submitButtonText='Borrar'
          submitButtonVariant='danger'
          cancelButtonText='Cancelar'
          cancelButtonVariant='secondary'
          moreInfo={selectedUser.username}
          size={undefined}
        />
      </div>
    );
  };
  
  export default UsersPage;