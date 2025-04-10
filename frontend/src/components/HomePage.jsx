import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Header from './Header.jsx';
import Channels from './Channels.jsx';

const HomePage = () => {
  return (
    <>
      <Header />

      <Container fluid className="h-100 my-4 overflow-hidden rounded shadow">
        <Row className="h-100 bg-white flex-md-row">
          <Col xs={4} md={2} lg={2} className="border-end bg-light">
            <Channels />
          </Col>

          <Col className="bg-white d-flex flex-column">
            <div className="p-4 flex-grow-1" style={{ minHeight: '80vh' }}>
              <p>Здесь будут отображаться сообщения чата...</p>
            </div>
            <div className="border-top p-3">
              <Form>
                <Form.Group className="d-flex">
                  <Form.Control type="text" placeholder="Введите сообщение..." />
                  <Button variant="primary" type="submit" className="ms-2">
                    Отправить
                  </Button>
                </Form.Group>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomePage;
