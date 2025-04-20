import {
  useState, useEffect, useRef, useCallback,
} from 'react';
import { Col, Form, Button } from 'react-bootstrap';
import { ArrowRightSquare } from 'react-bootstrap-icons';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import leoProfanity from 'leo-profanity';
import { useRollbar } from '@rollbar/react';
import socket from '../socket';
import { addMessage, confirmMessage } from '../slices/messagesSlice.js';

const Messages = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const rollbar = useRollbar();
  const { messages, status, error } = useSelector((state) => state.messages);
  const { token, username } = useSelector((state) => state.authorization);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  const channels = useSelector((state) => state.channels.channels);

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const handleNewMessage = useCallback((message) => {
    if (message.channelId === currentChannelId) {
      dispatch(addMessage(message));
    }
  }, [dispatch, currentChannelId]);

  useEffect(() => {
    socket.on('newMessage', handleNewMessage);
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [handleNewMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const cleanMessage = leoProfanity.clean(newMessage);

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      id: tempId,
      tempId,
      body: cleanMessage,
      channelId: currentChannelId,
      username,
      optimistic: true,
    };

    dispatch(addMessage(optimisticMessage));

    try {
      const { data } = await axios.post(
        '/api/v1/messages',
        { body: cleanMessage, channelId: currentChannelId, username },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dispatch(confirmMessage({ tempId, message: data }));
      socket.emit('newMessage', data);
    } catch (err) {
      console.error(t('messages.errorSend'), err);
      toast.error(t('toast.networkError'));
      rollbar.error(err);
    }

    setNewMessage('');
  };

  const messagesForCurrentChannel = messages.filter(
    (m) => m.channelId === currentChannelId,
  );

  const currentChannel = channels.find((c) => c.id === currentChannelId) || { name: t('messages.default.channel') };

  return (
    <Col className="bg-white d-flex flex-column">
      <div className="p-4 flex-grow-1" style={{ minHeight: '80vh', overflowY: 'auto' }}>
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>
              #
              {currentChannel.name}
            </b>
          </p>
          <span className="text-muted">
            {messagesForCurrentChannel.length}
            {' '}
            {messagesForCurrentChannel.length === 1
              ? t('messages.count.one')
              : t('messages.count.other')}
          </span>
        </div>
        {status === 'loading' && <p>{t('messages.loading')}</p>}
        {status === 'failed' && <p className="text-danger">{t('messages.error', { error })}</p>}
        {messagesForCurrentChannel.map((message) => (
          <div key={message.id} className="text-break mb-2">
            <b>{message.username}</b>
            :
            {message.body}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-top p-3">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="d-flex">
            <Form.Control
              type="text"
              placeholder={t('messages.placeholder')}
              aria-label={t('messages.inputLabel')}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button variant="light" type="submit" className="btn-group-vertical">
              <ArrowRightSquare size={20} />
              <span className="visually-hidden">{t('messages.send')}</span>
            </Button>
          </Form.Group>
        </Form>
      </div>
    </Col>
  );
};

export default Messages;
