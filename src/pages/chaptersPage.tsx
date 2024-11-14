import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Row } from 'react-bootstrap';
import axiosInstance from '../utils/axiosInstance';
import NavBar from './Navbar';
import { LanguageInterface } from '../interfaces/languageInterface';
import { NarratorInterface } from '../interfaces/narratorInterface';
import { AuthorInterface } from '../interfaces/authorInterface';
import { HostInterface } from '../interfaces/hostInterface';
import { CollectionInterface } from '../interfaces/collectionInterface';
import { ChapterInterface } from '../interfaces/chapterInterface';

const UsersPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [chapters, setChapters] = useState<ChapterInterface[]>([]);
    const [languages, setLanguages] = useState<LanguageInterface[]>([]);
    const [narrators, setNarrators] = useState<NarratorInterface[]>([]);
    const [authors, setAuthors] = useState<AuthorInterface[]>([]);
    const [hosts, setHosts] = useState<HostInterface[]>([]);
    const [collections, setCollections] = useState<CollectionInterface[]>([]);
    const [selectedChapter, setSelectedChapter] = useState<ChapterInterface>();

    const handleFechaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setFecha(event.target.value);
    };
    const handleFechaFinishChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setFechaFinish(event.target.value);
    };

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
      console.log(selectedUser);
      if (selectedUser!._id != "0") {
        // Editar usuario
        const updUser = {
          username: selectedUser!.username,
          password: selectedUser!.password,
          email: selectedUser!.email,
          role: userRole?._id,
          suscripcions: [
            {
              startDate: new Date(fecha).toISOString(),
              endDate: new Date(fechaFinish).toISOString(),
              suscripcionId: userSuscriptions?.suscripcionId._id,
            }
          ],
        }
        console.log("updUsr: ");
        console.log(updUser);
        const result = await axiosInstance.put(`/usuario/${selectedUser!._id}`, updUser);
        console.log(result);
        fetchUsers();
      } else {
        // Añadir usuario
        const newUser = {
          username: selectedUser!.username,
          password: selectedUser!.password,
          email: selectedUser!.email,
          role: userRole?._id,
          suscripcions: [
            {
              startDate: selectedUser!.suscripcions[0].startDate,
              endDate: selectedUser!.suscripcions[0].endDate,
              suscripcionId: "670c3b7ef2006065e258366c",
            }
          ],
        }
        await axiosInstance.post('/usuario', newUser);
      }
      setShowModal(false);
      fetchUsers();
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
                <td>{chapter.narrator.name}</td>
                <td>{chapter.hosts.map(host => host.name).join("; ")}</td>
                <td>{chapter.durationInSeconds}</td>
                <td>{chapter.language.name}</td>
                <td>{chapter.description}</td>
                <td>{chapter.uploadDate.toDateString()}</td>
                <td>{chapter.publicationDate.toDateString()}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEditUser(user)}>Editar</Button>{' '}
                  <Button variant="danger" onClick={() => handleDeleteUser(user._id)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
  
        {/* Modal para añadir o editar usuario */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedUser ? 'Editar Usuario' : 'Agregar Usuario'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Nombre de usuario</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={selectedUser?.username || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value } as UserInterface)}
                />
              </Form.Group>
              <Form.Group controlId="formPass">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  required
                  type="password"
                  value={selectedUser?.password || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value } as UserInterface)}
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  value={selectedUser?.email || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value } as UserInterface)}
                />
              </Form.Group>
              <Form.Group controlId="formRole">
                <Form.Label>Tipo de usuario</Form.Label>
                <Form.Select aria-label="Seleccione rol del usuario" value={userRole ? userRole._id : ""} required onChange={(e) => setSelectedUserRole({ ...setSelectedUserRole, _id: e.target.value } as RoleInterface)}>
                  <option value="673124570945b0b475fe07c8">admin</option>
                  <option value="67327c62f40be4d6fc0933ae">client</option>
                </Form.Select>
              </Form.Group>
              <br/>
              <Form.Group controlId="formSuscripcionId">
                <Form.Label>Suscripcion inicial</Form.Label>
                <Form.Select aria-label="Seleccione tipo de suscripcion" value={userSuscriptions ? userSuscriptions.suscripcionId._id : ""} required onChange={(e) => setSelectedUserSuscriptions({ ...setSelectedUserSuscriptions, suscripcionId:{_id:e.target.value, type:"xd"}} as UserSuscriptionInterface)}>
                {suscriptions.map((scp) => (
                  <option value={scp._id}>{scp.type}</option>
                ))}
                </Form.Select>
              </Form.Group>
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
              </Form.Group>
              <br/>
              <Button variant="primary" type="submit">
                {selectedUser ? 'Guardar cambios' : 'Agregar'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  };
  
  export default UsersPage;