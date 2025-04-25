import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, FormLabel } from 'react-bootstrap';
import { Field, Form, Formik, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Collection } from '../../entities/collectionEntity.ts';
import { Category } from '../../entities/categoryEntity.ts';
import { CategoryRepository } from '../../repositories/CategoryRepository.ts';

interface EditModalProps {
    show: boolean;
    handleClose: () => void;
    handleSave: (collection: Collection | Partial<Collection>) => void;
    initialData: Collection;
}

export const CollectionDataModal : React.FC<EditModalProps> = ({show, handleClose, handleSave, initialData}) => {
    //Collections data
    const [categories, setCategories] = useState<Category[]>([]);
    
    useEffect(() => {
        fetching();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData]);

    async function fetching() {
        fetchCategories();
    }

    async function fetchCategories() {
        setCategories(await CategoryRepository.GetAll());
    }

    function handleSubmit(
        formData: {
            categories: string[];
            id?: string;
            name: string;
            description: string;
            categoriesRef: Category[];
        }
    ) {
        if (initialData.id) {
            const updateFields: any = {};
            updateFields.id = initialData.id;
            if (formData.name != initialData.name) updateFields.name = formData.name;
            if (formData.description != initialData.description) updateFields.description = formData.description;

            //Si cambia el tamaño del array o su contenido, actualizo la propiedad "Subscriptions"
            //Logica para revisar cambios en el array de "Categorias".
            let isDifferent = formData.categories.length != initialData.categoriesRef.length;
            const categoriesToAPI = initialData.categoriesRef.map((_category) => _category.id!);
            for (let i=0; i < formData.categories.length && !isDifferent; i++) {
                //"formData.categories" son las categorias traidas desde el modal.
                isDifferent = !(categoriesToAPI.includes(formData.categories[i]));
            }
            if (isDifferent) updateFields.categoriesRef = formData.categories.map((_category) => new Category({_id: _category, name: categories.find((_ctg) => _ctg.id == _category)!.name}));
            handleSave(updateFields);
        } else {
            const newCollection = new Collection();
            newCollection.name = formData.name;
            newCollection.description = formData.description;
            newCollection.categoriesRef = formData.categories.map((_category) => new Category({_id: _category, name: categories.find((_ctg) => _ctg.id == _category)!.name}));
            handleSave(newCollection);
        }
        handleClose();
    }

    //Textos para las validaciones.
    const required = "Valor requerido";

    return (
        <Modal show={show} onHide={() => {handleClose()}} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title>{initialData.id ? 'Editar Coleccion' : 'Agregar Coleccion'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Formik
                initialValues= { initialData ? {...initialData, categories: initialData.categoriesRef.map((_catg) => _catg.id!)} : {...(new Collection()), categories: [],} }
                onSubmit={handleSubmit}
                validationSchema= {
                    Yup.object().shape({
                        name: Yup.string().required(required),
                        description: Yup.string().required(required),
                        categories: Yup.array().of(Yup.string().notOneOf(["0"], required)).min(1, "Debe tener al menos 1 categoria"),
                    })
                }
            >
            {({values, errors}) => (
                <Form>
                    <div className="form-group mb-3">
                        <FormLabel htmlFor="username">Nombre de la coleccion</FormLabel>
                        <Field className="form-control"
                            id='name'
                            name="name"
                            type="text"
                            placeholder="Ingrese un nombre"
                        />
                        <ErrorMessage className='text-danger' name="name" component="div" />
                    </div>
                    <div className="form-group mb-3">
                        <FormLabel htmlFor="description">Descripcion</FormLabel>
                        <Field className="form-control"
                            id='description'
                            name="description"
                            type="text"
                            placeholder="Ingrese una breve descripcion de la coleccion"
                        />
                        <ErrorMessage className='text-danger' name="description" component="div" />
                    </div>
                    <div className="form-group mb-3">
                        <FormLabel htmlFor='categories'>Categorias</FormLabel>
                        <Table bordered hover>
                            <thead>
                                <tr>
                                    <th>Categoria</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody className='text-center'>
                                <FieldArray
                                name="categories"
                                render={ arrayHelpers => (
                                <> {values.categories?.map((_category, index) => {
                                    const fieldName = `categories[${index}]`;

                                    return (
                                        <tr>
                                            <td>
                                                <Field className="form-select"
                                                component="select"
                                                name={`${fieldName}`}
                                                multiple={false}
                                                >
                                                    <option value={"0"}>Seleccione una categoria</option>
                                                    {categories.map((_categoryList) => (
                                                        <option value={_categoryList.id}>{_categoryList.name}</option>
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
                                            onClick={() => arrayHelpers.push("0")}
                                            >
                                                Agregar Categoria
                                            </button>
                                        </td>
                                    </tr>
                                </>)}
                                />
                            </tbody>
                        </Table>
                        {typeof(errors.categories) == 'string' ? <ErrorMessage className='text-danger' name="categories" component="div" /> : undefined}
                    </div>
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