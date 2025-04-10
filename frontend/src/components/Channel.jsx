import React from 'react';
import { Nav } from 'react-bootstrap';

const Channel = ({ channel, isActive, onClick }) => {
  return (
    <Nav.Item as="li">
      <Nav.Link
        active={isActive}
        onClick={onClick}
        className="d-flex align-items-center"
      >
        <span className="me-2">#</span>
        {channel.name}
      </Nav.Link>
    </Nav.Item>
  );
};

export default Channel;
