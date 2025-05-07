import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { Collection } from '../entities/collectionEntity';
import { Chapter } from '../entities/chapterEntity';
import { ChapterRepository } from '../repositories/ChapterRepository';
import toast from 'react-hot-toast';
import { CollectionRepository } from '../repositories/CollectionRepository';
import { ChapterDataModal } from '../components/modals/chapterModal';
import { ConfirmationModal } from '../components/confirmationModal';

const ChaptersPage: React.FC = () => {
    //Variables para el manejo de la tabla de usuarios
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [selectedChapter, setSelectedChapter] = useState<Chapter>(new Chapter());
    //Debuggin
    let doubleToastControl = false;
    //Variables para el manejo de aparacion de otros componentes
    const [showChapterModal, setShowChapterModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLoading, setShowLoading] = useState(true);

    // Obtener usuarios al cargar la página
    useEffect(() => {
      if (!doubleToastControl) {
        fetchCollections();
        fetchChapters();
      };
    }, []);

    const fetchChapters = () => {
      doubleToastControl = true;
      setShowLoading(true);
      toast.promise(
        ChapterRepository.GetAll().then((chapters) => {setChapters(chapters); doubleToastControl = false;}, (error) => {console.log(error); toast.error("Hubo un error: " + error.toString()); setChapters([])}).finally(() => {setShowLoading(false)}),
        {
          loading: 'Adquiriendo capitulos...',
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

    const handleAddChapter = () => {
      setSelectedChapter(new Chapter()); // Limpiar selección para añadir
      setShowChapterModal(true);
    };
  
    const handleEditChapter = (chapter: Chapter) => {
      setSelectedChapter(chapter);
      setShowChapterModal(true);
    };

    const handleDeleteModal = async (chapter: Chapter) => {
      setSelectedChapter(chapter);
      setShowDeleteModal(true);
    };

    const handleDeleteUser = async (chapterId: string) => {
      toast.promise(
        ChapterRepository.Delete(chapterId).then(fetchChapters, (error) => {console.log(error);}),
        {
          loading: 'Borrando...',
          success: <b>Capitulo borrado!</b>,
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

    const handleSave = async (chapter: Chapter | Partial<Chapter>) => {
      console.log(chapter);
      if (chapter.id) {
        toast.promise(
          ChapterRepository.Update(chapter).then(fetchChapters, (error) => {console.log(error);}),
          {
            loading: 'Guardando...',
            success: <b>¡Capitulo modificado!</b>,
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
          ChapterRepository.Create(chapter as Chapter).then(fetchChapters, (error) => {console.log(error);}),
          {
            loading: 'Guardando...',
            success: <b>¡Capitulo creado!</b>,
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
        <h2 className='mb-3'>Capitulos</h2>
        <Button className='mb-3' onClick={handleAddChapter}>Agregar Capitulo</Button>
        {
          showLoading ?
          //showLoading = TRUE
          <div className='text-center'><h3>Cargando...</h3></div>
          ://showLoading = FALSE
          <Table className='my-3' striped bordered hover>
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
                <tr key={chapter.id}>
                  <td>{chapter.name}</td>
                  <td>{collections ? collections.find(collection => collection.id == chapter.collectionId)?.name : "-"}</td>
                  <td>{chapter.getHosts() && chapter.getHosts()!.length > 0 ? chapter.getHosts()!.map(host => host.name).join("; ") : "Sin conductor"}</td>
                  {(!chapter.getHosts() || chapter.getHosts()!.length == 0) && (
                    <>
                      <td>{chapter.getNarrator()?.name || "Sin narrador"}</td>
                      <td>
                        {chapter.getAuthors() && chapter.getAuthors()!.length > 0 
                          ? chapter.getAuthors()!.map(author => author.name).join("; ") 
                          : "Sin autores"}
                      </td>
                    </>
                  )}
                  {(chapter.getHosts() && chapter.getHosts()!.length > 0) && (
                    <>
                      <td>{"Sin narrador"}</td>
                      <td>
                        {chapter.getHosts() && chapter.getHosts()!.length > 0 
                          ? "Sin autores" 
                          : "Sin autores"} 
                        //ASK ??????????????????????????????????????????????''''
                      </td>
                    </>
                  )}
                  <td>{chapter.durationInSeconds}</td>
                  <td>{chapter.languageRef?.name}</td>
                  <td>{chapter.description}</td>
                  <td>
                    <Button variant="warning" onClick={() => handleEditChapter(chapter)}>Editar</Button>{' '}
                    <Button variant="danger" onClick={() => handleDeleteModal(chapter)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        }
  
        {/* Modal para añadir o editar usuario */}
        <ChapterDataModal
          show={showChapterModal}
          handleClose={() => setShowChapterModal(false)}
          handleSave={(chapter) => {handleSave(chapter);}}
          initialData={selectedChapter}
        />

        {/* Modal para solicitar confirmacion al borrar un usuario */}
        <ConfirmationModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          handleSubmit={() => {
            handleDeleteUser(selectedChapter.id ? selectedChapter!.id! : "0");
            setShowDeleteModal(false);
          }}
          question='¿Esta seguro que desea borrar el usuario?'
          submitButtonText='Borrar'
          submitButtonVariant='danger'
          cancelButtonText='Cancelar'
          cancelButtonVariant='secondary'
          moreInfo={selectedChapter.name}
          size={undefined}
        />
      </div>
    );
  };
  
  export default ChaptersPage;