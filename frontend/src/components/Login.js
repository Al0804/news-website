import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/auth/login/', formData);
      onLogin(response.data.user, response.data.tokens);
    } catch (error) {
      setError(error.response?.data?.non_field_errors?.[0] || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="card-brutal bg-white">
            <Card.Header className="bg-primary-brutal text-center py-3">
              <h2 className="text-brutal mb-0">🔐 LOGIN</h2>
            </Card.Header>
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" className="alert-brutal shake">
                  <strong>ERROR!</strong> {error}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-uppercase">Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="form-control-brutal"
                    placeholder="Masukkan username"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold text-uppercase">Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="form-control-brutal"
                    placeholder="Masukkan password"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="btn-brutal bg-success-brutal w-100 py-3"
                  disabled={loading}
                >
                  {loading ? '⏳ LOGGING IN...' : '🚀 LOGIN SEKARANG'}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <p className="fw-bold">
                  Belum punya akun? {' '}
                  <Link to="/register" className="text-decoration-none fw-bold">
                    DAFTAR DI SINI!
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;