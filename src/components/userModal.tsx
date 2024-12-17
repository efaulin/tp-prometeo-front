import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { User } from '../entities/userEntity.ts';
import { Role } from '../entities/roleEntity.ts';
import { UserRepository } from '../repositories/UserRepository.ts';
import { RoleRepository } from '../repositories/RoleRepository.ts';
import { Suscription } from '../entities/suscriptionEntity.ts';
import { SuscriptionRepository } from '../repositories/SuscriptionRepository.ts';

interface EditModalProps {
    show: boolean;
    handleClose: () => void;
    handleSave: (user: User) => void;
    initialData?: User | null;
}

export const UserDataModal : React.FC<EditModalProps> = ({show, handleClose, handleSave, initialData}) => {
    //Modal data
    const [formData, setFormData] = useState<User>(new User());
    const [userRoleData, setUserRoleData] = useState<Role>(new Role());
    //Collections data
    const [roles, setRoles] = useState<Role[]>([]);
    const [subscriptions, setSubscriptions] = useState<Suscription[]>([]);

    useEffect(() => {
        fetchRoles();
        fetchSubscriptions();
        if (initialData) {
            setFormData(initialData);
            setUserRoleData(initialData.role!);
        } else {
            setFormData(new User());
            setUserRoleData(new Role());
        }
    }, [initialData]);

    async function fetchRoles() {
        setRoles(await RoleRepository.GetAll());
    }

    async function fetchSubscriptions() {
        setSubscriptions(await SuscriptionRepository.GetAll());
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value} as User);
    }

    function handleRoleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { value } = e.target;
        setFormData({...formData, role: roles.find(role => role.id == value)} as User);
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
                        {formData.suscripcions.map((sub, index) => (
                        <tr key={index}>
                            <td>
                            <Form.Select
                                value={sub.suscripcion?.type}
                                onChange={(e) =>
                                handleChange(index, "type", e.target.value)
                                }
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
                                type="date"
                                value={sub.startDate.toTimeString()}
                                onChange={(e) =>
                                handleChange(index, "startDate", e.target.value)
                                }
                            />
                            </td>
                            <td>
                            <Form.Control
                                type="date"
                                value={sub.endDate.toTimeString()}
                                onChange={(e) =>
                                handleChange(index, "endDate", e.target.value)
                                }
                            />
                            </td>
                            <td>
                            <Button
                                variant="danger"
                                onClick={() => handleDeleteRow(index)}
                            >
                                Eliminar
                            </Button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </Table>
                    <Button variant="success" onClick={handleAddRow}>
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