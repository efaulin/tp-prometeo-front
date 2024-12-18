import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { User } from '../entities/userEntity';
import { Role } from '../entities/roleEntity';
import { UserRepository } from '../repositories/UserRepository';
import { RoleRepository } from '../repositories/RoleRepository';
import { Subscription } from '../entities/subscriptionEntity';
import { SubscriptionRepository } from '../repositories/SuscriptionRepository';
import { SubscriptionPriceRepository } from '../repositories/SubscriptionPriceRepository';

interface EditModalProps {
    show: boolean;
    handleClose: () => void;
    handleSave: (user: User) => void;
    initialData?: User | null;
}

export const UserDataModal : React.FC<EditModalProps> = ({show, handleClose, handleSave, initialData}) => {
    //Modal data
    const [formData, setFormData] = useState<User>(new User()); //Objeto a pasar al padre, contiene todos los datos y se usa para el manejo de datos primitivos
    const [userRoleData, setUserRoleData] = useState<Role>(new Role());
    //Collections data
    const [roles, setRoles] = useState<Role[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

    useEffect(() => {
        fetching().then(function () {
            if (initialData) {
                setFormData(initialData);
                setUserRoleData(initialData.role!);
            } else {
                setFormData(new User());
                setUserRoleData(new Role());
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

    function handleRoleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
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
        //formData.subscriptions[index]
    }

    function handleSubscriptionAdd() {
        //¯\_(ツ)_/¯
    }

    function handleSubmit() {
        handleSave(formData);
        handleClose();
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{initialData ? 'Editar Usuario' : 'Agregar Usuario'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Nombre de usuario</Form.Label>
                <Form.Control
                  required
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                />
              </Form.Group>
                <Form.Group controlId="formPass">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                    required
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                    required
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="formRole">
                    <Form.Label>Tipo de usuario</Form.Label>
                    <Form.Control
                        required
                        name="role"
                        value={formData.role!.id!}
                        onChange={handleRoleChange}
                    />
                    <Form.Select aria-label="Seleccione rol del usuario">
                        {roles.map((role) => (
                            <option value={role.id}>{role.name}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <br/>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Tipo de Suscripción</th>
                            <th>Fecha de Inicio</th>
                            <th>Fecha de Fin</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        //TODO Probar todo
                        //TODO Como manejo los cambios en suscripciones
                        {formData.subscriptions.map((sub, index) => (
                        <tr key={index}>
                            <td>
                            <Form.Select
                                value={sub.subscription!.id!}
                                onChange={(e) => handleSubscriptionChange(index, e)}
                            >
                                <option value="">Seleccionar</option>
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
                                value={sub.startDate.toTimeString()}
                                onChange={(e) => handleDateChange(index, e)}
                            />
                            </td>
                            <td>
                            <Form.Control
                                type="date"
                                value={sub.endDate.toTimeString()}
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
                    </tbody>
                    </Table>
                    <Button variant="success" onClick={handleSubscriptionAdd}>
                        Agregar Suscripción
                    </Button>
                <br/>
                <Button variant="primary" type="submit">
                    {initialData ? 'Guardar cambios' : 'Agregar'}
                </Button>
            </Form>
          </Modal.Body>
        </Modal>
    );
}