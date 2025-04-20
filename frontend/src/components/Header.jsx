import { Navbar, Container, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { logOut } from '../slices/authSlice';

const Header = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.authorization);

  const handleLogOut = () => {
    dispatch(logOut());
    navigate('/login');
  };

  return (
    <Navbar className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <Container fluid>
        <Navbar.Brand href="/">{t('header.brand')}</Navbar.Brand>
        {isLoggedIn ? (
          <Button variant="primary" onClick={handleLogOut}>
            {t('header.logout')}
          </Button>
        ) : null}
      </Container>
    </Navbar>
  );
};

export default Header;
