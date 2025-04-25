import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { AuthorRepository } from '../repositories/AuthorRepository';
import { ConfirmationModal } from '../components/confirmationModal';
import { Author } from '../entities/authorEntity';
import { AuthorDataModal } from '../components/modals/authorModal';

const AuthorsPage: React.FC = () => {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [selectedAuthor, setSelectedAuthor] = useState<Author>(new Author());
    //Debuggin
    let doubleToastControl = false;
    //Variables para el manejo de aparacion de otros componentes
    const [showAuthorModal, setShowAuthorModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
      if (!doubleToastControl) fetchAuthors();
    }, []);
  
    const fetchAuthors = () => {
      doubleToastControl = true;
      setShowLoading(true);
      toast.promise(
        AuthorRepository.GetAll().then((authors) => {setAuthors(authors); doubleToastControl = false;}, (error) => {console.log(error); toast.error("Hubo un error: " + error.toString()); setAuthors([])}).finally(() => {setShowLoading(false)}),
        {
          loading: 'Adquiriendo autores...',
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

    const handleAddAuthor= () => {
      setSelectedAuthor(new Author()); // Limpiar selección para añadir
      setShowAuthorModal(true);
    };
  
    const handleEditAuthor = (author: Author) => {
        setSelectedAuthor(author); // Seleccionar usuario para editar
        setShowAuthorModal(true);
    };

    const handleDeleteModal = (author: Author)=>{
      setSelectedAuthor(author);
      setShowDeleteModal(true);
    }

    const handleDeleteAuthor = async (authorId: string) => {
      toast.promise(
        AuthorRepository.Delete(authorId).then(fetchAuthors, (error) => {console.log(error);}),
        {
          loading: 'Borrando...',
          success: <b>¡Autor borrado!</b>,
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
  
    const handleSave = async (author: Author) => {
      if (author.id) {
        toast.promise(
          AuthorRepository.Update(author).then(fetchAuthors, (error) => {console.log(error);}),
          {
            loading: 'Guardando...',
            success: <b>¡Autor modificado!</b>,
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
          AuthorRepository.Create(author as Author).then(fetchAuthors, (error) => {console.log(error);}),
          {
            loading: 'Guardando...',
            success: <b>¡Autor creado!</b>,
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
        <h2>Autores</h2>
        <Button onClick={handleAddAuthor}>Agregar autor</Button>
        {
          showLoading ?
          //showLoading = TRUE
          <div className='text-center'><h3>Cargando...</h3></div>
          ://showLoading = FALSE
          <Table className='my-3' striped bordered hover>
            <thead>
              <tr>
                <th>Autores</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((author) => (
                <tr key={author.id}>
                  <td>{author.name}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleEditAuthor(author)}><i className="bi bi-pencil-fill"></i></Button>{' '}
                    <Button variant="danger" onClick={() => handleDeleteModal(author)}><i className="bi bi-trash-fill"></i></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        }
  
        {/* Modal para añadir o editar usuario */}
        <AuthorDataModal
          show={showAuthorModal}
          handleClose={() => setShowAuthorModal(false)}
          handleSave={(author) => {handleSave(author);}}
          initialData={selectedAuthor}
        />

        {/* Modal para solicitar confirmacion al borrar un usuario */}
        <ConfirmationModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          handleSubmit={() => {
            handleDeleteAuthor(selectedAuthor.id ? selectedAuthor!.id! : "0");
            setShowDeleteModal(false);
          }}
          question='¿Esta seguro que desea borrar este autor?'
          submitButtonText='Borrar'
          submitButtonVariant='danger'
          cancelButtonText='Cancelar'
          cancelButtonVariant='secondary'
          moreInfo={selectedAuthor.name}
          size={undefined}
        />
      </div>
    );
  };
  
  export default AuthorsPage;