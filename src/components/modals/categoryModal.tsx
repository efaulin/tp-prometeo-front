import React from 'react';
import { Modal, Button, FormLabel } from 'react-bootstrap';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Yup from 'yup';
import { Category } from '../../entities/categoryEntity.ts';

interface EditModalProps {
    show: boolean;
    handleClose: () => void;
    handleSave: (category: Category) => void;
    initialData: Category;
}

export const CategoryDataModal : React.FC<EditModalProps> = ({show, handleClose, handleSave, initialData}) => {

    function handleSubmit(formData: Category) {
        handleSave(formData);
        handleClose();
    }

    return (
        <Modal show={show} onHide={() => {handleClose()}} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title>{initialData.id ? 'Editar Idioma' : 'Agregar Idioma'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues= { initialData ? initialData : new Category() }
                    onSubmit={handleSubmit}
                    validationSchema={
                        Yup.object().shape({
                            name: Yup.string().required("Valor requerido"),
                        })
                    }
                >
                {() => (
                    <Form>
                        <div className="form-group mb-3">
                            <FormLabel htmlFor="name">Nombre de la categoria</FormLabel>
                            <Field className="form-control"
                                id='name'
                                name="name"
                                type="text"
                                placeholder="Ingrese la categoria"
                            />
                            <ErrorMessage className='text-danger' name="name" component="div" />
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