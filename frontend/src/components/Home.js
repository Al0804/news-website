import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';

function Home() {
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchNews();
    fetchCategories();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/news/');
      setNews(response.data.results || response.data);
      setLoading(false);
    } catch (error) {
      setError('Gagal memuat berita');
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/categories/');
      setCategories(response.data.results || response.data);
    } catch (error) {
      console.error('Gagal memuat kategori');
    }
  };

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || item.category.id.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" className="border-brutal" />
        <h3 className="mt-3 text-brutal">MEMUAT BERITA...</h3>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="card-brutal bg-success-brutal p-5 mb-4 text-center">
        <h1 className="text-brutal display-4 mb-3">🔥 BERITA TERKINI 🔥</h1>
        <p className="lead fw-bold">Portal berita dengan desain neo-brutalism yang unik dan menarik!</p>
      </div>

      {/* Search and Filter */}
      <Row className="mb-4">
        <Col md={8}>
          <Form.Control
            type="text"
            placeholder="Cari berita..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control-brutal"
          />
        </Col>
        <Col md={4}>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-control-brutal"
          >
            <option value="">Semua Kategori</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="alert-brutal">
          <strong>ERROR!</strong> {error}
        </Alert>
      )}

      {/* News Grid */}
      <Row>
        {filteredNews.length === 0 ? (
          <Col>
            <div className="card-brutal bg-info-brutal p-5 text-center">
              <h3 className="text-brutal">📰 TIDAK ADA BERITA DITEMUKAN</h3>
              <p className="fw-bold">Coba kata kunci atau kategori lain</p>
            </div>
          </Col>
        ) : (
          filteredNews.map(item => (
            <Col key={item.id} lg={4} md={6} className="mb-4">
              <Card className="card-brutal h-100">
                {item.image && (
                  <Card.Img 
                    variant="top" 
                    src={item.image} 
                    style={{ height: '200px', objectFit: 'cover' }}
                    className="border-bottom border-brutal"
                  />
                )}
                <Card.Body className="d-flex flex-column">
                  <div className="mb-2">
                    <Badge bg="dark" className="shadow-brutal-small">
                      {item.category.name}
                    </Badge>
                  </div>
                  <Card.Title className="text-brutal h5">
                    {item.title}
                  </Card.Title>
                  <Card.Text className="fw-semibold">
                    {item.content.substring(0, 150)}...
                  </Card.Text>
                  <div className="mt-auto">
                    <small className="text-muted fw-bold">
                      📅 {new Date(item.created_at).toLocaleDateString('id-ID')} | 
                      👤 {item.author.username}
                    </small>
                    <LinkContainer to={`/news/${item.id}`}>
                      <Button 
                        variant="primary" 
                        className="btn-brutal bg-secondary-brutal w-100 mt-2"
                      >
                        BACA SELENGKAPNYA
                      </Button>
                    </LinkContainer>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Stats Section */}
      <div className="card-brutal bg-info-brutal p-4 mt-5 text-center">
        <Row>
          <Col md={4}>
            <h2 className="text-brutal">{news.length}</h2>
            <p className="fw-bold">TOTAL BERITA</p>
          </Col>
          <Col md={4}>
            <h2 className="text-brutal">{categories.length}</h2>
            <p className="fw-bold">KATEGORI</p>
          </Col>
          <Col md={4}>
            <h2 className="text-brutal">∞</h2>
            <p className="fw-bold">PEMBACA PUAS</p>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Home;