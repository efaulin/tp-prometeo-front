import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';
import Badge from 'react-bootstrap/Badge';

function NavBar() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { logout } = useAuth(); // Obtén la función de logout desde el contexto de autenticación
    const handleLogout = () => {
        logout(); // Llama a la función de logout del contexto
        navigate('/'); // Redirige al login después de hacer logout
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
        <Container fluid>
            <Navbar.Brand as={Link} to="/">Prometeo</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
            <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: '100px' }}
                navbarScroll
            >
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <NavDropdown title="CRUDS" id="navbarScrollingDropdown">
                <NavDropdown.Item as={Link} to="/users">Users</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/idiomas">Idiomas</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/narradores">Narradores</NavDropdown.Item>
                </NavDropdown>
            </Nav>
            {user && user.username ? (
                <div className="d-flex align-items-center gap-3">
                    <Badge className='text-nowrap' bg="primary">Bienvenido {user.username}</Badge>
                    <Form className="d-flex">
                        <Button variant="outline-danger" onClick={handleLogout}>logout</Button>
                    </Form>
                </div>
            ) : (
                <Link className="btn btn-primary" to="/login">Loguearse</Link>
            )}
            </Navbar.Collapse>
        </Container>
        </Navbar>
    );
}

export default NavBar;