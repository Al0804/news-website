import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Alert, Spinner, Badge, Form, Modal } from 'react-bootstrap';
import axios from 'axios';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/users/');
      setUsers(response.data.results || response.data);
      setLoading(false);
    } catch (error) {
      setError('Gagal memuat data user');
      setLoading(false);
    }
  };

  const handleToggleStaff = async (userId, currentStatus) => {
    try {
      await axios.patch(`http://localhost:8000/api/users/${userId}/`, {
        is_staff: !currentStatus
      });
      fetchUsers(); // Refresh data
    } catch (error) {
      setError('Gagal mengubah status admin');
    }
  };

  const handleToggleActive = async (userId, currentStatus) => {
    try {
      await axios.patch(`http://localhost:8000/api/users/${userId}/`, {
        is_active: !currentStatus
      });
      fetchUsers(); // Refresh data
    } catch (error) {
      setError('Gagal mengubah status aktif');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Yakin ingin menghapus user ini?')) {
      try {
        await axios.delete(`http://localhost:8000/api/users/${userId}/`);
        fetchUsers(); // Refresh data
        setShowModal(false);
      } catch (error) {
        setError('Gagal menghapus user');
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.first_name + ' ' + user.last_name).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" className="border-brutal" />
        <h3 className="mt-3 text-brutal">MEMUAT DATA USER...</h3>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <Card className="card-brutal bg-primary-brutal text-center mb-4">
        <Card.Body className="p-4">
          <h1 className="text-brutal display-6 mb-2">👥 MANAJEMEN USER</h1>
          <p className="lead fw-bold mb-0">Kelola semua pengguna sistem</p>
        </Card.Body>
      </Card>

      {error && (
        <Alert variant="danger" className="alert-brutal mb-4">
          <strong>ERROR!</strong> {error}
        </Alert>
      )}

      {/* Search */}
      <Card className="card-brutal bg-white mb-4">
        <Card.Body>
          <Form.Control
            type="text"
            placeholder="Cari user berdasarkan username, email, atau nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control-brutal"
          />
        </Card.Body>
      </Card>

      {/* Users Table */}
      <Card className="card-brutal bg-white">
        <Card.Header className="bg-secondary-brutal">
          <h3 className="text-brutal mb-0">📋 DAFTAR USER ({filteredUsers.length})</h3>
        </Card.Header>
        <Card.Body className="p-0">
          <Table className="table-brutal mb-0" responsive>
            <thead>
              <tr>
                <th>USERNAME</th>
                <th>NAMA LENGKAP</th>
                <th>EMAIL</th>
                <th>STATUS</th>
                <th>ROLE</th>
                <th>BERGABUNG</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td className="fw-bold">@{user.username}</td>
                  <td className="fw-bold">{user.first_name} {user.last_name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge 
                      bg={user.is_active ? 'success' : 'danger'}
                      className="shadow-brutal-small"
                    >
                      {user.is_active ? 'AKTIF' : 'NONAKTIF'}
                    </Badge>
                  </td>
                  <td>
                    <Badge 
                      bg={user.is_staff ? 'primary' : 'secondary'}
                      className="shadow-brutal-small"
                    >
                      {user.is_staff ? 'ADMIN' : 'USER'}
                    </Badge>
                  </td>
                  <td className="fw-bold">
                    {new Date(user.date_joined).toLocaleDateString('id-ID')}
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button
                        size="sm"
                        className={`btn-brutal ${user.is_staff ? 'bg-warning-brutal' : 'bg-info-brutal'}`}
                        onClick={() => handleToggleStaff(user.id, user.is_staff)}
                        title={user.is_staff ? 'Hapus Admin' : 'Jadikan Admin'}
                      >
                        {user.is_staff ? '👑' : '👤'}
                      </Button>
                      
                      <Button
                        size="sm"
                        className={`btn-brutal ${user.is_active ? 'bg-danger' : 'bg-success-brutal'}`}
                        onClick={() => handleToggleActive(user.id, user.is_active)}
                        title={user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                      >
                        {user.is_active ? '🔒' : '🔓'}
                      </Button>
                      
                      <Button
                        size="sm"
                        className="btn-brutal bg-danger text-white"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowModal(true);
                        }}
                        title="Hapus User"
                      >
                        🗑️
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          {filteredUsers.length === 0 && (
            <div className="text-center p-4">
              <h4 className="text-brutal">👤 TIDAK ADA USER DITEMUKAN</h4>
              <p className="fw-bold">Coba kata kunci pencarian lain</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        className="modal-brutal"
      >
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title className="text-brutal">⚠️ KONFIRMASI HAPUS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="fw-bold">
            Yakin ingin menghapus user <strong>@{selectedUser?.username}</strong>?
          </p>
          <p className="fw-bold text-danger">
            ⚠️ Aksi ini tidak dapat dibatalkan!
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            className="btn-brutal bg-secondary-brutal"
            onClick={() => setShowModal(false)}
          >
            ❌ BATAL
          </Button>
          <Button 
            className="btn-brutal bg-danger text-white"
            onClick={() => handleDeleteUser(selectedUser.id)}
          >
            🗑️ HAPUS
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserManagement;