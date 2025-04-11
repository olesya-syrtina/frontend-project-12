import React, { useState, useEffect, useRef } from 'react';
import { Col, Form, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { fetchMessages, addMessage, confirmMessage } from '../slices/messagesSlice';
import socket from '../socket';

const Messages = () => {
  const dispatch = useDispatch();
  const { messages, status, error } = useSelector((state) => state.messages);
  const { token, username } = useSelector((state) => state.authorization);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMessages());
    }
  }, [dispatch, status]);

  useEffect(() => {
    const handleNewMessage = (message) => {
      if (message.channelId === '1') {
        dispatch(addMessage(message));
      }
    };

    socket.on('newMessage', handleNewMessage);
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      id: tempId,      
      tempId,
      body: newMessage,
      channelId: '1',    
      username,
      optimistic: true,
    };

    dispatch(addMessage(optimisticMessage));
    try {
      const response = await axios.post(
        '/api/v1/messages',
        {
          body: newMessage,
          channelId: '1',
          username,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch(confirmMessage({ tempId, message: response.data }));

      socket.emit('newMessage', response.data, (ack) => {
        console.log('Сообщение доставлено, ack:', ack);
      });
    } catch (err) {
      console.error('Ошибка отправки сообщения', err);
    }

    setNewMessage('');
  };

  const messagesForGeneral = messages.filter((m) => m.channelId === '1');

  return (
    <Col className="bg-white d-flex flex-column">
      <div
        className="p-4 flex-grow-1"
        style={{ minHeight: '80vh', overflowY: 'auto' }}
      >
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b># general</b>
          </p>
          <span className="text-muted">
            {messagesForGeneral.length}{' '}
            {messagesForGeneral.length === 1 ? 'сообщение' : 'сообщений'}
          </span>
        </div>
        {status === 'loading' && <p>Загрузка сообщений...</p>}
        {status === 'failed' && (
          <p className="text-danger">Ошибка загрузки: {error}</p>
        )}
        {status === 'succeeded' &&
          messagesForGeneral.map((message) => (
            <div key={message.id} className="text-break mb-2">
              <b>{message.username}</b>: {message.body}
            </div>
          ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="border-top p-3">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="d-flex">
            <Form.Control
              type="text"
              placeholder="Введите сообщение..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button variant="primary" type="submit" className="ms-2">
              Отправить
            </Button>
          </Form.Group>
        </Form>
      </div>
    </Col>
  );
};

export default Messages;
