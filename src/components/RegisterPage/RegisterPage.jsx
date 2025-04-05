import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const register = useStore((state) => state.register);
  const errorMessage = useStore((state) => state.authErrorMessage);
  const setAuthErrorMessage = useStore((state) => state.setAuthErrorMessage);

  useEffect(() => {
    return () => {
      setAuthErrorMessage('');
    };
  }, [setAuthErrorMessage]);

  const handleRegister = (event) => {
    event.preventDefault();
    register({
      username,
      password,
      is_artist: role === 'artist',
      is_organization: role === 'organization',
    });
  };

  const inputStyle = { borderRadius: '3px' };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={6} lg={5}>
          <div className="text-center mb-4">
            <h2 className="fw-bold">Register</h2>
            <p className="text-muted">Create your account</p>
          </div>

          {errorMessage && (
            <Alert variant="danger" className="text-center">
              {errorMessage}
            </Alert>
          )}

          <Form
            onSubmit={handleRegister}
            className="border p-5 shadow-sm bg-light"
            style={{ borderRadius: '3px' }}
          >
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter username"
                style={inputStyle}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
                style={inputStyle}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="role">
              <Form.Label>Select Role</Form.Label>
              <Form.Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                style={inputStyle}
              >
                <option value="">-- Choose Role --</option>
                <option value="artist">Artist</option>
                <option value="organization">Organization</option>
              </Form.Select>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="w-100 fw-semibold px-4 py-2"
              style={{ borderRadius: '3px' }}
            >
              Create Account
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterPage;
