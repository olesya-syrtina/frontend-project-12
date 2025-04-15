import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import notFoundPic from '../assets/notFound.svg';
import Header from './Header.jsx';

const NotFoundPage = () => {
     const { t } = useTranslation();

    return (
        <>
        <Header />
        <Container className="container-fluid h-100">
            <Row className="justify-content-center align-content-center h-100">
                <Col className="col-12 col-md-6 align-items-center justify-content-center">
                    <img src={notFoundPic} className="rounded-circle" alt={t('notFound.title')} />
                    <h1 className="mb-4 text-center">{t('notFound.title')}</h1>
                </Col>  
                <Card.Footer className="p-4">
                    <div className="text-center">
                    <span>{t('notFound.homePage')} </span>
                    <a href="/">{t('notFound.homePageLink')}</a>
                    </div>
                </Card.Footer>
            </Row>   
      </Container>  
      </>  
    );
}

export default NotFoundPage;