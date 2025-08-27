import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Alert, Spinner, Form, Modal, Row, Col } from 'react-bootstrap';
import axios from 'axios';

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/categories/');
      setCategories(response.data.results || response.data);
      setLoading(false);
    } catch (error) {
      setError('Gagal memuat data kategori');
      setLoading(false);
    }
  };

  const handleShowModal = (category = null) => {
    setEditingCategory(category);
    setFormData({
      name: category ? category.name : '',
      description: category ? category.description : ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setFormErrors({});
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setError('');
    setSuccess('');

    try {
      if (editingCategory) {
        await axios.patch(`http://localhost:8000/api/categories/${editingCategory.id}/`, formData);
        setSuccess('Kategori berhasil diperbarui!');
      } else {
        await axios.post('http://localhost:8000/api/categories/', formData);
        setSuccess('Kategori berhasil ditambahkan!');
      }
      handleCloseModal();
      fetchCategories();
    } catch (error) {
      setFormErrors(error.response?.data || { general: 'Gagal menyimpan kategori' });
    }
  };

  const handleDelete = async (categoryId, categoryName) => {
    if (window.confirm(`Yakin ingin menghapus kategori "${categoryName}"?`)) {
      try {
        await axios.delete(`http://localhost:8000/api/categories/${categoryId}/`);
        setSuccess('Kategori berhasil dihapus!');
        fetchCategories();
      } catch (error) {
        setError('Gagal menghapus kategori. Pastikan tidak ada berita yang menggunakan kategori ini.');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" className="border-brutal" />
        <h3 className="mt-3 text-brutal">MEMUAT DATA KATEGORI...</h3>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <Card className="card-brutal bg-primary-brutal text-center mb-4">
        <Card.Body className="p-4">
          <h1 className="text-brutal display-6 mb-2">📁 MANAJEMEN KATEGORI</h1>
          <p className="lead fw-bold mb-0">Kelola kategori berita</p>
        </Card.Body>
      </Card>

      {error && (
        <Alert variant="danger" className="alert-brutal mb-4">
          <strong>ERROR!</strong> {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="alert-brutal mb-4 bounce">
          <strong>SUCCESS!</strong> {success}
        </Alert>
      )}

      {/* Add Category Button */}
      <Card className="card-brutal bg-white mb-4">
        <Card.Body>
          <Button 
            className="btn-brutal bg-success-brutal"
            onClick={() => handleShowModal()}
          >
            ➕ TAMBAH KATEGORI BARU
          </Button>
        </Card.Body>
      </Card>

      {/* Categories Table */}
      <Card className="card-brutal bg-white">
        <Card.Header className="bg-secondary-brutal">
          <h3 className="text-brutal mb-0">📋 DAFTAR KATEGORI ({categories.length})</h3>
        </Card.Header>
        <Card.Body className="p-0">
          <Table className="table-brutal mb-0" responsive>
            <thead>
              <tr>
                <th>NAMA KATEGORI</th>
                <th>DESKRIPSI</th>
                <th>JUMLAH BERITA</th>
                <th>DIBUAT</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id}>
                  <td className="fw-bold">{category.name}</td>
                  <td>{category.description || 'Tidak ada deskripsi'}</td>
                  <td className="fw-bold text-center">{category.news_count}</td>
                  <td className="fw-bold">
                    {new Date(category.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button
                        size="sm"
                        className="btn-brutal bg-warning-brutal"
                        onClick={() => handleShowModal(category)}
                        title="Edit Kategori"
                      >
                        ✏️
                      </Button>
                      
                      <Button
                        size="sm"
                        className="btn-brutal bg-danger text-white"
                        onClick={() => handleDelete(category.id, category.name)}
                        title="Hapus Kategori"
                        disabled={category.news_count > 0}
                      >
                        🗑️
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          {categories.length === 0 && (
            <div className="text-center p-4">
              <h4 className="text-brutal">📁 BELUM ADA KATEGORI</h4>
              <p className="fw-bold">Tambahkan kategori pertama untuk mengorganisir berita</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Category Modal */}
      <Modal 
        show={showModal} 
        onHide={handleCloseModal}
        className="modal-brutal"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-brutal">
            {editingCategory ? '✏️ EDIT KATEGORI' : '➕ TAMBAH KATEGORI'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {formErrors.general && (
              <Alert variant="danger" className="alert-brutal">
                <strong>ERROR!</strong> {formErrors.general}
              </Alert>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold text-uppercase">Nama Kategori</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-control-brutal"
                placeholder="Contoh: Teknologi, Olahraga, Politik"
                isInvalid={!!formErrors.name}
              />
              <Form.Control.Feedback type="invalid" className="fw-bold">
                {formErrors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold text-uppercase">Deskripsi (Opsional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control-brutal"
                placeholder="Deskripsi singkat tentang kategori ini..."
                isInvalid={!!formErrors.description}
              />
              <Form.Control.Feedback type="invalid" className="fw-bold">
                {formErrors.description}
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              type="button"
              className="btn-brutal bg-secondary-brutal"
              onClick={handleCloseModal}
            >
              ❌ BATAL
            </Button>
            <Button 
              type="submit"
              className="btn-brutal bg-success-brutal"
            >
              {editingCategory ? '💾 UPDATE' : '➕ TAMBAH'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default CategoryManagement;