import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axiosInstance from '../utils/axiosInstance';
import NavBar from './Navbar';
import { idiomaInterface } from '../interfaces/idiomaInterface';

const IdiomaPage: React.FC = () => {
    const [idiomas, setIdiomas] = useState<idiomaInterface[]>([]);
    const [selectedIdioma, setSelectedIdioma] = useState<idiomaInterface | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
      fetchIdiomas();
    }, []);
  
    const fetchIdiomas = async () => {
      const response = await axiosInstance.get('/idioma');
      setIdiomas(response.data);
    };

    const handleAddIdioma= () => {
      setSelectedIdioma({
        _id: "0",
        name: "",
      } as idiomaInterface); // Limpiar selección para añadir
      setShowModal(true);
    };
  
    const handleEditIdioma = (idioma: idiomaInterface) => {
        setSelectedIdioma(idioma); // Seleccionar usuario para editar
        setShowModal(true);
    };

    const handleDeleteIdioma = async (idiomaId: string) => {
      await axiosInstance.delete(`/idioma/${idiomaId}`);
      fetchIdiomas();
    };
  
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      console.log(selectedIdioma);
      if (selectedIdioma!._id != "0") {
        // Editar usuario
        const updIdioma = {
          name: selectedIdioma!.name,
        }
        // console.log("updUsr: ");
        // console.log(updIdioma);
        const result = await axiosInstance.put(`/idioma/${selectedIdioma!._id}`, updIdioma);
        console.log(result);
        fetchIdiomas();
      } else {
        const newIdioma = {
          name: selectedIdioma!.name,
        }
        await axiosInstance.post('/idioma', newIdioma);
      }
      setShowModal(false);
      fetchIdiomas();
    };
  
    return (
      <div>
        <NavBar/>
        <h2>Idiomas</h2>
        <Button onClick={handleAddIdioma}>Agregar idioma</Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Idioma</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {idiomas.map((idioma) => (
              <tr key={idioma._id}>
                <td>{idioma.name}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEditIdioma(idioma)}>Editar</Button>{' '}
                  <Button variant="danger" onClick={() => handleDeleteIdioma(idioma._id)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
  
        {/* Modal para añadir o editar usuario */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedIdioma ? 'Editar Idioma' : 'Agregar Idioma'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Nombre de idioma</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={selectedIdioma?.name || ''}
                  onChange={(e) => setSelectedIdioma({ ...selectedIdioma, name: e.target.value } as idiomaInterface)}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                {selectedIdioma ? 'Editar' : 'Crear'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  };
  
  export default IdiomaPage;