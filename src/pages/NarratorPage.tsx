import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { NarratorRepository } from '../repositories/NarratorRepository';
import { ConfirmationModal } from '../components/confirmationModal';
import { Narrator } from '../entities/narratorEntity';
import { NarratorDataModal } from '../components/modals/narratorModal';

const NarratorsPage: React.FC = () => {
    const [narrators, setNarrators] = useState<Narrator[]>([]);
    const [selectedNarrator, setSelectedNarrator] = useState<Narrator>(new Narrator());
    //Debuggin
    let doubleToastControl = false;
    //Variables para el manejo de aparacion de otros componentes
    const [showNarratorModal, setShowNarratorModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
      if (!doubleToastControl) fetchNarrators();
    }, []);
  
    const fetchNarrators = () => {
      doubleToastControl = true;
      setShowLoading(true);
      toast.promise(
        NarratorRepository.GetAll().then((narrators) => {setNarrators(narrators); doubleToastControl = false;}, (error) => {console.log(error); toast.error("Hubo un error: " + error.toString()); setNarrators([])}).finally(() => {setShowLoading(false)}),
        {
          loading: 'Adquiriendo narradores...',
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

    const handleAddNarrator= () => {
      setSelectedNarrator(new Narrator()); // Limpiar selección para añadir
      setShowNarratorModal(true);
    };
  
    const handleEditNarrator = (narrator: Narrator) => {
        setSelectedNarrator(narrator); // Seleccionar usuario para editar
        setShowNarratorModal(true);
    };

    const handleDeleteModal = (narrator: Narrator)=>{
      setSelectedNarrator(narrator);
      setShowDeleteModal(true);
    }

    const handleDeleteNarrator = async (narratorId: string) => {
      toast.promise(
        NarratorRepository.Delete(narratorId).then(fetchNarrators, (error) => {console.log(error);}),
        {
          loading: 'Borrando...',
          success: <b>¡Narrador borrado!</b>,
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
  
    const handleSave = async (narrator: Narrator) => {
      if (narrator.id) {
        toast.promise(
          NarratorRepository.Update(narrator).then(fetchNarrators, (error) => {console.log(error);}),
          {
            loading: 'Guardando...',
            success: <b>¡Narrador modificado!</b>,
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
          NarratorRepository.Create(narrator as Narrator).then(fetchNarrators, (error) => {console.log(error);}),
          {
            loading: 'Guardando...',
            success: <b>¡Narrador creado!</b>,
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
        <h2>Narradores</h2>
        <Button onClick={handleAddNarrator}>Agregar narrador</Button>
        {
          showLoading ?
          //showLoading = TRUE
          <div className='text-center'><h3>Cargando...</h3></div>
          ://showLoading = FALSE
          <Table className='my-3' striped bordered hover>
            <thead>
              <tr>
                <th>Narradores</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {narrators.map((narrator) => (
                <tr key={narrator.id}>
                  <td>{narrator.name}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleEditNarrator(narrator)}><i className="bi bi-pencil-fill"></i></Button>{' '}
                    <Button variant="danger" onClick={() => handleDeleteModal(narrator)}><i className="bi bi-trash-fill"></i></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        }
  
        {/* Modal para añadir o editar usuario */}
        <NarratorDataModal
          show={showNarratorModal}
          handleClose={() => setShowNarratorModal(false)}
          handleSave={(narrator) => {handleSave(narrator);}}
          initialData={selectedNarrator}
        />

        {/* Modal para solicitar confirmacion al borrar un usuario */}
        <ConfirmationModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          handleSubmit={() => {
            handleDeleteNarrator(selectedNarrator.id ? selectedNarrator!.id! : "0");
            setShowDeleteModal(false);
          }}
          question='¿Esta seguro que desea borrar este narrador?'
          submitButtonText='Borrar'
          submitButtonVariant='danger'
          cancelButtonText='Cancelar'
          cancelButtonVariant='secondary'
          moreInfo={selectedNarrator.name}
          size={undefined}
        />
      </div>
    );
  };
  
  export default NarratorsPage;