import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const RemoveChannelModal = ({
  show, handleClose, onConfirm, isSubmitting,
}) => {
  const { t } = useTranslation();
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.remove.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('modal.remove.confirm')}</p>
        <div className="d-flex justify-content-end">
          <Button variant="secondary" onClick={handleClose} className="me-2">
            {t('modal.remove.cancel')}
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={isSubmitting}>
            {t('modal.remove.submit')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveChannelModal;
