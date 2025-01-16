import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { User } from '../entities/userEntity';
import { UserRepository } from '../repositories/UserRepository';
import { UserDataModal } from '../components/userModal';
import { ConfirmationModal } from '../components/confirmationModal';
import toast from 'react-hot-toast';

const UsersPage: React.FC = () => {
    //Variables para el manejo de la tabla de usuarios
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User>(new User());
    //Variables para el manejo de aparacion de otros componentes
    const [showUserModal, setShowUserModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLoading, setShowLoading] = useState(true);

    // Obtener usuarios al cargar la página
    useEffect(() => {
      fetchUsers().catch((error) => {
        console.log(error);
        toast.error("Error al obtener los usuarios: " + error.response.data.message);
      });
    }, []);
    
    const fetchUsers = async () => {
      setShowLoading(true);
      setUsers(await UserRepository.GetAll());
      setShowLoading(false);
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
      toast.promise(
        UserRepository.Delete(userId).then(fetchUsers, undefined),
        {
          loading: 'Borrando...',
          success: <b>¡Usuario borrado!</b>,
          error: (err) => (<span><b>Hubo un error:</b><br/>{err.toString()}</span>),
        },
        {
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          }
        }
      );
    };

    const handleSave = async (user:User) => {
      if (user.id) {
        toast.promise(
          UserRepository.Update(user).then(fetchUsers, undefined),
          {
            loading: 'Guardando...',
            success: <b>¡Usuario modificado!</b>,
            error: (err) => (<span><b>Hubo un error:</b><br/>{err.toString()}</span>),
          },
          {
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            }
          }
        );
      } else {
        toast.promise(
          UserRepository.Create(user).then(fetchUsers, undefined),
          {
            loading: 'Guardando...',
            success: <b>¡Usuario creado!</b>,
            error: (err) => (<span><b>Hubo un error:</b><br/>{err.toString()}</span>),
          },
          {
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            }
          }
        );
      }
    }
  
    return (
      <div>
        <h2>Usuarios</h2>
        <Button onClick={handleAddUser}>Agregar Usuario</Button>
        {
          showLoading ?
          //showLoading = TRUE
          <div className='text-center'><h3>Cargando...</h3></div>
          ://showLoading = FALSE
          <Table className='my-3' striped bordered hover>
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
        }
  
        {/* Modal para añadir o editar usuario */}
        <UserDataModal
          show={showUserModal}
          handleClose={() => setShowUserModal(false)}
          handleSave={handleSave}
          initialData={selectedUser}
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