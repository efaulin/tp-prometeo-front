import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { HostRepository } from '../repositories/HostRepository';
import { ConfirmationModal } from '../components/confirmationModal';
import { Host } from '../entities/hostEntity';
import { HostDataModal } from '../components/modals/hostModal';

const HostsPage: React.FC = () => {
    const [hosts, setHosts] = useState<Host[]>([]);
    const [selectedHost, setSelectedHost] = useState<Host>(new Host());
    //Debuggin
    let doubleToastControl = false;
    //Variables para el manejo de aparacion de otros componentes
    const [showHostModal, setShowHostModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
      if (!doubleToastControl) fetchHosts();
    }, []);
  
    const fetchHosts = () => {
      doubleToastControl = true;
      setShowLoading(true);
      toast.promise(
        HostRepository.GetAll().then((hosts) => {setHosts(hosts); doubleToastControl = false;}, (error) => {console.log(error); toast.error("Hubo un error: " + error.toString()); setHosts([])}).finally(() => {setShowLoading(false)}),
        {
          loading: 'Adquiriendo conductores...',
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

    const handleAddHost= () => {
      setSelectedHost(new Host()); // Limpiar selección para añadir
      setShowHostModal(true);
    };
  
    const handleEditHost = (host: Host) => {
        setSelectedHost(host); // Seleccionar usuario para editar
        setShowHostModal(true);
    };

    const handleDeleteModal = (host: Host)=>{
      setSelectedHost(host);
      setShowDeleteModal(true);
    }

    const handleDeleteHost = async (hostId: string) => {
      toast.promise(
        HostRepository.Delete(hostId).then(fetchHosts, (error) => {console.log(error);}),
        {
          loading: 'Borrando...',
          success: <b>¡Conductor borrado!</b>,
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
  
    const handleSave = async (host: Host) => {
      if (host.id) {
        toast.promise(
          HostRepository.Update(host).then(fetchHosts, (error) => {console.log(error);}),
          {
            loading: 'Guardando...',
            success: <b>¡Conductor modificado!</b>,
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
          HostRepository.Create(host as Host).then(fetchHosts, (error) => {console.log(error);}),
          {
            loading: 'Guardando...',
            success: <b>¡Conductor creado!</b>,
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
        <h2>Conductores</h2>
        <Button onClick={handleAddHost}>Agregar conductor</Button>
        {
          showLoading ?
          //showLoading = TRUE
          <div className='text-center'><h3>Cargando...</h3></div>
          ://showLoading = FALSE
          <Table className='my-3' striped bordered hover>
            <thead>
              <tr>
                <th>Conductores</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {hosts.map((host) => (
                <tr key={host.id}>
                  <td>{host.name}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleEditHost(host)}><i className="bi bi-pencil-fill"></i></Button>{' '}
                    <Button variant="danger" onClick={() => handleDeleteModal(host)}><i className="bi bi-trash-fill"></i></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        }
  
        {/* Modal para añadir o editar usuario */}
        <HostDataModal
          show={showHostModal}
          handleClose={() => setShowHostModal(false)}
          handleSave={(host) => {handleSave(host);}}
          initialData={selectedHost}
        />

        {/* Modal para solicitar confirmacion al borrar un usuario */}
        <ConfirmationModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          handleSubmit={() => {
            handleDeleteHost(selectedHost.id ? selectedHost!.id! : "0");
            setShowDeleteModal(false);
          }}
          question='¿Esta seguro que desea borrar este conductor?'
          submitButtonText='Borrar'
          submitButtonVariant='danger'
          cancelButtonText='Cancelar'
          cancelButtonVariant='secondary'
          moreInfo={selectedHost.name}
          size={undefined}
        />
      </div>
    );
  };
  
  export default HostsPage;