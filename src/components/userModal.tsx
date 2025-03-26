import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, FormLabel } from 'react-bootstrap';
import { User, UserSubscription } from '../entities/userEntity';
import { Role } from '../entities/roleEntity';
import { RoleRepository } from '../repositories/RoleRepository';
import { Subscription } from '../entities/subscriptionEntity';
import { SubscriptionRepository } from '../repositories/SuscriptionRepository';
import { Field, useFormik, Form, Formik, FormikHelpers, FormikValues, FormikContext, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

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
        tmpSub[index].subscription = subscriptions.find(sub => sub.id == value)!;
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
                initialValues= { initialData ? {...initialData, role: initialData.role?.id} : {...(new User()), role:"0"} }
                onSubmit={(values, {setSubmitting}) => { console.log(values) }}
                validationSchema= {
                    Yup.object().shape({
                        username: Yup.string().required(required),
                        password: Yup.string().required(required),
                        email: Yup.string().required(required).email("Ingrese un email valido"),
                        role: Yup.string().required(required).notOneOf(["0"], required)
                    })
                }
            >
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
                    <div className="form-group">
                        <FormLabel htmlFor='role'>Tipo de usuario</FormLabel>
                        <Field className="form-control"
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
                    <br/>
                    {/* <Form.Label>Suscripciones</Form.Label>
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
                            {formData.subscriptions.map((sub, index) => (
                            <tr key={index}>
                                <td>
                                <Form.Select
                                    value={sub.subscription?.id}
                                    onChange={(e) => handleSubscriptionChange(index, e)}
                                >
                                    <option value="0">Seleccionar</option>
                                    {subscriptions.map((sbc) => (
                                    <option key={sbc.id} value={sbc.id}>
                                        {sbc.type}
                                    </option>
                                    ))}
                                </Form.Select>
                                </td>
                                <td>
                                <Form.Control
                                    name="startDate"
                                    type="date"
                                    value={sub.startDate.toLocaleDateString('en-CA')}
                                    onChange={(e) => handleDateChange(index, e)}
                                />
                                </td>
                                <td>
                                <Form.Control
                                    name="endDate"
                                    type="date"
                                    value={sub.endDate.toLocaleDateString('en-CA')}
                                    onChange={(e) => handleDateChange(index, e)}
                                />
                                </td>
                                <td>
                                <Button
                                    variant="danger"
                                    onClick={() => handleSubscriptionDelete(index)}
                                >
                                    Eliminar
                                </Button>
                                </td>
                            </tr>
                            ))}
                            <tr className='text-left'>
                                <td colSpan={4}>
                                    <Button className="" size="sm" variant="success" onClick={handleSubscriptionAdd}>
                                        Agregar Suscripción
                                    </Button>
                                </td>
                            </tr>
                        </tbody>
                    </Table> */}
                    <br/>
                    <div className='text-center'>
                        <Button className="mx-auto" variant="primary" type="submit">
                            {initialData.id ? 'Guardar cambios' : 'Agregar'}
                        </Button>
                    </div>
                </Form>
            </Formik>
          </Modal.Body>
        </Modal>
    );
}