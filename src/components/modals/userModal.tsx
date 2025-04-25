import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, FormLabel } from 'react-bootstrap';
import { User, UserSubscription } from '../../entities/userEntity.ts';
import { Role } from '../../entities/roleEntity.ts';
import { RoleRepository } from '../../repositories/RoleRepository.ts';
import { Subscription } from '../../entities/subscriptionEntity.ts';
import { SubscriptionRepository } from '../../repositories/SuscriptionRepository.ts';
import { Field, Form, Formik, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DatePickerFormik } from '../dataPickerFormik.tsx';

interface EditModalProps {
    show: boolean;
    handleClose: () => void;
    handleSave: (user: User | Partial<User>) => void;
    initialData: User;
}

export const UserDataModal : React.FC<EditModalProps> = ({show, handleClose, handleSave, initialData}) => {
    //Collections data
    const [roles, setRoles] = useState<Role[]>([]);
    const [subscriptionsTypes, setSubscriptions] = useState<Subscription[]>([]);

    useEffect(() => {
        fetching();
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

    function handleSubmit(
        formData: {
            role: string | undefined;
            subscriptions: {
                subscription: string | undefined;
                startDate: Date;
                endDate: Date;
            }[];
            id?: string;
            username: string;
            password: string;
            email: string;
        }
    ) {
        //TODO Revisar si se puede hacer una solucion mas simple utilizando la propiedad "touched" de formik.
        if (initialData.id) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const updateFields: any = {};
            updateFields.id = initialData.id;
            if (formData.username != initialData.username) updateFields.username = formData.username;
            if (formData.password != initialData.password) updateFields.password = formData.password;
            if (formData.email != initialData.email) updateFields.email = formData.email;
            if (formData.role != initialData.role?.id) updateFields.role = roles.find((_role) => _role.id == formData.role);
            //Si cambia el tamaño de los arrays o su contenido, actualizo la propiedad "Subscriptions"
            if (formData.subscriptions.length != initialData.subscriptions.length) {
                updateFields.subscriptions = formData.subscriptions.map((_usrScr, i) => new UserSubscription({startDate: formData.subscriptions[i].startDate.toISOString(), endDate: formData.subscriptions[i].endDate.toISOString(), subscriptionRef: {_id: formData.subscriptions[i].subscription, type: subscriptionsTypes.find((_scrp) => _scrp.id == formData.subscriptions[i].subscription)!.type}}));
            } else {
                //Logica para revisar cambios en el array de "Subscripciones".
                let isDifferent = false;
                for (let i=0; i < formData.subscriptions.length && !isDifferent; i++) {
                    //"formData.subscriptions" son las subscripciones que ingresa/modifica el usuario en el modal.
                    const formDataScrp = {startDate: formData.subscriptions[i].startDate.toISOString(), endDate: formData.subscriptions[i].endDate.toISOString(), subscriptionRef: formData.subscriptions[i].subscription};
                    let wasFound = false;
                    //Por cada UsuarioSuscripcion de "formData.subscriptions" reviso este contenida en "initialData.subscriptions".
                    for (let z=0; z < initialData.subscriptions.length && !wasFound; z++) {
                        //"initialData.subscriptions" son las subscripciones del usuario sin modificar.
                        const initialDataScrp = initialData.subscriptions[z].toAPI();
                        wasFound = initialDataScrp.startDate == formDataScrp.startDate && initialDataScrp.endDate == formDataScrp.endDate && initialDataScrp.subscriptionRef == formDataScrp.subscriptionRef;
                    }
                    if (!wasFound) isDifferent = true;
                }
                if (isDifferent) updateFields.subscriptions = formData.subscriptions.map((_usrScr, i) => new UserSubscription({startDate: formData.subscriptions[i].startDate.toISOString(), endDate: formData.subscriptions[i].endDate.toISOString(), subscriptionRef: {_id: formData.subscriptions[i].subscription, type: subscriptionsTypes.find((_scrp) => _scrp.id == formData.subscriptions[i].subscription)!.type}}));
            }
            handleSave(updateFields);
        } else {
            const newUser = new User();
            newUser.username = formData.username;
            newUser.password = formData.password;
            newUser.email = formData.email;
            newUser.role = roles.find((_role) => _role.id == formData.role)!;
            newUser.subscriptions = formData.subscriptions.map((_usrScr, i) => new UserSubscription({startDate: formData.subscriptions[i].startDate.toISOString(), endDate: formData.subscriptions[i].endDate.toISOString(), subscriptionRef: {_id: formData.subscriptions[i].subscription, type: subscriptionsTypes.find((_scrp) => _scrp.id == formData.subscriptions[i].subscription)!.type}}));
            handleSave(newUser);
        }
        handleClose();
    }

    //Textos para las validaciones.
    const required = "Valor requerido";
    const oneDayMore = "La fecha de finalización debe ser posterior a la fecha de inicio";

    return (
        <Modal show={show} onHide={() => {handleClose()}} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title>{initialData.id ? 'Editar Usuario' : 'Agregar Usuario'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Formik
                initialValues= { initialData ? {...initialData, role: initialData.role?.id, subscriptions: initialData.subscriptions.map((usrSpc) => { return {...usrSpc, subscription: usrSpc.subscription?.id} })} : {...(new User()), role:"0", subscriptions: []} }
                onSubmit={handleSubmit}
                validationSchema= {
                    Yup.object().shape({
                        username: Yup.string().required(required),
                        password: Yup.string().required(required),
                        email: Yup.string().required(required).email("Ingrese un email valido"),
                        role: Yup.string().required(required).notOneOf(["0"], required),
                        subscriptions: Yup.array().of(
                            Yup.object({
                                subscription: Yup.string().required(required).notOneOf(["0"], required),
                                startDate: Yup.date().required(required),
                                endDate: Yup.date().required(required)
                                    .test("min-date", oneDayMore, function (endDate) {
                                        const startDate = this.parent.startDate;
                                        //Verifica que endDate sea mayor a startDate. (no se usa ".min" porque permite que sea igual)
                                        return endDate > startDate;
                                    }),
                            }),
                        ).min(1, "Debe tener al menos una subscripcion"),
                    })
                }
            >
            {({values, errors}) => (
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
                                                name={`${fieldName}.subscription`}
                                                multiple={false}
                                                >
                                                    <option value={"0"}>Seleccione un valor</option>
                                                    {subscriptionsTypes.map((subType) => (
                                                        <option value={subType.id}>{subType.type}</option>
                                                    ))}
                                                </Field>
                                                <ErrorMessage className='text-danger' name={`${fieldName}.subscription`} component="div" />
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
                                            onClick={() => arrayHelpers.push({ subscription: "0", startDate: new Date, endDate: new Date })}
                                            >
                                                Agregar Suscripción
                                            </button>
                                        </td>
                                    </tr>
                                </>)}
                                />
                            </tbody>
                        </Table>
                        {typeof(errors.subscriptions) == 'string' ? <ErrorMessage className='text-danger' name="subscriptions" component="div" /> : undefined}
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