import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spinner, Alert, Badge, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchNews();
  }, [id]);

  const fetchNews = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/news/${id}/`);
      setNews(response.data);
      setLoading(false);
    } catch (error) {
      setError('Berita tidak ditemukan');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Yakin ingin menghapus berita ini?')) {
      try {
        await axios.delete(`http://localhost:8000/api/news/${id}/`);
        navigate('/');
      } catch (error) {
        setError('Gagal menghapus berita');
      }
    }
  };

  const canEdit = user && (user.is_staff || user.id === news?.author.id);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" className="border-brutal" />
        <h3 className="mt-3 text-brutal">MEMUAT BERITA...</h3>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger" className="alert-brutal">
          <strong>ERROR!</strong> {error}
        </Alert>
        <Button 
          onClick={() => navigate('/')} 
          className="btn-brutal bg-primary-brutal"
        >
          ← KEMBALI KE BERANDA
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="card-brutal bg-white">
            {news.image && (
              <Card.Img 
                variant="top" 
                src={news.image} 
                style={{ height: '400px', objectFit: 'cover' }}
                className="border-bottom border-brutal"
              />
            )}
            
            <Card.Body className="p-4">
              <div className="mb-3">
                <Badge bg="dark" className="shadow-brutal-small me-2">
                  {news.category.name}
                </Badge>
                <small className="text-muted fw-bold">
                  📅 {new Date(news.created_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </small>
              </div>

              <h1 className="text-brutal display-6 mb-3">{news.title}</h1>
              
              <div className="mb-4">
                <strong className="fw-bold">👤 Penulis: {news.author.first_name} {news.author.last_name} (@{news.author.username})</strong>
              </div>

              <div className="news-content">
                {news.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="fs-5 fw-semibold mb-3 lh-base">
                    {paragraph}
                  </p>
                ))}
              </div>

              {news.updated_at !== news.created_at && (
                <div className="mt-4">
                  <small className="text-muted fw-bold">
                    ✏️ Terakhir diperbarui: {new Date(news.updated_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </small>
                </div>
              )}

              <hr className="my-4" style={{ border: '2px solid #000' }} />
              
              <div className="d-flex gap-2 flex-wrap">
                <Button 
                  onClick={() => navigate('/')} 
                  className="btn-brutal bg-secondary-brutal"
                >
                  ← KEMBALI
                </Button>
                
                {canEdit && (
                  <>
                    <Button 
                      onClick={() => navigate(`/news/edit/${news.id}`)} 
                      className="btn-brutal bg-warning-brutal"
                    >
                      ✏️ EDIT
                    </Button>
                    <Button 
                      onClick={handleDelete} 
                      className="btn-brutal bg-danger text-white"
                    >
                      🗑️ HAPUS
                    </Button>
                  </>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default NewsDetail;