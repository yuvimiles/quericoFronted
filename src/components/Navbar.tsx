import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import logo from "../assets/logo.png";

export default function AppNavbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuth = () => {
    setIsAuthenticated(!isAuthenticated);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm custom-navbar">
      <Container>
        <div className="d-flex align-items-center">
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center brand-left">
            <img 
              src={logo} 
              alt="Logo" 
              width="40" 
              height="40" 
              className="d-inline-block align-top me-2"
            />
            <span className="custom-font">QueRico</span>
          </Navbar.Brand>
        </div>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/feed">  Feed</Nav.Link>
            <Nav.Link as={Link} to="/profile">  Profile</Nav.Link>
            {isAuthenticated ? (
              <Button variant="outline-light" onClick={handleAuth}>Logout</Button>
            ) : (
              <Nav.Link as={Link} to="/login" className="btn btn-outline-light">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}