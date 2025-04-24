import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { logOut } from '../slices/authSlice';
import PATHS from '../routes';

const Header = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((s) => s.authorization);

  const handleLogOut = () => {
    dispatch(logOut());
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
