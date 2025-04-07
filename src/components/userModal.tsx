import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, FormLabel } from 'react-bootstrap';
import { User, UserSubscription } from '../entities/userEntity';
import { Role } from '../entities/roleEntity';
import { RoleRepository } from '../repositories/RoleRepository';
import { Subscription } from '../entities/subscriptionEntity';
import { SubscriptionRepository } from '../repositories/SuscriptionRepository';
import { Field, useFormik, Form, Formik, FormikHelpers, FormikValues, FormikContext, ErrorMessage, FieldArray, insert } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DatePickerFormik } from './dataPickerFormik.tsx';

interface EditModalProps {
    show: boolean;
    handleClose: () => void;
    handleSave: (user: User | Partial<User>) => void;
    initialData: User;
}

export const UserDataModal : React.FC<EditModalProps> = ({show, handleClose, handleSave, initialData}) => {
    //Modal data
    const [formData, setFormData] = useState<User>(new User()); //Objeto a pasar al padre, contiene todos los datos y se usa para el manejo de datos primitivos
    //Collections data
    const [roles, setRoles] = useState<Role[]>([]);
    const [subscriptionsTypes, setSubscriptions] = useState<Subscription[]>([]);

    useEffect(() => {
        fetching().then(function () {
            if (initialData) {
                //setFormData(initialData);
            } else {
                //setFormData(new User());
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData]);

    async function fetching() {
        fetchRoles();
        fetchSubscriptions();
    }

    async function fetchRoles() {
        setRoles(await RoleRepository.GetAll());
    }

    async function fetchSubscriptions() {
        setSubscriptions(await SubscriptionRepository.GetAll());
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value} as User);
    }

    function handleRoleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const { value } = e.target;
        setFormData({...formData, role: roles.find(role => role.id == value)} as User);
    }

    function handleSubscriptionChange(index:number, e: React.ChangeEvent<HTMLSelectElement>) {
        const { value } = e.target;
        const tmpSub = formData.subscriptions;
        tmpSub[index].subscription = subscriptionsTypes.find(sub => sub.id == value)!;
        setFormData({...formData, subscriptions: tmpSub} as User);
    }

    function handleDateChange(index:number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        const tmpSub = formData.subscriptions;
        if (name == "startDate") {tmpSub[index].startDate = new Date(value)}
        else if (name == "endDate") {tmpSub[index].endDate = new Date(value)}
        else {throw "Error de nombre"};
        setFormData({...formData, subscriptions: tmpSub} as User);
    }

    function handleSubscriptionDelete(index:number) {
        const tmpSub = formData.subscriptions;
        tmpSub.splice(index, 1);
        setFormData({...formData, subscriptions: tmpSub} as User);
    }

    function handleSubscriptionAdd() {
        const tmpSub = formData.subscriptions;
        tmpSub.push(new UserSubscription());
        setFormData({...formData, subscriptions: tmpSub} as User);
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (initialData.id) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const updateFields: any = {};
            updateFields.id = initialData.id;
            if (formData.username != initialData.username) updateFields.username = formData.username;
            if (formData.password != initialData.password) updateFields.password = formData.password;
            if (formData.email != initialData.email) updateFields.email = formData.email;
            if (formData.role?.id != initialData.role?.id) updateFields.role = formData.role;
            //Si cambia el tamaño de los arrays o su contenido, actualizo la propiedad "Subscriptions"
            if (formData.subscriptions.length != initialData.subscriptions.length) {
                updateFields.subscriptions = formData.subscriptions;
            } else {
                //Logica para revisar cambios en el array de "Subscripciones".
                let isDifferent = false;
                for (let i=0; i < formData.subscriptions.length && !isDifferent; i++) {
                    //"formData.subscriptions" son las subscripciones que ingresa/modifica el usuario en el modal.
                    const formDataScrp = formData.subscriptions[i].toAPI();
                    let wasFound = false;
                    //Por cada UsuarioSuscripcion de "formData.subscriptions" reviso este contenida en "initialData.subscriptions".
                    for (let z=0; z < initialData.subscriptions.length && !wasFound; z++) {
                        //"initialData.subscriptions" son las subscripciones del usuario sin modificar.
                        const initialDataScrp = initialData.subscriptions[z].toAPI();
                        wasFound = initialDataScrp.startDate == formDataScrp.startDate && initialDataScrp.endDate == formDataScrp.endDate && initialDataScrp.subscriptionRef == formDataScrp.subscriptionRef;
                    }
                    if (!wasFound) isDifferent = true;
                }
                if (isDifferent) updateFields.subscriptions = formData.subscriptions;
            }
            handleSave(updateFields);
        } else {
            handleSave(formData);
        }
        handleClose();
    }

    const required = "Valor requerido";

    //TODO Realizar las comprobaciones en los inputs, ademas agregar opciones predefinidas para evitar asignaciones nulas.
    return (
        <Modal show={show} onHide={() => {handleClose()}} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title>{initialData.id ? 'Editar Usuario' : 'Agregar Usuario'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Formik
                initialValues= { initialData ? {...initialData, role: initialData.role?.id, subscriptions: initialData.subscriptions.map((usrSpc) => { return {...usrSpc, subscription: usrSpc.subscription?.id} })} : {...(new User()), role:"0"} }
                onSubmit={(values, {setSubmitting}) => { console.log(values) }}
                validationSchema= {
                    Yup.object().shape({
                        username: Yup.string().required(required),
                        password: Yup.string().required(required),
                        email: Yup.string().required(required).email("Ingrese un email valido"),
                        role: Yup.string().required(required).notOneOf(["0"], required),
                        subscriptions: Yup.array().of(
                            Yup.object({
                                subscription: Yup.string().required(required).notOneOf(["0"], required),
                                startDate: Yup.number().required(required),
                                endDate: Yup.number().required(required),
                                //FIXME Problemas
                            }),
                        ).min(1, "Debe tener al menos una subscripcion"),
                    })
                }
            >
            {({values}) => (
                <Form>
                    <div className="form-group mb-3">
                        <FormLabel htmlFor="username">Nombre de usuario</FormLabel>
                        <Field className="form-control"
                            id='username'
                            name="username"
                            type="text"
                            placeholder="Ingrese un nombre de usuario"
                        />
                        <ErrorMessage className='text-danger' name="username" component="div" />
                    </div>
                    <div className="form-group mb-3">
                        <FormLabel htmlFor='password'>Contraseña</FormLabel>
                        <Field className="form-control"
                            id='password'
                            name="password"
                            type="password"
                            placeholder="Ingrese una contraseña"
                        />
                        <ErrorMessage className='text-danger' name="password" component="div" />
                    </div>
                    <div className="form-group mb-3">
                        <FormLabel htmlFor='email'>Email</FormLabel>
                        <Field className="form-control"
                            id='email'
                            name="email"
                            type="email"
                            placeholder="Ingrese un email"
                        />
                        <ErrorMessage className='text-danger' name="email" component="div" />
                    </div>
                    <div className="form-group mb-3">
                        <FormLabel htmlFor='role'>Tipo de usuario</FormLabel>
                        <Field className="form-select"
                        component="select"
                        id="role"
                        name="role"
                        multiple={false}
                        >
                            <option value={"0"}>Seleccione un valor</option>
                            {roles.map((role) => (
                                <option value={role.id}>{role.name}</option>
                            ))}
                        </Field>
                        <ErrorMessage className='text-danger' name="role" component="div" />
                    </div>
                    <div className="form-group mb-3">
                        <FormLabel htmlFor='subscriptions'>Historial de subscripciones</FormLabel>
                        <Table bordered hover>
                            <thead>
                                <tr>
                                    <th>Tipo de Suscripción</th>
                                    <th>Fecha de Inicio</th>
                                    <th>Fecha de Fin</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody className='text-center'>
                                <FieldArray
                                name="subscriptions"
                                render={ arrayHelpers => (
                                <> {values.subscriptions.map((_usrSub, index) => {
                                    const fieldName = `subscriptions[${index}]`;

                                    return (
                                        <tr>
                                            <td>
                                                <Field className="form-select"
                                                component="select"
                                                name={`${fieldName}.id`}
                                                multiple={false}
                                                >
                                                    <option value={"0"}>Seleccione un valor</option>
                                                    {subscriptionsTypes.map((subType) => (
                                                        <option value={subType.id}>{subType.type}</option>
                                                    ))}
                                                </Field>
                                                <ErrorMessage className='text-danger' name={`${fieldName}.name`} component="div" />
                                            </td>
                                            <td>
                                                <Field className="form-control"
                                                name={`${fieldName}.startDate`}
                                                component={DatePickerFormik}
                                                />
                                                <ErrorMessage className='text-danger' name={`${fieldName}.startDate`} component="div" />
                                            </td>
                                            <td>
                                                <Field className="form-control"
                                                name={`${fieldName}.endDate`}
                                                component={DatePickerFormik}
                                                />
                                                <ErrorMessage className='text-danger' name={`${fieldName}.endDate`} component="div" />
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
                                            onClick={() => arrayHelpers.push({ subscription: { id: "0" }, startDate: Date.now(), endDate: Date.now() })}
                                            >
                                                Agregar Suscripción
                                            </button>
                                        </td>
                                    </tr>
                                </>)}
                                />
                            </tbody>
                        </Table>
                        {/* <ErrorMessage className='text-danger' name="subscriptions" component="div" /> */}
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