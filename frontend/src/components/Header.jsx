import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector(state => state.authorization);

  const handleLogOut = () => {
    dispatch(logOut());
    navigate('/login');
  };

  return (
    <Navbar className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <Container fluid>
        <Navbar.Brand href="/">Hexlet Chat</Navbar.Brand>
        {isLoggedIn ? (
          <Button variant="primary" onClick={handleLogOut}>
            Выйти
          </Button>
        ) : null}
      </Container>
    </Navbar>
  );
};

export default Header;
