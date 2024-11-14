import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import axiosInstance from '../utils/axiosInstance';
import { UserInterface, UserSuscriptionInterface } from '../interfaces/userInterface'; 
import { RoleInterface } from '../interfaces/roleInterface';
import NavBar from './Navbar';
import { SuscriptionInterface } from '../interfaces/suscriptionInterface';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<UserInterface[]>([]);
    const [suscriptions, setSuscriptions] = useState<SuscriptionInterface[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);
    const [userRole, setSelectedUserRole] = useState<RoleInterface | null>({_id:"0", name:"tmp"});
    const [userSuscriptions, setSelectedUserSuscriptions] = useState<UserSuscriptionInterface | null>(null);
    const [startDay, setStartDay] = useState<number>(0);
    const [startMonth, setStartMonth] = useState<number>(0);
    const [startYear, setStartYear] = useState<number>(0);
    const [endDay, setEndDay] = useState<number>(0);
    const [endMonth, setEndMonth] = useState<number>(0);
    const [endYear, setEndYear] = useState<number>(0);

    // Obtener usuarios al cargar la página
    useEffect(() => {
      fetchUsers();
      fetchSuscriptions()
    }, []);
  
    const fetchUsers = async () => {
      const response = await axiosInstance.get('/usuario');
      setUsers(response.data);
    };

    const fetchSuscriptions = async () => {
      const response = await axiosInstance.get('/suscripcion');
      setSuscriptions(response.data);
    };

    const handleAddUser = () => {
      setSelectedUser({
        _id: "0",
        username: "",
        email: "",
        role: users[0].role,
        suscripcions: users[0].suscripcions,
      } as UserInterface); // Limpiar selección para añadir
      setShowModal(true);
    };
  
    const handleEditUser = (user: UserInterface) => {
      setSelectedUser(user); // Seleccionar usuario para editar
      setSelectedUserRole(user.role);
      setSelectedUserSuscriptions(user.suscripcions[0]);
      setStartDate(new Date(user.suscripcions[0].startDate));
      setEndDate(new Date(user.suscripcions[0].endDate));
      setShowModal(true);
    };

    function setStartDate(date:Date) {
      setStartDay(date.getDay());
      setStartMonth(date.getMonth());
      setStartYear(date.getFullYear());
    }

    function setEndDate(date:Date) {
      setEndDay(date.getDay());
      setEndMonth(date.getMonth());
      setEndYear(date.getFullYear());
    }
  
    const handleDeleteUser = async (userId: string) => {
      await axiosInstance.delete(`/usuario/${userId}`);
      fetchUsers();
    };
  
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      console.log("startDate: " + startDay + "/" + startMonth + "/" + startYear);
      console.log("endDate: " + endDay + "/" + endMonth + "/" + endYear);
      console.log("newStartDate: " + new Date(startYear, startMonth, startDay).toISOString());
      console.log("newEndDate: " + new Date(endYear, endMonth, endDay).toISOString());
      console.log(selectedUser);
      if (selectedUser!._id != "0") {
        // Editar usuario
        const updUser = {
          username: selectedUser!.username,
          password: selectedUser!.password,
          email: selectedUser!.email,
          role: userRole?._id,
          suscripcions: [
            {
              startDate: new Date(startYear, startMonth, startDay).toISOString(),
              endDate: new Date(endYear, endMonth, endDay).toISOString(),
              suscripcionId: userSuscriptions?.suscripcionId._id,
            }
          ],
        }
        console.log("updUsr: ");
        console.log(updUser);
        const result = await axiosInstance.put(`/usuario/${selectedUser!._id}`, updUser);
        console.log(result);
        fetchUsers();
      } else {
        // Añadir usuario
        const newUser = {
          username: selectedUser!.username,
          password: selectedUser!.password,
          email: selectedUser!.email,
          role: userRole?._id,
          suscripcions: [
            {
              startDate: selectedUser!.suscripcions[0].startDate,
              endDate: selectedUser!.suscripcions[0].endDate,
              suscripcionId: "670c3b7ef2006065e258366c",
            }
          ],
        }
        await axiosInstance.post('/usuario', newUser);
      }
      setShowModal(false);
      fetchUsers();
    };
  
    return (
      <div>
        <NavBar/>
        <h2>Usuarios</h2>
        <Button onClick={handleAddUser}>Agregar Usuario</Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nombre de usuario</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.email}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEditUser(user)}>Editar</Button>{' '}
                  <Button variant="danger" onClick={() => handleDeleteUser(user._id)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
  
        {/* Modal para añadir o editar usuario */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedUser ? 'Editar Usuario' : 'Agregar Usuario'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Nombre de usuario</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={selectedUser?.username || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value } as UserInterface)}
                />
              </Form.Group>
              <Form.Group controlId="formPass">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  required
                  type="password"
                  value={selectedUser?.password || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value } as UserInterface)}
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  value={selectedUser?.email || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value } as UserInterface)}
                />
              </Form.Group>
              <Form.Group controlId="formRole">
                <Form.Label>Tipo de usuario</Form.Label>
                <Form.Select aria-label="Default select example" required onChange={(e) => setSelectedUserRole({ ...setSelectedUserRole, _id: e.target.value } as RoleInterface)}>
                  <option value="673124570945b0b475fe07c8">admin</option>
                  <option value="67327c62f40be4d6fc0933ae">client</option>
                </Form.Select>
              </Form.Group>
              <br/>
              <Form.Group controlId="formSuscripcionId">
                <Form.Label>Suscripcion inicial</Form.Label>
                <Form.Select aria-label="Default select example" required onChange={(e) => setSelectedUserSuscriptions({ ...setSelectedUserSuscriptions, suscripcionId:{_id:e.target.value, type:"xd"}} as UserSuscriptionInterface)}>
                {suscriptions.map((scp) => (
                  <option value={scp._id}>{scp.type}</option>
                ))}
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="formStartDate">
                <Form.Label>Fecha inico</Form.Label>
                <Row>
                  <Col>
                    <Form.Group controlId="formStartDay">
                      <Form.Label>Día</Form.Label>
                      <Form.Control
                        type="number"
                        value={startDay}
                        maxLength={2}
                        placeholder="DD"
                        onChange={(e) => setStartDay(Number.parseInt(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="formStartMonth">
                      <Form.Label>Mes</Form.Label>
                      <Form.Control
                        type="number"
                        value={startMonth}
                        maxLength={2}
                        placeholder="MM"
                        onChange={(e) => setStartMonth(Number.parseInt(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="formStartYear">
                      <Form.Label>Año</Form.Label>
                      <Form.Control
                        type="number"
                        value={startYear}
                        maxLength={4}
                        placeholder="YYYY"
                        onChange={(e) => setStartYear(Number.parseInt(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group controlId="formEndDate">
                <Form.Label>Fecha fin</Form.Label>
                <Row>
                  <Col>
                    <Form.Group controlId="formEndDay">
                      <Form.Label>Día</Form.Label>
                      <Form.Control
                        type="number"
                        value={endDay}
                        maxLength={2}
                        placeholder="DD"
                        onChange={(e) => setEndDay(Number.parseInt(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="formEndMonth">
                      <Form.Label>Mes</Form.Label>
                      <Form.Control
                        type="number"
                        value={endMonth}
                        maxLength={2}
                        placeholder="MM"
                        onChange={(e) => setEndMonth(Number.parseInt(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="formEndYear">
                      <Form.Label>Año</Form.Label>
                      <Form.Control
                        type="number"
                        value={endYear}
                        maxLength={4}
                        placeholder="YYYY"
                        onChange={(e) => setEndYear(Number.parseInt(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form.Group>
              <br/>
              <Button variant="primary" type="submit">
                {selectedUser ? 'Guardar cambios' : 'Agregar'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  };
  
  export default UsersPage;