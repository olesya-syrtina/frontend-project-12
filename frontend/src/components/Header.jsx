import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext.jsx';
import PATHS from '../routes.js';

const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn, logOut } = useAuth();

  const handleLogOut = () => {
    logOut();
    navigate(PATHS.LOGIN);
  };

  return (
    <Navbar className="shadow-sm navbar-expand-lg navbar-light bg-white">
      <Container fluid>
        <Navbar.Brand href={PATHS.HOME}>{t('header.brand')}</Navbar.Brand>
        {isLoggedIn && (
          <Button variant="primary" onClick={handleLogOut}>
            {t('header.logout')}
          </Button>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
