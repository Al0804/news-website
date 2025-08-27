import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState({});
  const [recentNews, setRecentNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, newsResponse] = await Promise.all([
        axios.get('http://localhost:8000/api/dashboard/stats/'),
        axios.get('http://localhost:8000/api/news/')
      ]);
      
      setStats(statsResponse.data);
      setRecentNews((newsResponse.data.results || newsResponse.data).slice(0, 10));
      setLoading(false);
    } catch (error) {
      setError('Gagal memuat data dashboard');
      setLoading(false);
    }
  };

  const handleTogglePublish = async (newsId, currentStatus) => {
    try {
      await axios.patch(`http://localhost:8000/api/news/${newsId}/`, {
        is_published: !currentStatus
      });
      fetchDashboardData(); // Refresh data
    } catch (error) {
      setError('Gagal mengubah status publikasi');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" className="border-brutal" />
        <h3 className="mt-3 text-brutal">MEMUAT DASHBOARD...</h3>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="card-brutal bg-primary-brutal p-4 mb-4 text-center">
        <h1 className="text-brutal display-5 mb-2">🎛️ ADMIN DASHBOARD</h1>
        <p className="lead fw-bold mb-0">Kelola seluruh konten website berita</p>
      </div>

      {error && (
        <Alert variant="danger" className="alert-brutal mb-4">
          <strong>ERROR!</strong> {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="card-brutal bg-success-brutal text-center h-100">
            <Card.Body>
              <h2 className="text-brutal display-4">{stats.total_news}</h2>
              <p className="fw-bold mb-0">TOTAL BERITA</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="card-brutal bg-info-brutal text-center h-100">
            <Card.Body>
              <h2 className="text-brutal display-4">{stats.published_news}</h2>
              <p className="fw-bold mb-0">BERITA AKTIF</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="card-brutal bg-warning-brutal text-center h-100">
            <Card.Body>
              <h2 className="text-brutal display-4">{stats.total_users}</h2>
              <p className="fw-bold mb-0">TOTAL USER</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="card-brutal bg-secondary-brutal text-center h-100">
            <Card.Body>
              <h2 className="text-brutal display-4">{stats.total_categories}</h2>
              <p className="fw-bold mb-0">KATEGORI</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="card-brutal bg-white mb-4">
        <Card.Header className="bg-primary-brutal">
          <h3 className="text-brutal mb-0">⚡ AKSI CEPAT</h3>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <LinkContainer to="/news/create">
                <Button className="btn-brutal bg-success-brutal w-100 mb-2">
                  📝 BUAT BERITA
                </Button>
              </LinkContainer>
            </Col>
            <Col md={3}>
              <LinkContainer to="/admin/categories">
                <Button className="btn-brutal bg-info-brutal w-100 mb-2">
                  📁 KELOLA KATEGORI
                </Button>
              </LinkContainer>
            </Col>
            <Col md={3}>
              <LinkContainer to="/admin/users">
                <Button className="btn-brutal bg-warning-brutal w-100 mb-2">
                  👥 KELOLA USER
                </Button>
              </LinkContainer>
            </Col>
            <Col md={3}>
              <Button 
                onClick={() => window.open('/admin', '_blank')}
                className="btn-brutal bg-secondary-brutal w-100 mb-2"
              >
                🔧 DJANGO ADMIN
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Recent News */}
      <Card className="card-brutal bg-white">
        <Card.Header className="bg-primary-brutal">
          <h3 className="text-brutal mb-0">📰 BERITA TERBARU</h3>
        </Card.Header>
        <Card.Body className="p-0">
          <Table className="table-brutal mb-0" responsive>
            <thead>
              <tr>
                <th>JUDUL</th>
                <th>KATEGORI</th>
                <th>PENULIS</th>
                <th>STATUS</th>
                <th>TANGGAL</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {recentNews.map(news => (
                <tr key={news.id}>
                  <td className="fw-bold">
                    {news.title.length > 50 ? 
                      news.title.substring(0, 50) + '...' : 
                      news.title
                    }
                  </td>
                  <td>
                    <Badge bg="dark" className="shadow-brutal-small">
                      {news.category.name}
                    </Badge>
                  </td>
                  <td className="fw-bold">{news.author.username}</td>
                  <td>
                    <Badge 
                      bg={news.is_published ? 'success' : 'danger'}
                      className="shadow-brutal-small"
                    >
                      {news.is_published ? 'AKTIF' : 'DRAFT'}
                    </Badge>
                  </td>
                  <td className="fw-bold">
                    {new Date(news.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <LinkContainer to={`/news/${news.id}`}>
                        <Button size="sm" className="btn-brutal bg-info-brutal">
                          👁️
                        </Button>
                      </LinkContainer>
                      <LinkContainer to={`/news/edit/${news.id}`}>
                        <Button size="sm" className="btn-brutal bg-warning-brutal">
                          ✏️
                        </Button>
                      </LinkContainer>
                      <Button 
                        size="sm" 
                        className={`btn-brutal ${news.is_published ? 'bg-danger' : 'bg-success-brutal'}`}
                        onClick={() => handleTogglePublish(news.id, news.is_published)}
                      >
                        {news.is_published ? '📵' : '📤'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          {recentNews.length === 0 && (
            <div className="text-center p-4">
              <h4 className="text-brutal">📭 BELUM ADA BERITA</h4>
              <p className="fw-bold">Mulai buat berita pertama Anda!</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default Dashboard;