import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './Header.jsx';
import Channels from './Channels.jsx';
import Messages from './Messages.jsx';

const HomePage = () => {
  return (
    <>
      <Header />

      <Container fluid className="h-100 my-4 overflow-hidden rounded shadow">
        <Row className="h-100 bg-white flex-md-row">
          <Col xs={4} md={2} lg={2} className="border-end bg-light">
            <Channels />
          </Col>
          <Messages />
        </Row>
      </Container>
    </>
  );
};

export default HomePage;
