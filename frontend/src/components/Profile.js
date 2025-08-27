import React, { useState } from 'react';
import { Card, Form, Button, Alert, Row, Col, Container } from 'react-bootstrap';
import axios from 'axios';

function Profile({ user, setUser }) {
  const [formData, setFormData] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProfileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess('');

    try {
      const response = await axios.patch(`http://localhost:8000/api/users/${user.id}/`, formData);
      const updatedUser = { ...user, ...response.data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSuccess('Profil berhasil diperbarui!');
    } catch (error) {
      setErrors(error.response?.data || { general: 'Gagal memperbarui profil' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setErrors({ confirm_password: 'Password baru tidak cocok' });
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess('');

    try {
      await axios.post(`http://localhost:8000/api/users/${user.id}/change_password/`, {
        old_password: passwordData.old_password,
        new_password: passwordData.new_password
      });
      setSuccess('Password berhasil diubah!');
      setPasswordData({
        old_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      setErrors(error.response?.data || { general: 'Gagal mengubah password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row>
        <Col lg={8} className="mx-auto">
          {/* Profile Header */}
          <Card className="card-brutal bg-primary-brutal text-center mb-4">
            <Card.Body className="p-4">
              <div className="display-1 mb-3">👤</div>
              <h2 className="text-brutal mb-2">PROFIL PENGGUNA</h2>
              <p className="fw-bold mb-0">@{user.username}</p>
              <small className="fw-bold">
                Bergabung: {new Date(user.date_joined).toLocaleDateString('id-ID')}
              </small>
            </Card.Body>
          </Card>

          {success && (
            <Alert variant="success" className="alert-brutal bounce">
              <strong>SUCCESS!</strong> {success}
            </Alert>
          )}

          {errors.general && (
            <Alert variant="danger" className="alert-brutal shake">
              <strong>ERROR!</strong> {errors.general}
            </Alert>
          )}

          <Row>
            {/* Profile Information */}
            <Col md={6}>
              <Card className="card-brutal bg-white mb-4">
                <Card.Header className="bg-secondary-brutal">
                  <h4 className="text-brutal mb-0">📝 INFORMASI PROFIL</h4>
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={handleProfileSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold text-uppercase">Username</Form.Label>
                      <Form.Control
                        type="text"
                        value={user.username}
                        disabled
                        className="form-control-brutal"
                      />
                      <Form.Text className="fw-bold">Username tidak dapat diubah</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold text-uppercase">Nama Depan</Form.Label>
                      <Form.Control
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleProfileChange}
                        className="form-control-brutal"
                        placeholder="Nama depan"
                        isInvalid={!!errors.first_name}
                      />
                      <Form.Control.Feedback type="invalid" className="fw-bold">
                        {errors.first_name}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold text-uppercase">Nama Belakang</Form.Label>
                      <Form.Control
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleProfileChange}
                        className="form-control-brutal"
                        placeholder="Nama belakang"
                        isInvalid={!!errors.last_name}
                      />
                      <Form.Control.Feedback type="invalid" className="fw-bold">
                        {errors.last_name}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold text-uppercase">Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleProfileChange}
                        className="form-control-brutal"
                        placeholder="email@example.com"
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid" className="fw-bold">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Button
                      type="submit"
                      className="btn-brutal bg-success-brutal w-100"
                      disabled={loading}
                    >
                      {loading ? '⏳ MENYIMPAN...' : '💾 UPDATE PROFIL'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* Change Password */}
            <Col md={6}>
              <Card className="card-brutal bg-white mb-4">
                <Card.Header className="bg-warning-brutal">
                  <h4 className="text-brutal mb-0">🔐 UBAH PASSWORD</h4>
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={handlePasswordSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold text-uppercase">Password Lama</Form.Label>
                      <Form.Control
                        type="password"
                        name="old_password"
                        value={passwordData.old_password}
                        onChange={handlePasswordChange}
                        className="form-control-brutal"
                        placeholder="Masukkan password lama"
                        isInvalid={!!errors.old_password}
                      />
                      <Form.Control.Feedback type="invalid" className="fw-bold">
                        {errors.old_password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold text-uppercase">Password Baru</Form.Label>
                      <Form.Control
                        type="password"
                        name="new_password"
                        value={passwordData.new_password}
                        onChange={handlePasswordChange}
                        className="form-control-brutal"
                        placeholder="Password baru (min. 8 karakter)"
                        isInvalid={!!errors.new_password}
                      />
                      <Form.Control.Feedback type="invalid" className="fw-bold">
                        {errors.new_password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold text-uppercase">Konfirmasi Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirm_password"
                        value={passwordData.confirm_password}
                        onChange={handlePasswordChange}
                        className="form-control-brutal"
                        placeholder="Ulangi password baru"
                        isInvalid={!!errors.confirm_password}
                      />
                      <Form.Control.Feedback type="invalid" className="fw-bold">
                        {errors.confirm_password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Button
                      type="submit"
                      className="btn-brutal bg-danger text-white w-100"
                      disabled={loading}
                    >
                      {loading ? '⏳ MENGUBAH...' : '🔐 UBAH PASSWORD'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* User Stats */}
          <Card className="card-brutal bg-info-brutal">
            <Card.Header>
              <h4 className="text-brutal mb-0">📊 STATISTIK</h4>
            </Card.Header>
            <Card.Body>
              <Row className="text-center">
                <Col md={4}>
                  <h3 className="text-brutal">🎯</h3>
                  <p className="fw-bold mb-0">Status</p>
                  <p className="fw-bold">{user.is_staff ? 'ADMIN' : 'USER'}</p>
                </Col>
                <Col md={4}>
                  <h3 className="text-brutal">📅</h3>
                  <p className="fw-bold mb-0">Bergabung</p>
                  <p className="fw-bold">{new Date(user.date_joined).toLocaleDateString('id-ID')}</p>
                </Col>
                <Col md={4}>
                  <h3 className="text-brutal">✅</h3>
                  <p className="fw-bold mb-0">Status Akun</p>
                  <p className="fw-bold">AKTIF</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;