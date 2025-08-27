import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Container, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';

function NewsForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: '',
    image: null,
    is_published: true
  });
  
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchNews();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/categories/');
      setCategories(response.data.results || response.data);
    } catch (error) {
      setErrors({ general: 'Gagal memuat kategori' });
    }
  };

  const fetchNews = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/news/${id}/`);
      const news = response.data;
      setFormData({
        title: news.title,
        content: news.content,
        category_id: news.category.id,
        image: null,
        is_published: news.is_published
      });
      setInitialLoading(false);
    } catch (error) {
      setErrors({ general: 'Berita tidak ditemukan' });
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('content', formData.content);
    submitData.append('category_id', formData.category_id);
    submitData.append('is_published', formData.is_published);
    
    if (formData.image) {
      submitData.append('image', formData.image);
    }

    try {
      let response;
      if (isEdit) {
        response = await axios.patch(`http://localhost:8000/api/news/${id}/`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await axios.post('http://localhost:8000/api/news/', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      navigate(`/news/${response.data.id}`);
    } catch (error) {
      setErrors(error.response?.data || { general: 'Gagal menyimpan berita' });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" className="border-brutal" />
        <h3 className="mt-3 text-brutal">MEMUAT DATA...</h3>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="card-brutal bg-white">
            <Card.Header className="bg-primary-brutal text-center py-3">
              <h2 className="text-brutal mb-0">
                {isEdit ? '✏️ EDIT BERITA' : '📝 BUAT BERITA BARU'}
              </h2>
            </Card.Header>
            <Card.Body className="p-4">
              {errors.general && (
                <Alert variant="danger" className="alert-brutal shake">
                  <strong>ERROR!</strong> {errors.general}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-uppercase">Judul Berita</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="form-control-brutal"
                    placeholder="Masukkan judul berita yang menarik"
                    isInvalid={!!errors.title}
                  />
                  <Form.Control.Feedback type="invalid" className="fw-bold">
                    {errors.title}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-uppercase">Kategori</Form.Label>
                  <Form.Select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    required
                    className="form-control-brutal"
                    isInvalid={!!errors.category_id}
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid" className="fw-bold">
                    {errors.category_id}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-uppercase">Gambar (Opsional)</Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={handleChange}
                    accept="image/*"
                    className="form-control-brutal"
                    isInvalid={!!errors.image}
                  />
                  <Form.Text className="fw-bold">
                    Upload gambar untuk membuat berita lebih menarik (format: JPG, PNG, GIF)
                  </Form.Text>
                  <Form.Control.Feedback type="invalid" className="fw-bold">
                    {errors.image}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-uppercase">Isi Berita</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={10}
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    className="form-control-brutal"
                    placeholder="Tulis isi berita di sini... Gunakan enter untuk paragraf baru."
                    isInvalid={!!errors.content}
                  />
                  <Form.Control.Feedback type="invalid" className="fw-bold">
                    {errors.content}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    name="is_published"
                    checked={formData.is_published}
                    onChange={handleChange}
                    label="Publikasikan berita sekarang"
                    className="fw-bold"
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button
                    type="submit"
                    className="btn-brutal bg-success-brutal flex-grow-1"
                    disabled={loading}
                  >
                    {loading ? '⏳ MENYIMPAN...' : (isEdit ? '💾 UPDATE BERITA' : '🚀 PUBLIKASIKAN')}
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={() => navigate('/')}
                    className="btn-brutal bg-secondary-brutal"
                  >
                    ❌ BATAL
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default NewsForm;