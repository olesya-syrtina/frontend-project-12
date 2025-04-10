import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';

const Header = () => {
  return (
    <Navbar className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <Container fluid>
        <Navbar.Brand href="/">Hexlet Chat</Navbar.Brand>
        <Button variant="primary">Выйти</Button>
      </Container>
    </Navbar>
  );
};

export default Header;
