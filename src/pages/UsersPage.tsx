import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { User } from '../entities/userEntity';
import { UserRepository } from '../repositories/UserRepository';
import { UserDataModal } from '../components/modals/userModal';
import { ConfirmationModal } from '../components/confirmationModal';
import toast from 'react-hot-toast';

const UsersPage: React.FC = () => {
    //Variables para el manejo de la tabla de usuarios
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User>(new User());
    //Debuggin
    let doubleToastControl = false;
    //Variables para el manejo de aparacion de otros componentes
    const [showUserModal, setShowUserModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLoading, setShowLoading] = useState(true);

    // Obtener usuarios al cargar la página
    useEffect(() => {
      if (!doubleToastControl) fetchUsers();
    }, []);

    const fetchUsers = () => {
      doubleToastControl = true;
      setShowLoading(true);
      toast.promise(
        UserRepository.GetAll().then((users) => {setUsers(users); doubleToastControl = false;}, (error) => {console.log(error); toast.error("Hubo un error: " + error.toString()); setUsers([])}).finally(() => {setShowLoading(false)}),
        {
          loading: 'Adquiriendo usuarios...',
          success: undefined,
          error: (error) => (<span><b>Hubo un error:</b><br/>{(error.response.data.message ? error.response.data.message : error.toString())}</span>),
        },
        {
          error: {
            duration: 5000,
          }
        }
      );
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
        UserRepository.Delete(userId).then(fetchUsers, (error) => {console.log(error);}),
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
    //FIX Hay problemas con la validacion "nombre de usuario repetido"
    const handleSave = async (user: User | Partial<User>) => {
      if (user.id) {
        toast.promise(
          UserRepository.Update(user).then(fetchUsers, (error) => {console.log(error);}),
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
          UserRepository.Create(user as User).then(fetchUsers, (error) => {console.log(error);}),
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
        <Button onClick={handleAddUser}>Agregar usuario</Button>
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
                  <Button variant="primary" onClick={() => handleEditUser(user)}><i className="bi bi-pencil-fill"></i></Button>{' '}
                  <Button variant="danger" onClick={() => handleDeleteModal(user)}><i className="bi bi-trash-fill"></i></Button>
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
          handleSave={(user) => {handleSave(user);}}
          initialData={selectedUser}
        />

        {/* Modal para solicitar confirmacion al borrar un usuario */}
        <ConfirmationModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          handleSubmit={() => {
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