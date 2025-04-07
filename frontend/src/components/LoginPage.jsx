import axios from 'axios';
import React from 'react';
import { useFormik } from 'formik';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import loginPic from '../assets/loginPic.jpg';

const SignupSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Минимум 2 буквы')
      .max(50, 'Максимум 50 букв')
      .required('Обязательное поле'),
    password: Yup.string()
      .min(2, 'Минимум 2 буквы')
      .max(50, 'Максимум 50 букв')
      .required('Обязательное поле'),
  });

const SignupForm = () => {
    const formik = useFormik({
      initialValues: {
        username: "",
        password: "",
      },
      SignupSchema,
      onSubmit: (values) => {
        console.log("Форма отправлена", values);
      },
    });
    return (
    <Container className='container-fluid h-100'>
    <Row className='row justify-content-center align-content-center h-100'>
        <Col className='col-12 col-md-8 col-xxl-6'>
        <Card className='card shadow-sm'>
            <Card.Body className='card-body row p-5'>
            <Col className='col-12 col-md-6 d-flex align-items-center justify-content-center'>
                <img src={loginPic} className='rounded-circle' alt='Войти' />
            </Col>
            <Form className='col-12 col-md-6 mt-3 mt-md-0' onSubmitCapture={formik.handleSubmit}>
                <h1 className='text-center mb-4'>Войти</h1>
                <Form.Group className='form-floating mb-3' controlId='username'>
                <Form.Control
                    className='form-control'
                    type='text'
                    placeholder='Ваш ник'
                    name='username'
                    autoComplete='username'
                    required
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    isInvalid={formik.status}
                ></Form.Control>
                <Form.Label>Ваш ник</Form.Label>
                </Form.Group>
                <Form.Group className='form-floating mb-4' controlId='password'>
                <Form.Control
                    className='form-control'
                    type='password'
                    placeholder='Пароль'
                    autoComplete='current-password'
                    required
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    isInvalid={formik.status}
                ></Form.Control>
                <Form.Label>Пароль</Form.Label>
                {formik.status && (
                    <Form.Control.Feedback type="invalid" className='d-block mb-3' tooltip>
                    {formik.status}
                    </Form.Control.Feedback>
                )}
                </Form.Group>
                <Button
                type='submit'
                variant="outline-primary"
                className="w-100 mb-3 btn"
                >
                Войти
                </Button>
            </Form>
            </Card.Body>
            <Card.Footer className='card-footer p-4'>
            <div className='text-center'>
                <span>Нет аккаунта? </span>
                <a href='/signup'>Регистрация</a>
            </div>
            </Card.Footer>
        </Card>
        </Col>
    </Row>
    </Container>
    );
  };

  export default SignupForm;