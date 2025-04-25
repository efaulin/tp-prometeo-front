import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, FormLabel } from 'react-bootstrap';
import { Field, Form, Formik, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DatePickerFormik } from '../dataPickerFormik.tsx';
import { Language } from '../../entities/languageEntity.ts';
import { Narrator } from '../../entities/narratorEntity.ts';
import { Author } from '../../entities/authorEntity.ts';
import { Host } from '../../entities/hostEntity.ts';
import { Collection } from '../../entities/collectionEntity.ts';
import { Chapter } from '../../entities/chapterEntity.ts';
import { LanguageRepository } from '../../repositories/LanguageRepository.ts';
import { NarratorRepository } from '../../repositories/NarratorRepository.ts';
import { AuthorRepository } from '../../repositories/AuthorRepository.ts';
import { HostRepository } from '../../repositories/HostRepository.ts';
import { CollectionRepository } from '../../repositories/CollectionRepository.ts';

interface EditModalProps {
    show: boolean;
    handleClose: () => void;
    handleSave: (chapter: Chapter | Partial<Chapter>) => void;
    initialData: Chapter;
}

export const ChapterDataModal : React.FC<EditModalProps> = ({show, handleClose, handleSave, initialData}) => {
    //Collections data
    const [languages, setLanguages] = useState<Language[]>([]);
    const [narrators, setNarrators] = useState<Narrator[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [hosts, setHosts] = useState<Host[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    //Variables de control
    const [isAudiobook, setIsAudiobook] = useState(true);
    
    useEffect(() => {
        if (initialData.isPodcast()) setIsAudiobook(false);
        fetching();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData]);

    async function fetching() {
        fetchLanguages();
        fetchNarrators();
        fetchAuthors();
        fetchHosts();
        fetchCollections();
    }

    async function fetchLanguages() {
        setLanguages(await LanguageRepository.GetAll());
    }

    async function fetchNarrators() {
        setNarrators(await NarratorRepository.GetAll());
    }

    async function fetchAuthors() {
        setAuthors(await AuthorRepository.GetAll());
    }

    async function fetchHosts() {
        setHosts(await HostRepository.GetAll());
    }

    async function fetchCollections() {
        setCollections(await CollectionRepository.GetAll());
    }

    function handleChangeType(values: any) {
        if (isAudiobook) {
            values.authors = undefined;
            values.narrator = "";
            values.hosts = [];
        } else {
            values.hosts = undefined;
            values.authors = [];
        }

        setIsAudiobook(!isAudiobook);
    }

    function handleSubmit(
        formData: {
            language: string;
            hosts: string[] | undefined;
            authors: string[] | undefined;
            narrator: string;
            id?: string;
            name: string;
            collectionId: string;
            durationInSeconds: number;
            description: string;
            uploadDate: Date;
            publicationDate: Date;
            languageRef: Language | null;
        }
    ) {
        //TODO Revisar si se puede hacer una solucion mas simple utilizando la propiedad "touched" de formik.
        // if (initialData.id) {
        //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //     const updateFields: any = {};
        //     updateFields.id = initialData.id;
        //     if (formData.username != initialData.username) updateFields.username = formData.username;
        //     if (formData.password != initialData.password) updateFields.password = formData.password;
        //     if (formData.email != initialData.email) updateFields.email = formData.email;
        //     if (formData.role != initialData.role?.id) updateFields.role = roles.find((_role) => _role.id == formData.role);
        //     //Si cambia el tamaño de los arrays o su contenido, actualizo la propiedad "Subscriptions"
        //     if (formData.subscriptions.length != initialData.subscriptions.length) {
        //         updateFields.subscriptions = formData.subscriptions.map((_usrScr, i) => new UserSubscription({startDate: formData.subscriptions[i].startDate.toISOString(), endDate: formData.subscriptions[i].endDate.toISOString(), subscriptionRef: {_id: formData.subscriptions[i].subscription, type: subscriptionsTypes.find((_scrp) => _scrp.id == formData.subscriptions[i].subscription)!.type}}));
        //     } else {
        //         //Logica para revisar cambios en el array de "Subscripciones".
        //         let isDifferent = false;
        //         for (let i=0; i < formData.subscriptions.length && !isDifferent; i++) {
        //             //"formData.subscriptions" son las subscripciones que ingresa/modifica el usuario en el modal.
        //             const formDataScrp = {startDate: formData.subscriptions[i].startDate.toISOString(), endDate: formData.subscriptions[i].endDate.toISOString(), subscriptionRef: formData.subscriptions[i].subscription};
        //             let wasFound = false;
        //             //Por cada UsuarioSuscripcion de "formData.subscriptions" reviso este contenida en "initialData.subscriptions".
        //             for (let z=0; z < initialData.subscriptions.length && !wasFound; z++) {
        //                 //"initialData.subscriptions" son las subscripciones del usuario sin modificar.
        //                 const initialDataScrp = initialData.subscriptions[z].toAPI();
        //                 wasFound = initialDataScrp.startDate == formDataScrp.startDate && initialDataScrp.endDate == formDataScrp.endDate && initialDataScrp.subscriptionRef == formDataScrp.subscriptionRef;
        //             }
        //             if (!wasFound) isDifferent = true;
        //         }
        //         if (isDifferent) updateFields.subscriptions = formData.subscriptions.map((_usrScr, i) => new UserSubscription({startDate: formData.subscriptions[i].startDate.toISOString(), endDate: formData.subscriptions[i].endDate.toISOString(), subscriptionRef: {_id: formData.subscriptions[i].subscription, type: subscriptionsTypes.find((_scrp) => _scrp.id == formData.subscriptions[i].subscription)!.type}}));
        //     }
        //     handleSave(updateFields);
        // } else {
        //     const newUser = new User();
        //     newUser.username = formData.username;
        //     newUser.password = formData.password;
        //     newUser.email = formData.email;
        //     newUser.role = roles.find((_role) => _role.id == formData.role)!;
        //     newUser.subscriptions = formData.subscriptions.map((_usrScr, i) => new UserSubscription({startDate: formData.subscriptions[i].startDate.toISOString(), endDate: formData.subscriptions[i].endDate.toISOString(), subscriptionRef: {_id: formData.subscriptions[i].subscription, type: subscriptionsTypes.find((_scrp) => _scrp.id == formData.subscriptions[i].subscription)!.type}}));
        //     handleSave(newUser);
        // }
        // handleClose();
    }

    //Textos para las validaciones.
    const required = "Valor requerido";

    return (
        <Modal show={show} onHide={() => {handleClose()}} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title>{initialData.id ? 'Editar Capitulo' : 'Agregar Capitulo'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Formik
                initialValues= { initialData ? {...initialData, language: initialData.languageRef?.id!, hosts: initialData.getHosts()?.map((_host) => _host.id!), authors: initialData.getAuthors()?.map((_author) => _author.id!), narrator: initialData.getNarrator()?.id!} : {...(new Chapter()), language: "", hosts: [], authors: [], narrator: ""} }
                onSubmit={handleSubmit}
                validationSchema= {
                    Yup.object().shape({
                        name: Yup.string().required(required),
                        collectionId: Yup.string().required(required).notOneOf(["0"], required),
                        description: Yup.string().required(required),
                        publicationDate: Yup.date().required(required),
                        language: Yup.string().required(required).notOneOf(["0"], required),
                        
                        narrator: Yup.string().notOneOf(["0"], required),
                        authors: Yup.array().of(Yup.string().notOneOf(["0"], required)).min(1, "Debe tener al menos 1 autor"),
                        hosts: Yup.array().of(Yup.string().notOneOf(["0"], required)).min(1, "Debe tener al menos 1 conductor"),
                    })
                }
            >
            {({values, errors}) => (
                <Form>
                    <div className="form-group mb-3">
                        <FormLabel htmlFor="username">Nombre del capitulo</FormLabel>
                        <Field className="form-control"
                            id='name'
                            name="name"
                            type="text"
                            placeholder="Ingrese un nombre"
                        />
                        <ErrorMessage className='text-danger' name="name" component="div" />
                    </div>
                    {/* //TODO UI/UX Estaria bueno que se pueda ir ingresando texto para filtrar, ya que en un plan ideal habria muchisimas collecciones como para mostrarlas en una lista. */}
                    <div className="form-group mb-3">
                        <FormLabel htmlFor='collectionId'>Colleccion</FormLabel>
                        <Field className="form-select"
                        component="select"
                        id="collectionId"
                        name="collectionId"
                        multiple={false}
                        >
                            <option value={"0"}>Seleccione una coleccion</option>
                            {collections.map((col) => (
                                <option value={col.id}>{col.name}</option>
                            ))}
                        </Field>
                        <ErrorMessage className='text-danger' name="collectionId" component="div" />
                    </div>
                    <div className="form-group mb-3">
                        <FormLabel htmlFor="description">Descripcion</FormLabel>
                        <Field className="form-control"
                            id='description'
                            name="description"
                            type="text"
                            placeholder="Ingrese una breve descripcion del capitulo"
                        />
                        <ErrorMessage className='text-danger' name="description" component="div" />
                    </div>
                    <div className="form-group mb-3">
                        <FormLabel htmlFor="publicationDate">Fecha de publicacion</FormLabel><br/>
                        <Field className="form-control"
                            name="publicationDate"
                            component={DatePickerFormik}
                        />
                        <ErrorMessage className='text-danger' name="publicationDate" component="div" />
                    </div>
                    <div className="form-group mb-3">
                        <FormLabel htmlFor='language'>Idioma del capitulo</FormLabel>
                        <Field className="form-select"
                        component="select"
                        id="language"
                        name="language"
                        multiple={false}
                        >
                            <option value={"0"}>Seleccione un idioma</option>
                            {languages.map((lang) => (
                                <option value={lang.id}>{lang.name}</option>
                            ))}
                        </Field>
                        <ErrorMessage className='text-danger' name="language" component="div" />
                    </div>

                    <div className="form-group mb-3">
                        <FormLabel>Formato: <strong>{isAudiobook ? "AudioLibro" : "Podcast"}</strong></FormLabel>
                        <button className='btn btn-sm btn-secondary ms-1'
                        type='button'
                        onClick={() => handleChangeType(values)}
                        >
                            <i className="bi bi-arrow-left-right"></i>
                        </button>
                    </div>
                    
                    <div className='form-group border border-dark mb-3 p-2'>
                        {isAudiobook ? //Si es Audiolibro
                        <>
                            {/* //TODO UI/UX Estaria bueno que se pueda ir ingresando texto para filtrar, ya que en un plan ideal habria muchisimas collecciones como para mostrarlas en una lista. */}
                            <div className="form-group mb-3">
                                <FormLabel htmlFor='collectionId'>Narrador</FormLabel>
                                <Field className="form-select"
                                component="select"
                                id="narrator"
                                name="narrator"
                                multiple={false}
                                >
                                    <option value={"0"}>Seleccione un narrador</option>
                                    {narrators.map((_narrator) => (
                                        <option value={_narrator.id}>{_narrator.name}</option>
                                    ))}
                                </Field>
                                <ErrorMessage className='text-danger' name="narrator" component="div" />
                            </div>
                            <div className="form-group mb-3">
                                <FormLabel htmlFor='authors'>Autores del libro</FormLabel>
                                <Table bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Autor</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-center'>
                                        <FieldArray
                                        name="authors"
                                        render={ arrayHelpers => (
                                        <> {values.authors?.map((_author, index) => {
                                            const fieldName = `authors[${index}]`;

                                            return (
                                                <tr>
                                                    <td>
                                                        <Field className="form-select"
                                                        component="select"
                                                        name={`${fieldName}`}
                                                        multiple={false}
                                                        >
                                                            <option value={"0"}>Seleccione un autor</option>
                                                            {authors.map((_authorList) => (
                                                                <option value={_authorList.id}>{_authorList.name}</option>
                                                            ))}
                                                        </Field>
                                                        <ErrorMessage className='text-danger' name={`${fieldName}`} component="div" />
                                                    </td>
                                                    <td>
                                                        <button className='btn btn-danger' type="button" onClick={() => arrayHelpers.remove(index)}>
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                            <tr className='text-left'>
                                                <td colSpan={4}>
                                                    <button className='btn btn-sm btn-success'
                                                    type="button"
                                                    onClick={() => arrayHelpers.push("")}
                                                    >
                                                        Agregar Autor
                                                    </button>
                                                </td>
                                            </tr>
                                        </>)}
                                        />
                                    </tbody>
                                </Table>
                                {typeof(errors.authors) == 'string' ? <ErrorMessage className='text-danger' name="authors" component="div" /> : undefined}
                            </div>
                        </>
                        : //Si es Podcast
                        <>
                            <div className="form-group mb-3">
                                <FormLabel htmlFor='hosts'>Conductores del podcast</FormLabel>
                                <Table bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Conductor</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-center'>
                                        <FieldArray
                                        name="hosts"
                                        render={ arrayHelpers => (
                                        <> {values.hosts?.map((_host, index) => {
                                            const fieldName = `hosts[${index}]`;

                                            return (
                                                <tr>
                                                    <td>
                                                        <Field className="form-select"
                                                        component="select"
                                                        name={`${fieldName}`}
                                                        multiple={false}
                                                        >
                                                            <option value={"0"}>Seleccione un conductor</option>
                                                            {hosts.map((_hostList) => (
                                                                <option value={_hostList.id}>{_hostList.name}</option>
                                                            ))}
                                                        </Field>
                                                        <ErrorMessage className='text-danger' name={`${fieldName}`} component="div" />
                                                    </td>
                                                    <td>
                                                        <button className='btn btn-danger' type="button" onClick={() => arrayHelpers.remove(index)}>
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                            <tr className='text-left'>
                                                <td colSpan={4}>
                                                    <button className='btn btn-sm btn-success'
                                                    type="button"
                                                    onClick={() => arrayHelpers.push("")}
                                                    >
                                                        Agregar Conductor
                                                    </button>
                                                </td>
                                            </tr>
                                        </>)}
                                        />
                                    </tbody>
                                </Table>
                                {typeof(errors.hosts) == 'string' ? <ErrorMessage className='text-danger' name="hosts" component="div" /> : undefined}
                            </div>
                        </>
                        }
                    </div>

                    {/*
                    //No se ingresan, pero muestro
                    //*durationInSeconds
                    //*uploadDate
                    */}
                    <br/>
                    <div className='text-center'>
                        <Button className="mx-auto" variant="primary" type="submit">
                            {initialData.id ? 'Guardar cambios' : 'Agregar'}
                        </Button>
                    </div>
                </Form>
            )}
            </Formik>
          </Modal.Body>
        </Modal>
    );
}