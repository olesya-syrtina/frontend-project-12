import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AddChannelModal from './modal/Add.jsx';
import RenameChannelModal from './modal/Rename.jsx';
import RemoveChannelModal from './modal/Remove.jsx';
import { closeModal } from '../slices/uiSlice';

const ModalContainer = () => {
  const dispatch = useDispatch();
  const { modal, modalProps } = useSelector((s) => s.ui);

  const handleClose = () => {
    dispatch(closeModal());
  };

  const {
    channelName, channelId, onSubmit, onConfirm,
  } = modalProps || {};

  switch (modal) {
    case 'add':
      return (
        <AddChannelModal
          show
          channelName={channelName}
          onSubmit={onSubmit}
          handleClose={handleClose}
        />
      );

    case 'rename':
      return (
        <RenameChannelModal
          show
          channelName={channelName}
          onSubmit={onSubmit}
          handleClose={handleClose}
        />
      );

    case 'remove':
      return (
        <RemoveChannelModal
          show
          channelId={channelId}
          onConfirm={onConfirm}
          handleClose={handleClose}
        />
      );

    default:
      return null;
  }
};

export default ModalContainer;
