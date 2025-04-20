import {
  Container, Row, Col, Card, Form, Button,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';
import headerImage from '../assets/avatar_1.jpg';
import { logIn } from '../slices/authSlice';
import Header from './Header.jsx';

const SignupPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rollbar = useRollbar();

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, t('signup.validation.usernameLength'))
      .max(20, t('signup.validation.usernameLength'))
      .required(t('signup.validation.required')),
    password: Yup.string()
      .min(6, t('signup.validation.passwordMin'))
      .required(t('signup.validation.required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], t('signup.validation.passwordsMatch'))
      .required(t('signup.validation.required')),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        const response = await axios.post('/api/v1/signup', {
          username: values.username,
          password: values.password,
        });
        dispatch(logIn({ token: response.data.token, username: response.data.username }));
        navigate('/');
      } catch (error) {
        if (error.response && error.response.status === 409) {
          setFieldError('username', t('signup.error.userExists'));
        } else {
          setFieldError('username', t('signup.error.generic'));
        }
        toast.error(t('toast.networkError'));
        rollbar.error(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Header />
      <Container className="container-fluid h-100">
        <Row className="justify-content-center align-content-center h-100">
          <Col className="col-12 col-md-8 col-xxl-6">
            <Card className="card shadow-sm">
              <Card.Body className="d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                <div>
                  <img src={headerImage} className="rounded-circle" alt={t('signup.title')} />
                </div>
                <Form className="w-50" onSubmit={formik.handleSubmit} noValidate>
                  <h1 className="text-center mb-4">{t('signup.title')}</h1>
                  <Form.Group className="form-floating mb-3" controlId="username">
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder={t('signup.placeholder.username')}
                      autoComplete="username"
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.username && !!formik.errors.username}
                    />
                    <Form.Label>{t('signup.placeholder.username')}</Form.Label>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="form-floating mb-3" controlId="password">
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder={t('signup.placeholder.password')}
                      autoComplete="new-password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.password && !!formik.errors.password}
                    />
                    <Form.Label>{t('signup.placeholder.password')}</Form.Label>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="form-floating mb-4" controlId="confirmPassword">
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      placeholder={t('signup.placeholder.confirmPassword')}
                      autoComplete="new-password"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
                    />
                    <Form.Label>{t('signup.placeholder.confirmPassword')}</Form.Label>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.confirmPassword}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button variant="outline-primary" type="submit" className="w-100" disabled={formik.isSubmitting}>
                    {t('signup.submit')}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SignupPage;
