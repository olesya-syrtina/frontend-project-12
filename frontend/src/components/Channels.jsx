import React, { useEffect } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChannels, setCurrentChannel } from '../slices/channelsSlice';
import Channel from './Channel.jsx';

const Channels = () => {
  const dispatch = useDispatch();
  const { channels, status, currentChannelId, error } = useSelector((state) => state.channels);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchChannels());
    }
  }, [dispatch, status]);

  const handleChannelClick = (channelId) => {
    dispatch(setCurrentChannel(channelId));
  };

  let content;
  if (status === 'loading') {
    content = <div className="p-3">Загрузка...</div>;
  } else if (status === 'failed') {
    content = <div className="p-3 text-danger">Ошибка: {error}</div>;
  } else {
    content = channels.map((channel) => (
      <Channel
        key={channel.id}
        channel={channel}
        isActive={channel.id === currentChannelId}
        onClick={() => handleChannelClick(channel.id)}
      />
    ));
  }

  return (
    <div className="d-flex flex-column h-100">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <strong>Каналы</strong>
        <Button variant="outline-primary" size="sm">
          +
        </Button>
      </div>
      <Nav variant="pills" className="flex-column overflow-auto" style={{ flexGrow: 1 }}>
        {content}
      </Nav>
    </div>
  );
};

export default Channels;
