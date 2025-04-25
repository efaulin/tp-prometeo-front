import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { CollectionRepository } from '../repositories/CollectionRepository';
import { ConfirmationModal } from '../components/confirmationModal';
import { Collection } from '../entities/collectionEntity';
import { CollectionDataModal } from '../components/modals/collectionModal';

const CollectionsPage: React.FC = () => {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [selectedCollection, setSelectedCollection] = useState<Collection>(new Collection());
    //Debuggin
    let doubleToastControl = false;
    //Variables para el manejo de aparacion de otros componentes
    const [showCollectionModal, setShowCollectionModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
      if (!doubleToastControl) fetchCollections();
    }, []);
  
    const fetchCollections = () => {
      doubleToastControl = true;
      setShowLoading(true);
      toast.promise(
        CollectionRepository.GetAll().then((collections) => {setCollections(collections); doubleToastControl = false;}, (error) => {console.log(error); toast.error("Hubo un error: " + error.toString()); setCollections([])}).finally(() => {setShowLoading(false)}),
        {
          loading: 'Adquiriendo colecciones...',
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

    const handleAddCollection= () => {
      setSelectedCollection(new Collection()); // Limpiar selección para añadir
      setShowCollectionModal(true);
    };
  
    const handleEditCollection = (collection: Collection) => {
        setSelectedCollection(collection); // Seleccionar usuario para editar
        setShowCollectionModal(true);
    };

    const handleDeleteModal = (collection: Collection)=>{
      setSelectedCollection(collection);
      setShowDeleteModal(true);
    }

    const handleDeleteCollection = async (collectionId: string) => {
      toast.promise(
        CollectionRepository.Delete(collectionId).then(fetchCollections, (error) => {console.log(error);}),
        {
          loading: 'Borrando...',
          success: <b>¡Coleccion borrada!</b>,
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
  
    const handleSave = async (collection: Collection | Partial<Collection>) => {
      if (collection.id) {
        toast.promise(
          CollectionRepository.Update(collection).then(fetchCollections, (error) => {console.log(error);}),
          {
            loading: 'Guardando...',
            success: <b>¡Coleccion modificada!</b>,
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
          CollectionRepository.Create(collection as Collection).then(fetchCollections, (error) => {console.log(error);}),
          {
            loading: 'Guardando...',
            success: <b>¡Coleccion creada!</b>,
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
        <h2>Colecciones</h2>
        <Button onClick={handleAddCollection}>Agregar coleccion</Button>
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
              {collections.map((collection) => (
                <tr key={collection.id}>
                  <td>{collection.name}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleEditCollection(collection)}><i className="bi bi-pencil-fill"></i></Button>{' '}
                    <Button variant="danger" onClick={() => handleDeleteModal(collection)}><i className="bi bi-trash-fill"></i></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        }
  
        {/* Modal para añadir o editar usuario */}
        <CollectionDataModal
          show={showCollectionModal}
          handleClose={() => {setShowCollectionModal(false)}}
          handleSave={(collection) => {handleSave(collection);}}
          initialData={selectedCollection}
        />

        {/* Modal para solicitar confirmacion al borrar un usuario */}
        <ConfirmationModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          handleSubmit={() => {
            handleDeleteCollection(selectedCollection.id ? selectedCollection!.id! : "0");
            setShowDeleteModal(false);
          }}
          question='¿Esta seguro que desea borrar esta coleccion?'
          submitButtonText='Borrar'
          submitButtonVariant='danger'
          cancelButtonText='Cancelar'
          cancelButtonVariant='secondary'
          moreInfo={selectedCollection.name}
          size={undefined}
        />
      </div>
    );
  };
  
  export default CollectionsPage;