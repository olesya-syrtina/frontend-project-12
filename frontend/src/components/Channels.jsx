import React, { useState } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';
import {
  setCurrentChannel, addChannel, updateChannel, removeChannel,
  fetchChannels,
} from '../slices/channelsSlice.js';
import Channel from './Channel.jsx';
import AddChannelModal from './modal/Add.jsx';
import RemoveChannelModal from './modal/Remove.jsx';
import RenameChannelModal from './modal/Rename.jsx';

const Channels = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const rollbar = useRollbar();
  const {
    channels, status, currentChannelId, error,
  } = useSelector((state) => state.channels);
  const { token } = useSelector((state) => state.authorization);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useState(() => {
    if (status === 'idle') dispatch(fetchChannels());
  }, [dispatch, status]);

  const existingChannelNames = channels.map((c) => c.name);

  const handleChannelClick = (channelId) => {
    dispatch(setCurrentChannel(channelId));
  };

  const handleAddChannel = async (name) => {
    setIsSubmitting(true);
    try {
      const { data: newChannel } = await axios.post(
        '/api/v1/channels',
        { name },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dispatch(addChannel(newChannel));
      dispatch(setCurrentChannel(newChannel.id));
      setShowAddModal(false);
      toast.success(t('toast.channelCreated'));
    } catch (err) {
      rollbar.error(err);
      toast.error(t('toast.channelCreateError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveChannel = async () => {
    if (!selectedChannel) return;
    setIsSubmitting(true);
    try {
      await axios.delete(`/api/v1/channels/${selectedChannel.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(removeChannel(selectedChannel.id));
      if (currentChannelId === selectedChannel.id) {
        dispatch(setCurrentChannel('1'));
      }
      setShowRemoveModal(false);
      toast.success(t('toast.channelRemoved'));
    } catch (err) {
      rollbar.error(err);
      toast.error(t('toast.channelRemoveError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRenameChannel = async (name) => {
    if (!selectedChannel) return;
    setIsSubmitting(true);
    try {
      const { data: updatedChannel } = await axios.patch(
        `/api/v1/channels/${selectedChannel.id}`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dispatch(updateChannel(updatedChannel));
      setShowRenameModal(false);
      toast.success(t('toast.channelRenamed'));
    } catch (err) {
      rollbar.error(err);
      toast.error(t('toast.channelRenameError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (status === 'loading') {
      return <div className="p-3">{t('channels.loading')}</div>;
    }
    if (status === 'failed') {
      return <div className="p-3 text-danger">{t('channels.error', { error })}</div>;
    }
    return channels.map((channel) => (
      <Channel
        key={channel.id}
        channel={channel}
        isActive={channel.id === currentChannelId}
        onClick={() => handleChannelClick(channel.id)}
        onRemoveClick={() => { setSelectedChannel(channel); setShowRemoveModal(true); }}
        onRenameClick={() => { setSelectedChannel(channel); setShowRenameModal(true); }}
      />
    ));
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <strong>{t('channels.title')}</strong>
        <Button variant="outline-primary" size="sm" onClick={() => setShowAddModal(true)}>
          {t('channels.add')}
        </Button>
      </div>
      <Nav variant="pills" className="flex-column overflow-auto" style={{ flexGrow: 1 }}>
        {renderContent()}
      </Nav>
      <AddChannelModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        existingChannelNames={existingChannelNames}
        onSubmit={handleAddChannel}
        isSubmitting={isSubmitting}
      />
      <RemoveChannelModal
        show={showRemoveModal}
        handleClose={() => setShowRemoveModal(false)}
        onConfirm={handleRemoveChannel}
        isSubmitting={isSubmitting}
      />
      <RenameChannelModal
        show={showRenameModal}
        handleClose={() => setShowRenameModal(false)}
        currentName={selectedChannel?.name}
        existingChannelNames={existingChannelNames}
        onSubmit={handleRenameChannel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Channels;
