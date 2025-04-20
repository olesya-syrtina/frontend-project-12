import { useEffect, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import leoProfanity from 'leo-profanity';

const RenameChannelModal = ({
  show, handleClose, currentName, existingChannelNames, onSubmit, isSubmitting,
}) => {
  const { t } = useTranslation();

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('modal.rename.length'))
      .max(20, t('modal.rename.length'))
      .notOneOf(existingChannelNames.filter((name) => name !== currentName), t('modal.rename.duplicate'))
      .required(t('modal.rename.required')),
  });

  const formik = useFormik({
    initialValues: { name: currentName },
    validationSchema,
    onSubmit: (values) => {
      const cleanName = leoProfanity.clean(values.name);
      onSubmit(cleanName);
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
        <Modal.Title>{t('modal.rename.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Form.Group controlId="name">
            <Form.Label className="visually-hidden">{t('modal.rename.placeholder')}</Form.Label>
            <Form.Control
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              isInvalid={formik.touched.name && !!formik.errors.name}
              ref={inputRef}
              placeholder={t('modal.rename.placeholder')}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              {t('modal.rename.cancel')}
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {t('modal.rename.submit')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannelModal;
