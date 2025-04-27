import React, { useEffect } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';
import { fetchChannels, setCurrentChannel } from '../slices/channelsSlice.js';
import { openModal } from '../slices/uiSlice.js';
import Channel from './Channel.jsx';

const Channels = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const rollbar = useRollbar();
  const {
    channels, status, currentChannelId, error,
  } = useSelector((state) => state.channels);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchChannels());
  }, [dispatch, status]);

  const names = channels.map((c) => c.name);

  const onAdd = () => dispatch(openModal({
    type: 'add',
    props: {
      existingChannelNames: names,
      onSubmit: async (name) => {
        try {
          const { data } = await axios.post('/api/v1/channels', { name }, {
          });
          dispatch(setCurrentChannel(data.id));
          toast.success(t('toast.channelCreated'));
          dispatch(openModal({ type: null }));
        } catch (err) {
          rollbar.error(err);
          toast.error(t('toast.channelCreateError'));
        }
      },
    },
  }));

  const onRemove = (channel) => dispatch(openModal({
    type: 'remove',
    props: {
      channelId: channel.id,
      onConfirm: async () => {
        try {
          await axios.delete(`/api/v1/channels/${channel.id}`, {
          });
          toast.success(t('toast.channelRemoved'));
          dispatch(openModal({ type: null }));
        } catch (err) {
          rollbar.error(err);
          toast.error(t('toast.channelRemoveError'));
        }
      },
    },
  }));

  const onRename = (channel) => dispatch(openModal({
    type: 'rename',
    props: {
      currentName: channel.name,
      existingChannelNames: names.filter((n) => n !== channel.name),
      onSubmit: async (name) => {
        try {
          await axios.patch(`/api/v1/channels/${channel.id}`, { name }, {
          });
          toast.success(t('toast.channelRenamed'));
          dispatch(openModal({ type: null }));
        } catch (err) {
          rollbar.error(err);
          toast.error(t('toast.channelRenameError'));
        }
      },
    },
  }));

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
        onClick={() => dispatch(setCurrentChannel(channel.id))}
        onRemoveClick={() => onRemove(channel)}
        onRenameClick={() => onRename(channel)}
      />
    ));
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <strong>{t('channels.title')}</strong>
        <Button variant="outline-primary" size="sm" onClick={onAdd}>
          {t('channels.add')}
        </Button>
      </div>
      <Nav variant="pills" className="flex-column overflow-auto" style={{ flexGrow: 1 }}>
        {renderContent()}
      </Nav>
    </div>
  );
};

export default Channels;
