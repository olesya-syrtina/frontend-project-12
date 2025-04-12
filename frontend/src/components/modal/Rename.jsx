import React, { useEffect, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const RenameChannelModal = ({ show, handleClose, currentName, existingChannelNames, onSubmit, isSubmitting }) => {
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Длина должна быть от 3 до 20 символов')
      .max(20, 'Длина должна быть от 3 до 20 символов')
      .notOneOf(existingChannelNames.filter(name => name !== currentName), 'Такое имя уже существует')
      .required('Обязательное поле'),
  });

  const formik = useFormik({
    initialValues: { name: currentName },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values.name);
    },
    enableReinitialize: true, 
  });

  const inputRef = useRef(null);
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Form.Group controlId="name">
            <Form.Control
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              isInvalid={formik.touched.name && !!formik.errors.name}
              ref={inputRef}
              placeholder="Имя канала"
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Отменить
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              Отправить
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannelModal;
