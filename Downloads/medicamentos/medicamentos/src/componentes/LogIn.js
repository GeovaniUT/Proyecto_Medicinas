
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './login.css'

function LogIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async event => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:8082/obtenerUsuarios', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            const userMatch = data.usuarios.find(user => user.user === username && user.pass === password);

            if (userMatch) {
                navigate('/TablaM');
            } else {
                alert("campos incorrecta")
            }
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
        }
    };

    const backgroundStyle = {
        backgroundImage: `url("https://static.vecteezy.com/system/resources/previews/006/685/341/non_2x/medical-instruments-and-medicines-seamless-pattern-on-white-background-cartoon-background-vector.jpg")`, // Ruta de tu imagen de fondo
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    return (
        <div style={backgroundStyle}>
            
            <Container className="mt-5">
                <Row className="justify-content-center">
                        
                    <Col md={6}>
                    <p className='tittle'>MI LIFE</p>
                        <Card>
                            <Card.Body>
                                <Card.Title className="text-center">Iniciar Sesión</Card.Title>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group>
                                        <Form.Label>Nombre de Usuario</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Contraseña</Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit">
                                        Iniciar Sesión
                                    </Button>
                                </Form>
                                <p className="text-center mt-3">
                                    ¿No tienes una cuenta? <Link to="/registro">Regístrate</Link>
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default LogIn;
