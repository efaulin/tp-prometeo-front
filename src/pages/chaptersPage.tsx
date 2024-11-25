import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Row } from 'react-bootstrap';
import axiosInstance from '../utils/axiosInstance';
import NavBar from './Navbar';
import { LanguageInterface }  from '../entities/languageEntity' ;
import { NarratorInterface } from '../entities/narratorEntity';
import { AuthorInterface } from '../entities/authorEntity';
import { HostInterface } from '../entities/hostEntity';
import { CollectionInterface } from '../entities/collectionEntity';
import { ChapterInterface } from '../entities/chapterEntity';

const ChaptersPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [chapters, setChapters] = useState<ChapterInterface[]>([]);
    const [languages, setLanguages] = useState<LanguageInterface[]>([]);
    const [narrators, setNarrators] = useState<NarratorInterface[]>([]);
    const [authors, setAuthors] = useState<AuthorInterface[]>([]);
    const [hosts, setHosts] = useState<HostInterface[]>([]);
    const [collections, setCollections] = useState<CollectionInterface[]>([]);
    const [selectedChapter, setSelectedChapter] = useState<ChapterInterface>();
    const [selectedCollection, setSelectedCollection] = useState<CollectionInterface>();
    const [selectedNarrator, setSelectedNarrator] = useState<NarratorInterface>();
    const [selectedLanguage, setSelectedLanguage] = useState<LanguageInterface>();
    const [selectedAuthors, setSelectedAuthors] = useState<AuthorInterface[]>();
    const [selectedHosts, setSelectedHosts] = useState<HostInterface[]>();
    const [selectedPublicationDate, setSelectedPublicationDate] = useState<string>();

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
      setSelectedCollection({_id: chapter.coleccionId, name:"", description:""} as CollectionInterface);
      setSelectedLanguage(chapter.language as LanguageInterface);
      console.log("chap.Langua: ");
      console.log(chapter.language);
      console.log("selectLangua: ");
      console.log(selectedLanguage);
      if (chapter.hosts) {
        setSelectedHosts(chapter.hosts);
        setSelectedAuthors([]);
        setSelectedNarrator({} as NarratorInterface);
      } else {
        setSelectedHosts([]);
        setSelectedAuthors(chapter.authors);
        setSelectedNarrator(chapter.narrator);
      }
      //setFecha(`${new Date(user.suscripcions[0].startDate).getFullYear()}-${String(new Date(user.suscripcions[0].startDate).getMonth() + 1).padStart(2, '0')}-${String(new Date(user.suscripcions[0].startDate).getDate()).padStart(2, '0')}T${String(new Date(user.suscripcions[0].startDate).getHours()).padStart(2, '0')}:${String(new Date(user.suscripcions[0].startDate).getMinutes()).padStart(2, '0')}`)
      //setFechaFinish(`${new Date(user.suscripcions[0].endDate).getFullYear()}-${String(new Date(user.suscripcions[0].endDate).getMonth() + 1).padStart(2, '0')}-${String(new Date(user.suscripcions[0].endDate).getDate()).padStart(2, '0')}T${String(new Date(user.suscripcions[0].endDate).getHours()).padStart(2, '0')}:${String(new Date(user.suscripcions[0].endDate).getMinutes()).padStart(2, '0')}`);
      setShowModal(true);
      fetchChapters();
    };

    const handleDeleteChapter = async (chapterId: string) => {
      await axiosInstance.delete(`/capitulo/${chapterId}`);
      fetchChapters();
    };
  
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      console.log(selectedChapter);
      if (selectedChapter!._id != "0") {
        // Editar usuario
        const updChapter = {
          coleccionId: selectedCollection?._id,
          name: selectedChapter?.name,
          hosts: [hosts[0]._id],
          durationInSeconds: selectedChapter?.durationInSeconds,
          language: selectedLanguage?._id,
          description: selectedChapter?.description,
          uploadDate: new Date().toISOString(),
          publicationDate: new Date().toISOString()
        }
        
        console.log("updChapter: ");
        console.log(updChapter);
        const result = await axiosInstance.put(`/capitulo/${selectedChapter!._id}`, updChapter);
        console.log(result);
      } else {
        // Añadir usuario
        const newUser = {
          coleccionId: selectedCollection?._id,
          name: selectedChapter?.name,
          hosts: [hosts[0]._id],
          durationInSeconds: 15,
          language: selectedLanguage?._id,
          description: selectedChapter?.description,
          uploadDate: new Date().toISOString(),
          publicationDate: new Date().toISOString()
        }
        await axiosInstance.post('/capitulo', newUser);
      }
      setShowModal(false);
      fetchChapters();
    };
  
    return (
      <div>
        <NavBar/>
        <h2 className='mb-3'>Capitulos</h2>
        <Button className='mb-3' onClick={handleAddChapter}>Agregar Capitulo</Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Coleccion</th>
              <th>Hosts</th>
              <th>Narrador</th>
              <th>Autores</th>
              <th>Duracion (segundos)</th>
              <th>Idioma</th>
              <th>Descripcion</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {chapters.map((chapter) => (
              <tr key={chapter._id}>
                <td>{chapter.name}</td>
                <td>{collections ? collections.find(collection => collection._id == chapter.coleccionId)?.name : "-"}</td>
                <td>{chapter.hosts && chapter.hosts.length > 0 ? chapter.hosts.map(host => host.name).join("; ") : "Sin host"}</td>
                {(!chapter.hosts || chapter.hosts.length === 0) && (
                    <>
                        <td>{chapter.narrator?.name || "Sin narrador"}</td>
                        <td>
                            {chapter.authors && chapter.authors.length > 0 
                                ? chapter.authors.map(author => author.name).join("; ") 
                                : "Sin autores"}
                        </td>
                    </>
                )}
                {(chapter.hosts && chapter.hosts.length > 0) && (
                    <>
                        <td>{"Sin narrador"}</td>
                        <td>
                            {chapter.authors && chapter.authors.length > 0 
                                ? "Sin autores" 
                                : "Sin autores"}
                        </td>
                    </>
                )}
                <td>{chapter.durationInSeconds}</td>
                <td>{chapter.language.name}</td>
                <td>{chapter.description}</td>
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
            <Modal.Title>{selectedChapter ? 'Editar Capitulo' : 'Agregar Capitulo'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Nombre de capitulo</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={selectedChapter?.name || ''}
                  onChange={(e) => setSelectedChapter({ ...selectedChapter, name: e.target.value } as ChapterInterface)}
                />
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>Descripcion de capitulo</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={selectedChapter?.description || ''}
                  onChange={(e) => setSelectedChapter({ ...selectedChapter, description: e.target.value } as ChapterInterface)}
                />
              </Form.Group>
              
              <Form.Group controlId="formCollection">
                <Form.Label>Coleccion a la que pertenece</Form.Label>
                <Form.Select aria-label="Seleccione Coleccion" value={selectedCollection ? selectedCollection._id : ""} required onChange={(e) => setSelectedCollection({ ...setCollections, _id: e.target.value } as CollectionInterface)}>
                  {
                    collections.map((collection)=> (
                      <option value={collection._id}>{collection.name}</option>
                    ))
                  }
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="formLanguage">
                <Form.Label>Idioma del capitulo</Form.Label>
                <Form.Select aria-label="Seleccione Idioma" value={selectedLanguage ? selectedLanguage._id : ""} required onChange={(e) => setSelectedLanguage({ ...setSelectedLanguage, _id: e.target.value } as LanguageInterface)}>
                  {
                    languages.map((language)=> (
                      <option value={language._id}>{language.name}</option>
                    ))
                  }
                </Form.Select>
              </Form.Group>
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