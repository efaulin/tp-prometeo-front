import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { Language } from '../entities/languageEntity';
import toast from 'react-hot-toast';
import { LanguageRepository } from '../repositories/LanguageRepository';
import { LanguageDataModal } from '../components/modals/languageModal';
import { ConfirmationModal } from '../components/confirmationModal';

const LanguagesPage: React.FC = () => {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(new Language());
    //Debuggin
    let doubleToastControl = false;
    //Variables para el manejo de aparacion de otros componentes
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
      if (!doubleToastControl) fetchLanguages();
    }, []);
  
    const fetchLanguages = () => {
      doubleToastControl = true;
      setShowLoading(true);
      toast.promise(
        LanguageRepository.GetAll().then((languages) => {setLanguages(languages); doubleToastControl = false;}, (error) => {console.log(error); toast.error("Hubo un error: " + error.toString()); setLanguages([])}).finally(() => {setShowLoading(false)}),
        {
          loading: 'Adquiriendo idiomas...',
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

    const handleAddLanguage= () => {
      setSelectedLanguage(new Language()); // Limpiar selección para añadir
      setShowLanguageModal(true);
    };
  
    const handleEditLanguage = (language: Language) => {
        setSelectedLanguage(language); // Seleccionar usuario para editar
        setShowLanguageModal(true);
    };

    const handleDeleteModal = (language: Language)=>{
      setSelectedLanguage(language);
      setShowDeleteModal(true);
    }

    const handleDeleteLanguage = async (languageId: string) => {
      toast.promise(
        LanguageRepository.Delete(languageId).then(fetchLanguages, (error) => {console.log(error);}),
        {
          loading: 'Borrando...',
          success: <b>¡Idioma borrado!</b>,
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
  
    const handleSave = async (language: Language) => {
      if (language.id) {
        toast.promise(
          LanguageRepository.Update(language).then(fetchLanguages, (error) => {console.log(error);}),
          {
            loading: 'Guardando...',
            success: <b>¡Idioma modificado!</b>,
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
          LanguageRepository.Create(language as Language).then(fetchLanguages, (error) => {console.log(error);}),
          {
            loading: 'Guardando...',
            success: <b>¡Idioma creado!</b>,
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
        <h2>Idiomas</h2>
        <Button onClick={handleAddLanguage}>Agregar idioma</Button>
        {
          showLoading ?
          //showLoading = TRUE
          <div className='text-center'><h3>Cargando...</h3></div>
          ://showLoading = FALSE
          <Table className='my-3' striped bordered hover>
            <thead>
              <tr>
                <th>Idiomas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {languages.map((language) => (
                <tr key={language.id}>
                  <td>{language.name}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleEditLanguage(language)}><i className="bi bi-pencil-fill"></i></Button>{' '}
                    <Button variant="danger" onClick={() => handleDeleteModal(language)}><i className="bi bi-trash-fill"></i></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        }
  
        {/* Modal para añadir o editar usuario */}
        <LanguageDataModal
          show={showLanguageModal}
          handleClose={() => setShowLanguageModal(false)}
          handleSave={(language) => {handleSave(language);}}
          initialData={selectedLanguage}
        />

        {/* Modal para solicitar confirmacion al borrar un usuario */}
        <ConfirmationModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          handleSubmit={() => {
            handleDeleteLanguage(selectedLanguage.id ? selectedLanguage!.id! : "0");
            setShowDeleteModal(false);
          }}
          question='¿Esta seguro que desea borrar este idioma?'
          submitButtonText='Borrar'
          submitButtonVariant='danger'
          cancelButtonText='Cancelar'
          cancelButtonVariant='secondary'
          moreInfo={selectedLanguage.name}
          size={undefined}
        />
      </div>
    );
  };
  
  export default LanguagesPage;