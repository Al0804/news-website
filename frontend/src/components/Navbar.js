import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function Navbar({ user, onLogout }) {
  return (
    <BootstrapNavbar expand="lg" className="navbar-brutal bg-primary-brutal">
      <Container>
        <LinkContainer to="/">
          <BootstrapNavbar.Brand className="text-brutal fs-2">
            📰 PORTAL BERITA
          </BootstrapNavbar.Brand>
        </LinkContainer>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link className="text-brutal">HOME</Nav.Link>
            </LinkContainer>
            
            {user && (
              <LinkContainer to="/news/create">
                <Nav.Link className="text-brutal">BUAT BERITA</Nav.Link>
              </LinkContainer>
            )}
            
            {user?.is_staff && (
              <NavDropdown title="ADMIN" id="admin-dropdown" className="text-brutal">
                <LinkContainer to="/dashboard">
                  <NavDropdown.Item>Dashboard</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/users">
                  <NavDropdown.Item>Kelola User</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/categories">
                  <NavDropdown.Item>Kelola Kategori</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}
          </Nav>
          
          <Nav>
            {user ? (
              <NavDropdown title={`👤 ${user.username}`} id="user-dropdown" className="text-brutal">
                <LinkContainer to="/profile">
                  <NavDropdown.Item>Profil</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={onLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link className="text-brutal">LOGIN</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link className="text-brutal">REGISTER</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;