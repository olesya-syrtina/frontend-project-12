import React, { useEffect, useState } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChannels, setCurrentChannel, addChannel, updateChannel, removeChannel } from '../slices/channelsSlice';
import Channel from './Channel.jsx';
import AddChannelModal from './modal/Add.jsx';
import RemoveChannelModal from './modal/Remove.jsx';
import RenameChannelModal from './modal/Rename.jsx';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';

const Channels = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const rollbar = useRollbar();
  const { channels, status, currentChannelId, error } = useSelector((state) => state.channels);
  const { token } = useSelector((state) => state.authorization);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchChannels());
    }
  }, [dispatch, status]);

  const handleChannelClick = (channelId) => {
    dispatch(setCurrentChannel(channelId));
  };

  const existingChannelNames = channels.map(c => c.name);

  const handleAddChannel = async (name) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/v1/channels', { name }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newChannel = response.data;
      dispatch(addChannel(newChannel));
      dispatch(setCurrentChannel(newChannel.id));
      setShowAddModal(false);
      toast.success(t('toast.channelCreated'));
    } catch (err) {
      console.error(t('channels.error'), err);
      toast.error(t('toast.channelCreateError'));
      rollbar.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveChannel = async () => {
    if (!selectedChannel) return;
    setIsSubmitting(true);
    try {
      await axios.delete(`/api/v1/channels/${selectedChannel.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch(removeChannel(selectedChannel.id));
      if (currentChannelId === selectedChannel.id) {
        dispatch(setCurrentChannel('1'));
      }
      setShowRemoveModal(false);
      setSelectedChannel(null);
      toast.success(t('toast.channelRemoved'));
    } catch (err) {
      console.error(t('channels.error'), err);
      toast.error(t('toast.channelRemoveError'));
      rollbar.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRenameChannel = async (name) => {
    if (!selectedChannel) return;
    setIsSubmitting(true);
    try {
      const response = await axios.patch(`/api/v1/channels/${selectedChannel.id}`, { name }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedChannel = response.data;
      dispatch(updateChannel(updatedChannel));
      setShowRenameModal(false);
      setSelectedChannel(null);
      toast.success(t('toast.channelRenamed'));
    } catch (err) {
      console.error(t('channels.error'), err);
      toast.error(t('toast.channelRenameError'));
      rollbar.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  let content;
  if (status === 'loading') {
    content = <div className="p-3">{t('channels.loading')}</div>;
  } else if (status === 'failed') {
    content = <div className="p-3 text-danger">{t('channels.error', { error })}</div>;
  } else {
    content = channels.map((channel) => (
      <Channel
        key={channel.id}
        channel={channel}
        isActive={channel.id === currentChannelId}
        onClick={() => handleChannelClick(channel.id)}
        onRemoveClick={(chan) => { setSelectedChannel(chan); setShowRemoveModal(true); }}
        onRenameClick={(chan) => { setSelectedChannel(chan); setShowRenameModal(true); }}
      />
    ));
  }

  return (
    <div className="d-flex flex-column h-100">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <strong>{t('channels.title')}</strong>
        <Button variant="outline-primary" size="sm" onClick={() => setShowAddModal(true)}>
          {t('channels.add')}
        </Button>
      </div>
      <Nav variant="pills" className="flex-column overflow-auto" style={{ flexGrow: 1 }}>
        {content}
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
        handleClose={() => { setShowRemoveModal(false); setSelectedChannel(null); }}
        channelName={selectedChannel ? selectedChannel.name : ''}
        onConfirm={handleRemoveChannel}
        isSubmitting={isSubmitting}
      />
      <RenameChannelModal 
        show={showRenameModal}
        handleClose={() => { setShowRenameModal(false); setSelectedChannel(null); }}
        currentName={selectedChannel ? selectedChannel.name : ''}
        existingChannelNames={existingChannelNames}
        onSubmit={handleRenameChannel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Channels;
