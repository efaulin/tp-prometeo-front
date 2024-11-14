import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axiosInstance from '../utils/axiosInstance';
import NavBar from './Navbar';
import { narradorInterface } from '../interfaces/narradorInterface';

const NarradorPage: React.FC = () => {
    const [narrador, setNarrador] = useState<narradorInterface[]>([]);
    const [selectedNarrador, setSelectedNarrador] = useState<narradorInterface | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
      fetchnarrador();
    }, []);
  
    const fetchnarrador = async () => {
      const response = await axiosInstance.get('/narrador');
      setNarrador(response.data);
    };

    const handleAddNarrador= () => {
      setSelectedNarrador({
        _id: "0",
        name: "",
      } as narradorInterface); // Limpiar selección para añadir
      setShowModal(true);
    };
  
    const handleEditNarrador = (narrador: narradorInterface) => {
        setSelectedNarrador(narrador); // Seleccionar usuario para editar
        setShowModal(true);
    };

    const handleDeleteIdioma = async (narradorId: string) => {
      await axiosInstance.delete(`/narrador/${narradorId}`);
      fetchnarrador();
    };
  
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      console.log(selectedNarrador);
      if (selectedNarrador!._id != "0") {
        // Editar usuario
        const updNarrador = {
          name: selectedNarrador!.name,
        }
        const result = await axiosInstance.put(`/narrador/${selectedNarrador!._id}`, updNarrador);
        console.log(result);
        fetchnarrador();
      } else {
        const newNarrador = {
          name: selectedNarrador!.name,
        }
        await axiosInstance.post('/narrador', newNarrador);
      }
      setShowModal(false);
      fetchnarrador();
    };
  
    return (
      <div>
        <NavBar/>
        <h2>Narradores</h2>
        <Button onClick={handleAddNarrador}>Agregar narrador</Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Narrador</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {narrador.map((narrador) => (
              <tr key={narrador._id}>
                <td>{narrador.name}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEditNarrador(narrador)}>Editar</Button>{' '}
                  <Button variant="danger" onClick={() => handleDeleteIdioma(narrador._id)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
  
        {/* Modal para añadir o editar usuario */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedNarrador ? 'Editar Idioma' : 'Agregar Idioma'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Nombre del Narrador</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={selectedNarrador?.name || ''}
                  onChange={(e) => setSelectedNarrador({ ...selectedNarrador, name: e.target.value } as narradorInterface)}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                {selectedNarrador ? 'Editar' : 'Crear'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  };
  
  export default NarradorPage;