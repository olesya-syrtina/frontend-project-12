import React from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import {
  Container, Row, Col, Card, Form, Button,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';
import { logIn } from '../slices/authSlice';
import loginPic from '../assets/loginPic.jpg';
import Header from './Header.jsx';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const rollbar = useRollbar();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values, { setStatus }) => {
      try {
        const response = await axios.post('/api/v1/login', {
          username: values.username,
          password: values.password,
        });
        const { token } = response.data;
        const { username } = response.data;
        dispatch(logIn({ token, username }));
        setStatus(null);
        navigate('/');
        return true;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setStatus(t('login.error.invalid'));
        } else {
          setStatus(t('login.error.generic'));
        }
        console.error(t('login.error.generic'), error);
        toast.error(t('toast.networkError'));
        rollbar.error(error);
        return false;
      }
    },
  });

  return (
    <>
      <Header />
      <Container className="container-fluid h-100">
        <Row className="justify-content-center align-content-center h-100">
          <Col className="col-12 col-md-8 col-xxl-6">
            <Card className="shadow-sm">
              <Card.Body className="row p-5">
                <Col className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                  <img src={loginPic} className="rounded-circle" alt={t('login.title')} />
                </Col>
                <Form
                  className="col-12 col-md-6 mt-3 mt-md-0"
                  onSubmit={formik.handleSubmit}
                  noValidate
                >
                  <h1 className="text-center mb-4">{t('login.title')}</h1>
                  <Form.Group className="form-floating mb-3" controlId="username">
                    <Form.Control
                      type="text"
                      placeholder={t('login.placeholder.username')}
                      name="username"
                      autoComplete="username"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.username}
                      isInvalid={formik.touched.username && !!formik.errors.username}
                    />
                    <Form.Label>{t('login.placeholder.username')}</Form.Label>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="form-floating mb-4" controlId="password">
                    <Form.Control
                      type="password"
                      placeholder={t('login.placeholder.password')}
                      autoComplete="current-password"
                      name="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      isInvalid={formik.touched.password && !!formik.errors.password}
                    />
                    <Form.Label>{t('login.placeholder.password')}</Form.Label>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.password}
                    </Form.Control.Feedback>
                    {formik.status && (
                      <Form.Control.Feedback type="invalid" className="d-block mb-3" tooltip>
                        {formik.status}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Button
                    type="submit"
                    variant="outline-primary"
                    className="w-100 mb-3"
                    disabled={formik.isSubmitting}
                  >
                    {t('login.title')}
                  </Button>
                </Form>
              </Card.Body>
              <Card.Footer className="p-4">
                <div className="text-center">
                  <span>
                    {t('login.noAccount')}
                    {' '}
                  </span>
                  <a href="/signup">{t('login.link.signup')}</a>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LoginPage;
