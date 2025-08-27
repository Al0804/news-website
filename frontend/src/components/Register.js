import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Register({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear specific error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post('http://localhost:8000/api/auth/register/', formData);
      onLogin(response.data.user, response.data.tokens);
    } catch (error) {
      setErrors(error.response?.data || { general: 'Registrasi gagal' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="card-brutal bg-white">
            <Card.Header className="bg-secondary-brutal text-center py-3">
              <h2 className="text-brutal mb-0">📝 REGISTER</h2>
            </Card.Header>
            <Card.Body className="p-4">
              {errors.general && (
                <Alert variant="danger" className="alert-brutal shake">
                  <strong>ERROR!</strong> {errors.general}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold text-uppercase">Username</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="form-control-brutal"
                        placeholder="Username unik"
                        isInvalid={!!errors.username}
                      />
                      <Form.Control.Feedback type="invalid" className="fw-bold">
                        {errors.username}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold text-uppercase">Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-control-brutal"
                        placeholder="email@example.com"
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid" className="fw-bold">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold text-uppercase">Nama Depan</Form.Label>
                      <Form.Control
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="form-control-brutal"
                        placeholder="Nama depan"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold text-uppercase">Nama Belakang</Form.Label>
                      <Form.Control
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="form-control-brutal"
                        placeholder="Nama belakang"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold text-uppercase">Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="form-control-brutal"
                        placeholder="Password (min. 8 karakter)"
                        isInvalid={!!errors.password}
                      />
                      <Form.Control.Feedback type="invalid" className="fw-bold">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold text-uppercase">Konfirmasi Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password_confirm"
                        value={formData.password_confirm}
                        onChange={handleChange}
                        required
                        className="form-control-brutal"
                        placeholder="Ulangi password"
                        isInvalid={!!errors.password_confirm}
                      />
                      <Form.Control.Feedback type="invalid" className="fw-bold">
                        {errors.password_confirm}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  type="submit"
                  className="btn-brutal bg-success-brutal w-100 py-3"
                  disabled={loading}
                >
                  {loading ? '⏳ CREATING ACCOUNT...' : '🎉 DAFTAR SEKARANG'}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <p className="fw-bold">
                  Sudah punya akun? {' '}
                  <Link to="/login" className="text-decoration-none fw-bold">
                    LOGIN DI SINI!
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

export default Register;