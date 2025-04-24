import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from './Header.jsx';
import Channels from './Channels.jsx';
import Messages from './Messages.jsx';
import { fetchChannels } from '../slices/channelsSlice.js';
import { fetchMessages } from '../slices/messagesSlice.js';

const HomePage = () => {
  const { isLoggedIn } = useSelector((state) => state.authorization);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchChannels());
      dispatch(fetchMessages());
    }
  }, [isLoggedIn, dispatch]);

  return (
    <>
      <Header />
      <Container fluid className="h-100 my-4 overflow-hidden rounded shadow">
        <Row className="h-100 bg-white flex-md-row">
          <Col md={3} className="border-end pt-5 px-0 bg-light">
            <Channels />
          </Col>
          <Messages />
        </Row>
      </Container>
    </>
  );
};

export default HomePage;
