import React from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { logIn } from '../slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import headerImage from '../assets/avatar_1.jpg';

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Имя пользователя должно содержать от 3 до 20 символов')
      .max(20, 'Имя пользователя должно содержать от 3 до 20 символов')
      .required('Обязательное поле'),
    password: Yup.string()
      .min(6, 'Пароль должен быть не менее 6 символов')
      .required('Обязательное поле'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Пароли должны совпадать')
      .required('Обязательное поле'),
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
          setFieldError('username', 'Пользователь с таким именем уже существует');
        } else {
          setFieldError('username', 'Ошибка регистрации. Попробуйте ещё раз.');
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Container className="container-fluid h-100">
        <Row className="justify-content-center align-content-center h-100">
          <Col className="col-12 col-md-8 col-xxl-6">
            <Card className="card shadow-sm">
              <Card.Body className="d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                <div>
                  <img src={headerImage} className="rounded-circle" alt="Регистрация" />
                </div>
                <Form className="w-50" onSubmit={formik.handleSubmit} noValidate>
                  <h1 className="text-center mb-4">Регистрация</h1>
                  <Form.Group className="form-floating mb-3" controlId="username">
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="От 3 до 20 символов"
                      autoComplete="username"
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.username && !!formik.errors.username}
                    />
                    <Form.Label>Имя пользователя</Form.Label>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="form-floating mb-3" controlId="password">
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Не менее 6 символов"
                      autoComplete="new-password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.password && !!formik.errors.password}
                    />
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="form-floating mb-4" controlId="confirmPassword">
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      placeholder="Пароли должны совпадать"
                      autoComplete="new-password"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
                    />
                    <Form.Label>Подтвердите пароль</Form.Label>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.confirmPassword}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button variant="outline-primary" type="submit" className="w-100" disabled={formik.isSubmitting}>
                    Зарегистрироваться
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
