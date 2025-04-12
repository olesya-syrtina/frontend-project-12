import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const RemoveChannelModal = ({ show, handleClose, onConfirm, isSubmitting }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">Уверены?</p>
        <div className="d-flex justify-content-end">
          <Button variant="secondary" onClick={handleClose} className="me-2">
            Отменить
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={isSubmitting}>
            Удалить
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveChannelModal;
