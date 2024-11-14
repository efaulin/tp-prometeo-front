import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Row } from 'react-bootstrap';
import axiosInstance from '../utils/axiosInstance';
import NavBar from './Navbar';
import { idiomaInterface as LanguageInterface }  from '../interfaces/idiomaInterface' ;
import { narradorInterface as NarratorInterface } from '../interfaces/narradorInterface';
import { AuthorInterface } from '../interfaces/authorInterface';
import { HostInterface } from '../interfaces/hostInterface';
import { CollectionInterface } from '../interfaces/collectionInterface';
import { ChapterInterface } from '../interfaces/chapterInterface';

const ChaptersPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [chapters, setChapters] = useState<ChapterInterface[]>([]);
    const [languages, setLanguages] = useState<LanguageInterface[]>([]);
    const [narrators, setNarrators] = useState<NarratorInterface[]>([]);
    const [selectedNarrator, setSelectedNarrator] = useState<NarratorInterface>(null);
    const [authors, setAuthors] = useState<AuthorInterface[]>([]);
    const [hosts, setHosts] = useState<HostInterface[]>([]);
    const [collections, setCollections] = useState<CollectionInterface[]>([]);
    const [selectedChapter, setSelectedChapter] = useState<ChapterInterface>();

    // const handleFechaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //   setFecha(event.target.value);
    // };
    // const handleFechaFinishChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //   setFechaFinish(event.target.value);
    // };

    // Obtener usuarios al cargar la página
    useEffect(() => {
      fetchChapters();
      fetchLanguages();
      fetchNarrators();
      fetchAuthors();
      fetchHosts();
      fetchCollections();
    }, []);
  
    const fetchChapters = async () => {
      const response = await axiosInstance.get('/capitulo');
      console.log(response);
      setChapters(response.data);
    };

    const fetchLanguages = async () => {
      const response = await axiosInstance.get('/idioma');
      setLanguages(response.data);
    };

    const fetchNarrators = async () => {
      const response = await axiosInstance.get('/narrador');
      setNarrators(response.data);
    };

    const fetchAuthors = async () => {
      const response = await axiosInstance.get('/autor');
      setAuthors(response.data);
    };

    const fetchHosts = async () => {
      const response = await axiosInstance.get('/conductor');
      setHosts(response.data);
    };

    const fetchCollections = async () => {
      const response = await axiosInstance.get('/coleccion');
      setCollections(response.data);
    };

    const handleAddChapter = () => {
      setSelectedChapter({
        _id: "0",
        coleccionId: "",
        name: "",
        authors: [],
        narrator: {_id: "0", name: ""} as NarratorInterface,
        hosts: [],
        durationInSeconds: 0,
        language: {_id: "0", name: ""} as LanguageInterface,
        description: "",
        uploadDate: new Date(),
        publicationDate: new Date(),
      } as ChapterInterface); // Limpiar selección para añadir
      setShowModal(true);
    };
  
    const handleEditChapter = (chapter: ChapterInterface) => {
      setSelectedChapter(chapter);
      //setFecha(`${new Date(user.suscripcions[0].startDate).getFullYear()}-${String(new Date(user.suscripcions[0].startDate).getMonth() + 1).padStart(2, '0')}-${String(new Date(user.suscripcions[0].startDate).getDate()).padStart(2, '0')}T${String(new Date(user.suscripcions[0].startDate).getHours()).padStart(2, '0')}:${String(new Date(user.suscripcions[0].startDate).getMinutes()).padStart(2, '0')}`)
      //setFechaFinish(`${new Date(user.suscripcions[0].endDate).getFullYear()}-${String(new Date(user.suscripcions[0].endDate).getMonth() + 1).padStart(2, '0')}-${String(new Date(user.suscripcions[0].endDate).getDate()).padStart(2, '0')}T${String(new Date(user.suscripcions[0].endDate).getHours()).padStart(2, '0')}:${String(new Date(user.suscripcions[0].endDate).getMinutes()).padStart(2, '0')}`);
      setShowModal(true);
    };

    const handleDeleteChapter = async (chapterId: string) => {
      await axiosInstance.delete(`/capitulo/${chapterId}`);
      fetchChapters();
    };
  
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      console.log(selectedChapter);
      // if (selectedUser!._id != "0") {
      //   // Editar usuario
      //   const updUser = {
      //     username: selectedUser!.username,
      //     password: selectedUser!.password,
      //     email: selectedUser!.email,
      //     role: userRole?._id,
      //     suscripcions: [
      //       {
      //         startDate: new Date(fecha).toISOString(),
      //         endDate: new Date(fechaFinish).toISOString(),
      //         suscripcionId: userSuscriptions?.suscripcionId._id,
      //       }
      //     ],
      //   }
      //   console.log("updUsr: ");
      //   console.log(updUser);
      //   const result = await axiosInstance.put(`/usuario/${selectedUser!._id}`, updUser);
      //   console.log(result);
      //   fetchChapters();
      // } else {
      //   // Añadir usuario
      //   const newUser = {
      //     username: selectedUser!.username,
      //     password: selectedUser!.password,
      //     email: selectedUser!.email,
      //     role: userRole?._id,
      //     suscripcions: [
      //       {
      //         startDate: selectedUser!.suscripcions[0].startDate,
      //         endDate: selectedUser!.suscripcions[0].endDate,
      //         suscripcionId: "670c3b7ef2006065e258366c",
      //       }
      //     ],
      //   }
      //   await axiosInstance.post('/usuario', newUser);
      // }
      // setShowModal(false);
      // fetchChapters();
    };
  
    return (
      <div>
        <NavBar/>
        <h2>Usuarios</h2>
        <Button onClick={handleAddChapter}>Agregar Capitulo</Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Coleccion</th>
              <th>Autores</th>
              <th>Narrador</th>
              <th>Conductores</th>
              <th>Duracion (segundos)</th>
              <th>Idioma</th>
              <th>Descripcion</th>
              <th>Fecha de subida</th>
              <th>Fecha de publicacion</th>
            </tr>
          </thead>
          <tbody>
            {chapters.map((chapter) => (
              <tr key={chapter._id}>
                <td>{chapter._id}</td>
                <td>{chapter.name}</td>
                <td>{collections ? collections.find(collection => collection._id == chapter.coleccionId)?.name : "-"}</td>
                <td>{chapter.authors.map(author => author.name).join("; ")}</td>
                {/* <td>{chapter.narrator.name}</td> */}
                {/* <td>{chapter.hosts.map(host => host.name).join("; ")}</td> */}
                <td>{chapter.durationInSeconds}</td>
                <td>{chapter.language.name}</td>
                <td>{chapter.description}</td>
                {/* <td>{chapter.uploadDate.toDateString()}</td>
                <td>{chapter.publicationDate.toDateString()}</td> */}
                <td>
                  <Button variant="warning" onClick={() => handleEditChapter(chapter)}>Editar</Button>{' '}
                  <Button variant="danger" onClick={() => handleDeleteChapter(chapter._id)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
  
        {/* Modal para añadir o editar usuario */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedChapter ? 'Editar Usuario' : 'Agregar Usuario'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Nombre de usuario</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={selectedChapter?.name || ''}
                  onChange={(e) => setSelectedChapter({ ...selectedChapter, username: e.target.value } as ChapterInterface)}
                />
              </Form.Group>
              
             
              <Form.Group controlId="formRole">
                <Form.Label>Tipo de usuario</Form.Label>
                <Form.Select aria-label="Seleccione Narrador" value={selectedNarrator ? selectedNarrator._id : ""} required onChange={(e) => setSelectedNarrator({ ...setSelectedNarrator, _id: e.target.value } as NarratorInterface)}>
                  {
                    narrators.map((narrador)=>{
                      return `<option value="${narrador._id}">${narrador.name}</option>`
                    })
                  }
                </Form.Select>
              </Form.Group>


{/*               
              <Form.Group controlId="formStartDate">
                <Form.Label>Fecha inico</Form.Label>
                <Row>
                <label>
                    Selecciona una fecha Inicial:
                    <input 
                        type="datetime-local" 
                        value={fecha} 
                        onChange={handleFechaChange} 
                        required 
                    />
                </label>
                </Row>
              </Form.Group>
              <Form.Group controlId="formEndDate">
                <Form.Label>Fecha fin</Form.Label>
                <Row>
                  <label>
                      Selecciona una fecha Final:
                      <input 
                          type="datetime-local" 
                          value={fechaFinish}
                          onChange={handleFechaFinishChange} 
                          required 
                      />
                  </label>
                </Row>
              </Form.Group> */}
              <br/>
              <Button variant="primary" type="submit">
                {selectedChapter ? 'Guardar cambios' : 'Agregar'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  };
  
  export default ChaptersPage;